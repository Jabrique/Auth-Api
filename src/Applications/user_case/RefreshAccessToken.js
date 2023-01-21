const RefreshToken = require('../../Domains/Authentications/entities/RefreshToken');

class RefreshAccessToken {
  constructor({ authRepo, tokenManager }) {
    this._authRepo = authRepo;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshToken(useCasePayload);

    await this._authRepo.checkAvailabilityToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.createAccessToken({ id });
    return accessToken;
  }
}

module.exports = RefreshAccessToken;
