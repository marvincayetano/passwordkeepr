module.exports = function(router, database) {
  router.get('/register', (req, res) => {
    res.render('register');
  });

  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/accounts', (req, res) => {
    res.render('accounts');
  });

  router.get('/organizations', (req, res) => {
    res.render('organizations');
  });

  router.get('/', (req, res) => {
    res.render('index');
  });

  return router;
}
