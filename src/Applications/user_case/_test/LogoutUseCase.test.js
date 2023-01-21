const AuthRepo = require('../../../Domains/Authentications/AuthRepo');
const LogoutUseCase = require('../LogoutUseCase');

describe('LogoutUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const payload = {};
    const logoutUseCase = new LogoutUseCase({});

    // Action and Assert
    await expect(logoutUseCase.execute(payload)).rejects.toThrowError('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };
    const logoutUseCase = new LogoutUseCase({});

    // Action and Assert
    await expect(logoutUseCase.execute(payload)).rejects.toThrowError('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async() => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthRepo = new AuthRepo();

    // mocking
    mockAuthRepo.checkAvailabilityToken = jest.fn().mockImplementation(()=> Promise.resolve())
    mockAuthRepo.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

    // Action
    const logoutUseCase = new LogoutUseCase({
      authRepo: mockAuthRepo,
    });

    await logoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthRepo.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthRepo.deleteToken).toBeCalledWith(useCasePayload.refreshToken)
  });
});
