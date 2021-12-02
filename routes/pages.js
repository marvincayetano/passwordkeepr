module.exports = function(router, database) {
  const { getAccountWithOrgId, getOrganizationWithUserId, getAccountWithUserId } = require('../db/utils')(database);

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

  router.get('/', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
    }

    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
        getAccountWithUserId(req.session.id).then(accounts => {
          console.log(accounts);
          if(accounts && accounts.length) {
            userWithOrg.accounts = accounts;
          }
          res.render('index', { data: userWithOrg });
      });
    });
  });

  return router;
}
