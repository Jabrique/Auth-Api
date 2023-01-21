const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('compare password function', () => {
    it('should throw error when password not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Assert
      await expect(bcryptPasswordHash.comparePassword('plaint_password', 'hashed_password')).rejects.toThrow(AuthenticationError);
    });

    it('should not throw authenticationsError when password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const password = 'test';
      const hashedPassword = await bcryptPasswordHash.hash(password);

      // Action and assert
      await expect(bcryptPasswordHash.comparePassword(password, hashedPassword))
        .resolves.not.toThrow(AuthenticationError);
      expect(spyCompare).toBeCalledWith(password, hashedPassword)
    });
  });
});
