const TokenManager = require('../TokenManager');

describe('Token Manager', () => {
  it('should throw error when invoke abstract behavior', async() => {
    const tokenManager = new TokenManager();

    // Assert
    await expect(() => tokenManager.createAccessToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(() => tokenManager.createRefreshToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(() => tokenManager.verifyRefreshToken('')).rejects.toThrowError('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
