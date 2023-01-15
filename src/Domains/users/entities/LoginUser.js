class LoginUser {
  constructor(payload) {
    this._validatePayload(payload);
    const { username, password } = payload;

    this.username = username;
    this.password = password;
  }

  _validatePayload({ username, password }) {
    if (!username || !password) {
      throw new Error('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LoginUser;
