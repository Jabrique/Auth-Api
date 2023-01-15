const NewAuth = require('../NewAuth');

describe('NewAuth entities', () => {
  it('should throw error when not contain needed property', () => {
    const payload = {
      accessToken: 'access token',
    };

    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when not meet data type specification', () => {
    const payload = {
      accessToken: 123,
      refreshToken: 'refreshToken',
    };

    expect(() => new NewAuth(payload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewAuth object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const { accessToken, refreshToken } = new NewAuth(payload);

    // Assert
    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
