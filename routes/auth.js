const bcrypt = require('bcrypt');

module.exports = function(router, database) {
  const { addUser, getUserWithEmailPassword, getUserWithEmail } = require('../db/utils')(database);

  // Create a new user
  router.post('/register', (req, res) => {
    const user = req.body;

    getUserWithEmail(user.email).then(resultUser => {
      if(resultUser !== null) {
        res.render('register', { error: "Email already exists!" });
        return;
      }


      if(user.password !== user.confirmPassword) {
        res.render('register', { error: "Passwords do not match" });
        return;
      }

      user.password = bcrypt.hashSync(user.password, 12);

      addUser(user)
      .then(user => {
        if (!user) {
          res.send({error: "Error occured while creatingn new account..."});
          return;
        }

        req.session.userId = user.id;
        res.redirect("/index");
      })
      .catch(e => {
        res.render('register', { error: e.message })
        return;
      });

    });
  });

  const login = function(email, password) {
    return getUserWithEmailPassword(email, password)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }

  router.post('/login', (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "Invalid email or password!"});
          return;
        }
        req.session.userId = user.id;
        res.render('index', { user });
      })
      .catch(e => res.send({ error: e.message }));
  });

  router.post('/logout', (req, res) => {
    req.session.id = null;
    res.redirect('/');
  });

  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({message: "not logged in"});
      return;
    }

    getUserWithId(userId)
      .then(user => {
        if (!user) {
          res.send({error: "no user with that id"});
          return;
        }

        res.send({ user });
      })
      .catch(e => res.send({ error: e.message }));
  });

  return router;
}
