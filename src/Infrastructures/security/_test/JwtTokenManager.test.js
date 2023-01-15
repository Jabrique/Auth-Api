const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const TokenManager = require('../../../Applications/security/TokenManager');

describe('Jwt Token', () => {
  it('should be instance of tokenManager', () => {
    expect(new JwtTokenManager()).toBeInstanceOf(TokenManager);
  });
  describe('createAccessToken function', () => {
    it('should create token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerateAccessToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const createdAccessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(typeof createdAccessToken).toEqual('string');
      expect(createdAccessToken).not.toEqual(payload);
      expect(spyGenerateAccessToken).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    });
  });

  describe('createRefresshToken', () => {
    it('should create refresh token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerateRefreshToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const createdRefreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(typeof createdRefreshToken).toEqual('string');
      expect(createdRefreshToken).not.toEqual(payload);
      expect(spyGenerateRefreshToken)
        .toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const AccesssToken = jwtTokenManager.createAccessToken({ id: 'user-123' });

      // Action and Assert
      await expect(() => jwtTokenManager.verifyRefreshToken(AccesssToken)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if verification refresh token success', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({ id: 'user-123' });

      // Action and Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError);
    });
  });
});
