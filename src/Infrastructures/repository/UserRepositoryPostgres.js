const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const result = await this._pool.query({
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    });

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${this._idGenerator()}`;

    const result = await this._pool.query({
      text: 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    });

    return new RegisteredUser({ ...result.rows[0] });
  }
}

module.exports = UserRepositoryPostgres;
