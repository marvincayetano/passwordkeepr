module.exports = function(pool) {
  const addUser =  function(user) {
    return new Promise((resolve, reject) => {
      pool
        .query(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;`, [user.email, user.password])
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

  const getOrganizationWithUserId = function(id) {
    return new Promise((resolve, reject) => {
      pool
        .query(`SELECT *, users.id as user_id FROM organizations JOIN users ON organizations.id = users.organization_id WHERE users.id=$1 LIMIT 1;`, [id])
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

  const getAccountWithOrgId = function(id) {
    return new Promise((resolve, reject) => {
      pool
        .query(`SELECT * FROM accounts JOIN organizations ON organizations.id = accounts.organization_id WHERE organizations.id=$1 LIMIT 1;`, [id])
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

  const getOrganizationWithNameId = function(orgName, id) {
    return new Promise((resolve, reject) => {
      pool
        .query(`SELECT * FROM organizations WHERE name=$1 AND creator_id=$2;`, [orgName, id])
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

  const addOrganization =  function(organization, creatorId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`INSERT INTO organizations (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *;`, [organization.name, organization.description, creatorId])
        .then((result) => {
          if(result && result.rowCount) {
            pool.query(`UPDATE users SET organization_id=$1 WHERE id=$2;`, [result.rows[0].id, creatorId]);
            resolve(result.rows[0])
          }

          resolve(null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  const addUserToOrganization =  function(organizationId, creatorId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`INSERT INTO user_organizations (user_id, organization_id) VALUES ($1, $2) RETURNING *;`, [creatorId, organizationId])
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

  const updateOrganization =  function(organization, creatorId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`UPDATE organizations SET name=$1, description=$2 WHERE id=$3 AND creator_id=$4;`, [organization.name, organization.description, organization.id, creatorId])
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

  const deleteOrganization =  function(id, creatorId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`DELETE FROM organizations WHERE id=$1 AND creator_id=$2;`, [id, creatorId])
        .then(() => {
          pool
            .query(`DELETE FROM user_organizations WHERE organization_id=$1;`, [id]);

          resolve(null);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Create Account
  const addAccount =  function(account, userId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`INSERT INTO accounts (user_id, category_id, name, description, url, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [ userId, account.categoryId, account.name, account.description, account.url, account.username, account.password ])
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

  // Update Account
  const updateAccount =  function(account) {
    return new Promise((resolve, reject) => {
      pool
        .query(`UPDATE accounts SET category_id=$1, name=$2, description=$3, url=$4, username=$5, password=$6 WHERE id=$7;`,
        [account.categoryId, account.name, account.description, account.url, account.username, account.password, account.id])
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

  // Delete Account
  const deleteAccount =  function(id, creatorId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`DELETE FROM accounts WHERE id=$1 AND user_id=$2;`, [id, creatorId])
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // Share Account to Organization
  const shareAccountToOrg =  function(accountId, organizationId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`UPDATE accounts SET organization_id=$1 WHERE id=$2 RETURNING *;`,
        [ organizationId, accountId ])
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

  // Unshare Account to Organization
  const unshareFromOrg =  function(accountId) {
    return new Promise((resolve, reject) => {
      pool
        .query(`UPDATE accounts SET organization_id=NULL WHERE id=$1 RETURNING *;`,
        [ accountId ])
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

  return {
    addUser,
    getUserWithEmailPassword,
    getUserWithEmail,
    getUserWithId,
    getAccountWithOrgId,
    getOrganizationWithUserId,
    getOrganizationWithNameId,
    addOrganization,
    addUserToOrganization,
    updateOrganization,
    deleteOrganization,
    addAccount,
    updateAccount,
    deleteAccount,
    shareAccountToOrg,
    unshareFromOrg
  };

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

}
