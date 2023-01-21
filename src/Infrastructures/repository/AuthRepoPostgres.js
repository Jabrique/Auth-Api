const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthRepo = require('../../Domains/Authentications/AuthRepo');

class AuthRepoPosgres extends AuthRepo {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    await this._pool.query({
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    });
  }

  async checkAvailabilityToken(token) {
    const query = await this._pool.query({
      text: 'SELECT token FROM authentications WHERE token=$1',
      values: [token],
    });
    if (!query.rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token) {
    await this._pool.query({
      text: 'DELETE FROM authentications WHERE token=$1',
      values: [token],
    });
  }
}

module.exports = AuthRepoPosgres;
