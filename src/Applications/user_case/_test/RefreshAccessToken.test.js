const AuthRepo = require('../../../Domains/Authentications/AuthRepo');
const TokenManager = require('../../security/TokenManager');
const RefreshAccessToken = require('../RefreshAccessToken');

describe('RefreshAccessTokenCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};

    // Action
    const refreshAccessToken = new RefreshAccessToken({});

    // Assert
    await expect(() => refreshAccessToken.execute(useCasePayload)).rejects.toThrowError('REFRESH_ACCESS_TOKEN.METHOD_NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    const useCasePayload = {
      refreshToken: 123,
    };

    const refreshAccessToken = new RefreshAccessToken({});

    // Assert
    await expect(() => refreshAccessToken.execute(useCasePayload)).rejects.toThrowError('REFRESH_ACCESS_TOKEN.METHOD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };

    const mockAuthRepo = new AuthRepo();
    const mockTokenManager = new TokenManager();

    mockAuthRepo.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('accessToken123'));

    // Action
    const refreshAccessToken = new RefreshAccessToken({
      authRepo: mockAuthRepo,
      tokenManager: mockTokenManager,
    });

    const accessToken = await refreshAccessToken.execute(useCasePayload);

    // Assert
    expect(mockAuthRepo.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.createAccessToken).toBeCalledWith({ id: 'user-123' });
    expect(accessToken).toEqual('accessToken123');
  });
});
