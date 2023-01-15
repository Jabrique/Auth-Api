const AuthRepo = require('../../../Domains/Authentications/AuthRepo');
const NewAuth = require('../../../Domains/Authentications/entities/NewAuth');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const TokenManager = require('../../security/TokenManager');
const LoginUseCase = require('../LoginUseCase');

describe('LoginUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const expectedToken = new NewAuth({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockTokenManager = new TokenManager();
    const mockAuthRepo = new AuthRepo();

    // mocking
    mockUserRepository.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve('encrypted password'));
    mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user-123'));
    mockTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(expectedToken.accessToken));
    mockTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(expectedToken.refreshToken));
    mockAuthRepo.addToken = jest.fn().mockImplementation(() => Promise.resolve());

    // creating use case
    const loginUseCase = new LoginUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      tokenManager: mockTokenManager,
      authRepo: mockAuthRepo,
    });

    // Action
    const actualAuthentication = await loginUseCase.execute(useCasePayload)

    // Assert
    expect(actualAuthentication).toEqual(expectedToken)
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.comparePassword).toBeCalledWith(useCasePayload.password, 'encrypted password')
    expect(mockUserRepository.getIdByUsername).toBeCalledWith(useCasePayload.username)
    expect(mockTokenManager.createAccessToken).toBeCalledWith({username: useCasePayload.username, id: 'user-123'})
    expect(mockTokenManager.createRefreshToken).toBeCalledWith({username: useCasePayload.username, id: 'user-123'})
    expect(mockAuthRepo.addToken).toBeCalledWith(expectedToken.refreshToken)
  });
});
