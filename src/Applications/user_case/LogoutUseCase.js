const RefreshToken = require('../../Domains/Authentications/entities/RefreshToken');

class LogoutUseCase {
  constructor({ authRepo }) {
    this._authRepo = authRepo;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshToken(useCasePayload);
    await this._authRepo.checkAvailabilityToken(refreshToken);
    await this._authRepo.deleteToken(refreshToken);
  }
}

module.exports = LogoutUseCase;
