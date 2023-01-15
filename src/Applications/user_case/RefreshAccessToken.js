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

    const newAccessToken = await this._tokenManager.createAccessToken({ id });
    return newAccessToken;
  }

  _validateUseCasePayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_ACCESS_TOKEN.METHOD_NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_ACCESS_TOKEN.METHOD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshAccessToken;
