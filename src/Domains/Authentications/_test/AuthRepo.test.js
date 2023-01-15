const AuthRepo = require('../AuthRepo')

describe('AuthRepo', () => {
  it('should throw error when invoke abstract behavior', async() => {
    const authRepo = new AuthRepo()

    // Assert
    await expect(authRepo.addToken('')).rejects.toThrowError('AUTH_REPO.METHOD_NOT_IMPLEMENTED')
    await expect(authRepo.checkAvailabilityToken('')).rejects.toThrowError('AUTH_REPO.METHOD_NOT_IMPLEMENTED')
    await expect(authRepo.deleteToken('')).rejects.toThrowError('AUTH_REPO.METHOD_NOT_IMPLEMENTED')
  });
});
