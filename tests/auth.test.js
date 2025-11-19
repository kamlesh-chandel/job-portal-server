import request from 'supertest';
import { connectTestDB, closeTestDB, clearDB } from './setup/test-db.js';
import app from '../src/index.js';
import { ROLES } from '../src/constants/roles.js';

describe('Auth API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  test('POST /api/v1/auth/register → should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      role: ROLES.STUDENT, // 'student'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('john@example.com');
  });

  test('POST /api/v1/auth/login → should login user', async () => {

    await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      role: ROLES.STUDENT,
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'john@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.user.email).toBe('john@example.com');
  });

  test('POST /api/v1/auth/register → should fail for weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Weak User',
      email: 'weak@example.com',
      password: 'weak',
      role: ROLES.STUDENT,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Password');
  });

  test('POST /api/v1/auth/login → should fail for wrong password', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      role: ROLES.STUDENT,
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'john@example.com',
      password: 'WrongPassword123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
