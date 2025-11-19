import request from 'supertest';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { connectTestDB, closeTestDB, clearDB } from './setup/test-db.js';
import app from '../src/index.js';
import User from '../src/models/user.model.js';
import { generateAccessToken } from '../src/utils/token.js';

vi.mock('../src/config/cloudinary.js', () => ({
  default: {
    uploader: {
      upload_stream: (config, callback) => ({
        end() {
          callback(null, {
            secure_url: 'https://fake-cloudinary-url.com/file',
          });
        },
      }),
    },
  },
}));

describe('User Module API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  test('PUT /api/v1/users/me → should update profile', async () => {
    const user = await User.create({
      name: 'Kamlesh',
      email: 'test@example.com',
      password: '12345678',
    });

    const token = generateAccessToken({ user_id: user._id.toString() });

    const res = await request(app)
      .put('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'Updated Kamlesh')
      .field('skills', 'JavaScript,React')
      .field('linkedinUrl', 'https://linkedin.com/in/test')
      .field('githubUrl', 'https://github.com/test');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Kamlesh');
    expect(res.body.data.profile.skills).toEqual(['JavaScript', 'React']);
    expect(res.body.data.social_links.linkedin_url).toBe(
      'https://linkedin.com/in/test'
    );
    expect(res.body.data.social_links.github_url).toBe(
      'https://github.com/test'
    );
  });

  test('PUT /api/v1/users/me/photo → should upload profile photo', async () => {
    const user = await User.create({
      name: 'Kamlesh',
      email: 'photo@example.com',
      password: '12345678',
    });

    const token = generateAccessToken({ user_id: user._id.toString() });

    const res = await request(app)
      .put('/api/v1/users/me/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('profile', Buffer.from('test file'), 'photo.png');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.profile_url).toBe(
      'https://fake-cloudinary-url.com/file'
    );
  });

  test('PUT /api/v1/users/me → should return validation error', async () => {
    const user = await User.create({
      name: 'ABC',
      email: 'abc@example.com',
      password: '12345678',
    });

    const token = generateAccessToken({ user_id: user._id.toString() });

    const res = await request(app)
      .put('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .field('email', 'invalid-email');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('PUT /api/v1/users/me → should return 401 for missing token', async () => {
    const res = await request(app)
      .put('/api/v1/users/me')
      .send({ name: 'Test' });

    expect(res.status).toBe(401);
  });
});
