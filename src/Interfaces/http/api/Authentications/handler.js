const LoginUseCase = require('../../../../Applications/user_case/LoginUseCase');
const LogoutUseCase = require('../../../../Applications/user_case/LogoutUseCase');
const RefreshAccessToken = require('../../../../Applications/user_case/RefreshAccessToken');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
    this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
  }

  async postAuthenticationsHandler(request, h) {
    const loginUseCase = this._container.getInstance(LoginUseCase.name);
    const { accessToken, refreshToken } = await loginUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationsHandler(request) {
    const refreshAccessToken = this._container.getInstance(RefreshAccessToken.name);
    const accessToken = await refreshAccessToken.execute(request.payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationsHandler(request) {
    const logoutUseCase = this._container.getInstance(LogoutUseCase.name);
    await logoutUseCase.execute(request.payload);

    return {
      status: 'success',
      message: 'refreshToken berhasil dihapus',
    };
  }
}
module.exports = AuthenticationsHandler;
