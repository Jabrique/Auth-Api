class LogoutUseCase {
  constructor({ authRepo }) {
    this._authRepo = authRepo;
  }

  async execute(useCasePayload) {
    this._validateUseCasePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authRepo.checkAvailabilityToken(refreshToken);
    await this._authRepo.deleteToken(refreshToken);
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

module.exports = LogoutUseCase;
