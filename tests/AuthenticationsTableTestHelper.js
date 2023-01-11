/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    await pool.query({
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    });
  },

  async findToken(token) {
    const result = await pool.query({
      text: 'SELECT * FROM authentications WHERE token=$1',
      values: [token],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE authentications');
  },
};

module.exports = AuthenticationsTableTestHelper;
