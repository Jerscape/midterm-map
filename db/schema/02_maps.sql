-- Drop and recreate Maps table

DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  uid VARCHAR(255) NOT NULL,
<<<<<<< HEAD
  title VARCHAR(255) NOT NULL
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
=======
  title VARCHAR(255) NOT NULL,
  center_latitude DOUBLE PRECISION NOT NULL,
  center_longitude DOUBLE PRECISION NOT NULL
>>>>>>> 6d17ad09ce405bcea72f06ab4d31a5a8c813674c
);
