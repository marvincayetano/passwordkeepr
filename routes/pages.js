module.exports = function(router, database) {
  router.get('/register', (_req, res) => {
    res.render('register');
  });

  router.get('/login/:id', (req, res) => {
    req.session.id = req.params.id;
    res.render('index');
  });

  router.get('/login', (_req, res) => {
    res.render('login');
  });

  router.get('/accounts', (_req, res) => {
    res.render('accounts');
  });

  router.get('/organizations', (_req, res) => {
    res.render('organizations');
  });

  router.get('/organizations/:id', (_req, res) => {
    res.render('organizations');
  });

  router.get('/', (_req, res) => {
    res.render('index');
  });

  return router;
}
