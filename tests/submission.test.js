import request from 'supertest';
import app from '../src/index.js';
import { connectTestDB, clearDB, closeTestDB } from './setup/test-db.js';
import User from '../src/models/user.model.js';
import Job from '../src/models/job.model.js';
import Company from '../src/models/company.model.js';
import jwt from 'jsonwebtoken';

const makeToken = (id, role = 'student') =>
  jwt.sign({ user_id: id, role }, process.env.JWT_SECRET);

describe('Submission Module', () => {
  let studentToken, recruiterToken, studentId, recruiterId, jobId;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    await connectTestDB();
  });

  beforeEach(async () => {
    const student = await User.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'pass123',
    });

    studentId = student._id.toString();
    studentToken = makeToken(studentId, 'student');

    const recruiter = await User.create({
      name: 'Recruiter User',
      email: 'recruiter@example.com',
      password: 'pass123',
    });

    recruiterId = recruiter._id.toString();
    recruiterToken = makeToken(recruiterId, 'recruiter');

    const company = await Company.create({
      name: 'Fake Co',
      website: 'https://abc.com',
      address: { city: 'Delhi' },
      user_id: recruiterId,
    });

    const job = await Job.create({
      title: 'Backend Developer',
      description: 'Node, MongoDB',
      requirements: ['Node'],
      salary: 50000,
      experience_level: 1,
      location: 'Remote',
      job_type: 'full-time',
      positions: 2,
      company_id: company._id,
      created_by: recruiterId,
    });

    jobId = job._id.toString();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  // ============ TEST 1 ============
  test('POST /api/v1/submissions → student can apply', async () => {
    const res = await request(app)
      .post('/api/v1/submissions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ job_id: jobId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // ============ TEST 2 ============
  test('POST /api/v1/submissions → prevent duplicate apply', async () => {
    await request(app)
      .post('/api/v1/submissions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ job_id: jobId });

    const res = await request(app)
      .post('/api/v1/submissions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ job_id: jobId });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  // ============ TEST 3 ============
  test('POST /api/v1/submissions → recruiter cannot apply', async () => {
    const res = await request(app)
      .post('/api/v1/submissions')
      .set('Authorization', `Bearer ${recruiterToken}`)
      .send({ job_id: jobId });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
