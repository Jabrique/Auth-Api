/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const usersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'dicoding indonesia',
  }) {
    await pool.query({
      text: 'INSERT INTO users VALUES($1,$2,$3,$4)',
      values: [id, username, password, fullname],
    });
  },

  async findUsersById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM USERS WHERE id=$1',
      values: [id],
    });
    return result.rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users');
  },
};

module.exports = usersTableTestHelper;
