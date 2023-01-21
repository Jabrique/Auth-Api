const NewAuth = require('../../Domains/Authentications/entities/NewAuth');
const LoginUser = require('../../Domains/users/entities/LoginUser');

class LoginUseCase {
  constructor({
    userRepository, passwordHash, tokenManager, authRepo,
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
    this._authRepo = authRepo;
  }

  async execute(useCasePayload) {
    const { username, password } = new LoginUser(useCasePayload);

    const hashedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, hashedPassword);

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken = await this._tokenManager.createAccessToken({ username, id });
    const refreshToken = await this._tokenManager.createRefreshToken({ username, id });

    const newAuthentication = new NewAuth({ accessToken, refreshToken });

    await this._authRepo.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

module.exports = LoginUseCase;
