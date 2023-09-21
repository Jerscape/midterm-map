const db = require('../connection');

const getFavourites = () => {
  return db.query(`SELECT
  * FROM maps
  LIMIT 3`)
    .then(data => {
      return data.rows;//jn returning an array of objects
    });
};

module.exports = { getFavourites };
