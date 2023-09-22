const db = require('../connection');


const getFavourites = (userid) => {
  const queryString = `
  SELECT * FROM favourites
  JOIN maps ON favourites.map_id = maps.id
  WHERE favourites.user_id = $1;`;
  return db.query(queryString, [userid])
    .then((data) => {
    return data.rows;
  });
};

const addFavourites = (userid, mapid) => {
  const queryString = `
  INSERT INTO favourites (user_id, map_id)
  VALUES ($1, $2)
  RETURNING *;`;
  return db.query(queryString, [userid, mapid])
    .then((result) => {
      return result.rows[0];

  });

}

module.exports = { getFavourites, addFavourites };

