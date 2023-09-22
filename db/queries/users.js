const db = require('../connection');

const getUsers = (userid) => {
  const queryString = `
  SELECT * FROM users
  WHERE users.id = $1;
  `;
  return db.query(queryString, [userid])
    .then(data => {
      return data.rows;//jn returning an array of objects
    });
};

module.exports = { getUsers };
