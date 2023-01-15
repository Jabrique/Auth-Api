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
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }
    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUseCase;
