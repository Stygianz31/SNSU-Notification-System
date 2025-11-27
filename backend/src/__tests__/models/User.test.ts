import User from '../../models/User';
import sequelize from '../../database/config';

describe('User Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User Creation', () => {
    it('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        phone: '+639123456789',
        password: 'password123',
        role: 'student' as 'admin' | 'teacher' | 'student'
      };

      const user = await User.create(userData);

      expect(user.id).toBeDefined();
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('student');
    });

    it('should hash password before saving', async () => {
      const userData = {
        username: 'testuser2',
        email: 'test2@example.com',
        phone: '+639123456789',
        password: 'plaintext',
        role: 'student' as 'admin' | 'teacher' | 'student'
      };

      const user = await User.create(userData);

      expect(user.password).not.toBe('plaintext');
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });

    it('should not allow duplicate username', async () => {
      const userData = {
        username: 'duplicate',
        email: 'unique@example.com',
        phone: '+639123456789',
        password: 'password123',
        role: 'student' as 'admin' | 'teacher' | 'student'
      };

      await User.create(userData);

      await expect(
        User.create({ ...userData, email: 'different@example.com' })
      ).rejects.toThrow();
    });
  });

  describe('Password Validation', () => {
    it('should validate correct password', async () => {
      const password = 'mypassword123';
      const user = await User.create({
        username: 'passtest',
        email: 'passtest@example.com',
        phone: '+639123456789',
        password,
        role: 'student'
      });

      const isValid = await user.comparePassword(password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await User.create({
        username: 'passtest2',
        email: 'passtest2@example.com',
        phone: '+639123456789',
        password: 'correctpassword',
        role: 'student'
      });

      const isValid = await user.comparePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('toJSON Method', () => {
    it('should exclude password from JSON output', async () => {
      const user = await User.create({
        username: 'jsontest',
        email: 'jsontest@example.com',
        phone: '+639123456789',
        password: 'password123',
        role: 'student'
      });

      const json = user.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.username).toBe('jsontest');
      expect(json.email).toBe('jsontest@example.com');
    });
  });
});
