const bcrypt = require('bcrypt');

module.exports = function(router, database) {
  const { addUser, getUserWithEmailPassword } = require('../db/utils')(database);

  // Create a new user
  router.post('/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);

    addUser(user, database)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }

      req.session.userId = user.id;
      res.redirect("/index");
    })
    .catch(e => res.send(e));

  });

  /**
   * Check if a user exists with a given username and password
   * @param {String} email
   * @param {String} password encrypted
   */
  const login =  function(email, password) {
    return getUserWithEmailPassword(email, password)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }
  exports.login = login;

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.render('index', {user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch(e => res.send(e));
  });

  router.post('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('/');
  });

  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }

    database.getUserWithId(userId)
      .then(user => {
        if (!user) {
          res.send({error: "no user with that id"});
          return;
        }

        res.send({user: {name: user.name, email: user.email, id: userId}});
      })
      .catch(e => res.send(e));
  });

  return router;
}
