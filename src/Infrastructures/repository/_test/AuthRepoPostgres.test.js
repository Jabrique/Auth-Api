const AuthRepoPosgres = require('../AuthRepoPostgres');
const AuthRepo = require('../../../Domains/Authentications/AuthRepo');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthRepoPosgres', () => {
  it('should be instance of authRepo domain', () => {
    const authRepoPosgres = new AuthRepoPosgres();
    expect(authRepoPosgres).toBeInstanceOf(AuthRepo);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await AuthenticationsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addToken function', () => {
      it('should add token to database', async () => {
        // Arrange
        const authRepoPosgres = new AuthRepoPosgres(pool);
        const token = 'token';

        // Action
        authRepoPosgres.addToken(token);

        // Assert
        const tokens = await AuthenticationsTableTestHelper.findToken(token);
        expect(tokens).toHaveLength(1);
        expect(tokens[0].token).toBe(token);
      });
    });

    describe('checkAvailabilityToken', () => {
      it('should throw InvariantError when token not available', async () => {
        // Arrange
        const authRepoPosgres = new AuthRepoPosgres(pool);

        // Action and Assert
        await expect(() => authRepoPosgres.checkAvailabilityToken('token')).rejects.toThrowError(InvariantError);
      });

      it('should not throw InvariantError when token is available', async () => {
        // Arrange
        const authRepoPosgres = new AuthRepoPosgres(pool);
        const token = 'token';
        await AuthenticationsTableTestHelper.addToken(token);

        // Action and Assert
        await expect(authRepoPosgres.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError);
      });
    });

    describe('deleteToken', () => {
      it('should delete token from database', async () => {
        // Arrange
        const authRepoPosgres = new AuthRepoPosgres(pool);
        const token = 'token';
        await AuthenticationsTableTestHelper.addToken(token);

        // Action
        await authRepoPosgres.deleteToken(token);

        // Assert
        const deletedToken = await AuthenticationsTableTestHelper.findToken(token);
        expect(deletedToken).toHaveLength(0);
      });
    });
  });
});
