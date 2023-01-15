class AuthRepo {
  async addToken(token) {
    throw new Error('AUTH_REPO.METHOD_NOT_IMPLEMENTED');
  }

  async checkAvailabilityToken(token) {
    throw new Error('AUTH_REPO.METHOD_NOT_IMPLEMENTED');
  }

  async deleteToken(token) {
    throw new Error('AUTH_REPO.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthRepo;
