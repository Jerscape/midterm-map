const db = require('../connection');


const getFavourites = (mapid) => {
  const queryString =
  `SELECT * FROM maps
  WHERE maps.id = $1`;
  return db.query(queryString, [mapid]).then((data) => {
    return data.rows;
  });
};

module.exports = { getFavourites };

