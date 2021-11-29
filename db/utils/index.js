/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user, pool) {
  return new Promise((resolve, reject) => {
    pool
      .query(`INSERT INTO users (email, password, created_at) VALUES ($1, $2, $3) RETURNING *;`, [user.email, user.password, new Date()])
      .then((result) => {
        console.log(result);
        if(result && result.rowCount) {
          resolve(result.rows[0])
        }

        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
exports.addUser = addUser;

//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
const getUserWithEmailPassword = function(email, password) {
  return new Promise((resolve, reject) => {
    pool
    .query(`SELECT * FROM users WHERE email=$1 AND password=$2;`, [email.toLowerCase(), password.toLowerCase()])
    .then((result) => {
      if(result && result.rowCount) {
        resolve(result.rows[0])
      }

      resolve(null);
    })
    .catch((error) => {
      reject(error);
    })
  });
}
exports.getUserWithEmail = getUserWithEmailPassword;

//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
const getUserWithEmail = function(email) {
  return new Promise((resolve, reject) => {
    pool
    .query(`SELECT * FROM users WHERE email LIKE $1;`, [email.toLowerCase()])
    .then((result) => {
      if(result && result.rowCount) {
        resolve(result.rows[0])
      }

      resolve(null);
    })
    .catch((error) => {
      reject(error);
    })
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return new Promise((resolve, reject) => {
    pool
      .query(`SELECT * FROM users WHERE id=$1;`, [id])
      .then((result) => {
        if(result && result.rowCount) {
          resolve(result.rows[0])
        }

        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
    });
}
exports.getUserWithId = getUserWithId;

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return new Promise((resolve, reject) => {
    pool
      .query(`SELECT * FROM reservations WHERE guest_id=$1 LIMIT $2;`, [guest_id, limit])
      .then((result) => {
        if(result && result.rowCount) {
          resolve(result.rows)
        }

        resolve(null);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    if(options.city) {
      queryString += 'AND ';
    } else {
      queryString += 'WHERE ';
    }

    queryParams.push(options.owner_id);
    queryString += `owner_id=$${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    if(options.city || options.owner_id) {
      queryString += 'AND ';
    } else {
      queryString += 'WHERE ';
    }

    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `minimum_price_per_night >= $${queryParams.length - 1} AND maximum_price_per_night <= $${queryParams.length} `;
  }

  if(options.minimum_rating) {
    if(options.city || options.owner_id || (options.minimum_price_per_night && options.maximum_price_per_night)) {
      queryString += 'AND ';
    } else {
      queryString += 'WHERE ';
    }

    queryParams.push(options.minimum_rating);
    queryString += `minimum_rating >= $${queryParams.length} `;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return new Promise((resolve, reject) => {
    return pool
      .query(queryString, queryParams)
      .then((result) => {
        if(result && result.rowCount) {
          resolve(result.rows)
        }

        resolve(null);
       })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.getAllProperties = getAllProperties;
