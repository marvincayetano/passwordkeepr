module.exports = function(router, database) {
  const { getAccountWithOrgId, getOrganizationWithUserId } = require('../db/utils')(database);

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

  router.get('/organization/create', (req, res) => {
    getOrganizationWithUserId(req.session.id).then(result => {
      if(result !== null) {
        res.redirect(`/organization/${result.id}`);
      } else {
        res.render('organization', result);
      }
    });
  });

  router.get('/organization/:id', (req, res) => {
    const {id} = req.params;

    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
      if(userWithOrg) {
        getAccountWithOrgId(id).then(accounts => {
          userWithOrg.accounts = accounts;
          console.log(userWithOrg);
          res.render('organization', { data: userWithOrg });
        });
      } else {
        res.render('organizationCreate', { error: "Invalid URL..."});
      }
    });
  });

  router.get('/', (_req, res) => {
    res.render('index');
  });

  return router;
}
