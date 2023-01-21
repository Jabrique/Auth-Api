const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltround = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltround;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password, hashedPassword) {
    const match = await this._bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('password anda salah');
    }
  }
}

module.exports = BcryptPasswordHash;
