const db = require('../connection');

const getMaps = () => {
  return db.query(`SELECT
  maps.id,
  maps.user_id,
  maps.uid,
  locations.title AS location_title,
  locations.description,
  locations.longitude,
  locations.latitude
  FROM maps
  JOIN locations
  ON maps.id = locations.map_id;`)
    .then(data => {
      return data.rows;//jn returning an array of objects
    });
};

//used by /api/pins/:mapid
const getPinsByMapId = (id) => {
  //is this a pool query?
  return db.query(`SELECT * FROM locations
  WHERE id = locations.id`, [])
    .then(data => {
      return data.rows;
    });
};


const getMapById = (id) => {
  return db.query(`SELECT * FROM maps
  WHERE maps.id = id`)
  .then(data => {
    return data.rows;
  })
};
//

//POST REQUESTS
const createMap = (parmsObj) => {
  //may have to adjuste params depending on how we choose to post (form, etc)

  let data =[paramsObj[title], paramsObj[latitude], parmsObj[longitude]]
  return db.query(`INSERT INTO maps (user_id, uid, title, center_longitude, center_latitude)
  VALUES ($1, $2, $3, $4, $5)`, data)
  .then(data => {
    return data.rows[0]
  })
  .catch((err)=> {
    console.log("create map error message: ", err.message)
  });

};

//jsut here for reference, delete later
// const addUser = function (user) {
//   return pool
//   .query(`INSERT INTO users (name, email, password)
//   VALUES ($1, $2, $3)
//   RETURNING *`, [user.name, user.email, user.password])
//   .then((result)=> {
//     return result.rows[0]
//   })
//   .catch((err) => {
//     console.log(err.message)
//   })

// };

module.exports = { getMaps, getPinsByMapId,getMapById, createMap };
