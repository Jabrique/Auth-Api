class RefreshAccessToken {
  constructor({ authRepo, tokenManager }) {
    this._authRepo = authRepo;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    this._validateUseCasePayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this._authRepo.checkAvailabilityToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.createAccessToken({ id });
    return accessToken;
  }

  _validateUseCasePayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshAccessToken;
