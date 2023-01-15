const LoginUser = require('../LoginUser');

describe('LoginUser', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      username: 'dicoding',
    };

    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      username: 123,
      password: 'secret',
    };

    expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object LoginUser correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    // Action
    const { username, password } = new LoginUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
