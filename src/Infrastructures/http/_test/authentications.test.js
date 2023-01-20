const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const usersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/authentications endpoint', () => {
  afterEach(() => {
    AuthenticationsTableTestHelper.cleanTable();
    usersTableTestHelper.cleanTable();
  });

  afterAll(() => {
    pool.end();
  });

  describe('when POST /authentications', () => {
    it('should thrwo error when username not available', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'test',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak ditemukan');
    });

    it('should return statusCode 401 when password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'test123',
      };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'wow123',
          fullname: 'dicoding Indonesia',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('password anda salah');
    });

    it('should return statusCode 400 when payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan login karena properti yang dibutuhkan tidak ada');
    });

    it('should return statusCode 400 when payload not meet data type specification', async () => {
      // Arrange
      const loginPayload = {
        username: 123,
        password: 'test',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan login karena tipe data tidak sesuai');
    });

    it('should response with statusCode 201 and new authentications', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'mantap',
      };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'mantap',
          fullname: 'dicoding Indonesia',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });
  });

  describe('when PUT /authentications', () => {
    it('should return statusCode 400 when refreshToken not string', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refreshToken harus string');
    });

    it('should return 400 if payload not contain refreshToken', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan pada payload');
    });

    it('should return statusCode 400 when refreshToken not valid', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: 'refresh_token',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 200 and get new accessToken', async () => {
      // Arrange
      const server = await createServer(container);

      // add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'mantap',
          fullname: 'dicoding Indonesia',
        },
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'mantap',
        },
      });

      const { data: { refreshToken } } = loginResponse;

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(response.data.accessToken).toBeDefined();
    });
  });

  describe('when DELETE /authentications', () => {
    it('should return 400 when refresh token not string', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 400 if payload not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 400 when refresh token not available in database', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 'dicoding',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 200 when success delete refresh token on database', async () => {
      // Arrange
      const server = await createServer(container);

      // add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'mantap',
          fullname: 'dicoding Indonesia',
        },
      });

      // post authentication
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'mantap',
        },
      });

      const { data: { refreshToken } } = JSON.parse(responseLogin.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
