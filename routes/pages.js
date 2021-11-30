module.exports = function(router, database) {
  const { getOrganizationWithId } = require('../db/utils')(database);

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
    const {id} = req.params;

    getOrganizationWithId(id).then(organization => {
      res.render(`organizations/${id}`, organization);
    });
  });

  router.get('/', (_req, res) => {
    res.render('index');
  });

  return router;
}
