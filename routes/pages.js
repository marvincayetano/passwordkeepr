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
      console.log(result);
      if(result !== null) {
        res.redirect(`/organization/${result.organization_id}`);
      } else {
        res.render('organizationCreate');
      }
    });
  });

  router.get('/organization/:id', (req, res) => {
    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
      if(userWithOrg) {
        getAccountWithOrgId(userWithOrg.organization_id).then(accounts => {
          userWithOrg.accounts = accounts;
          res.render('organization', { data: userWithOrg });
        });
      } else {
        res.render('organizationCreate');
      }
    });
  });

  router.get('/', (_req, res) => {
    res.render('index');
  });

  return router;
}
