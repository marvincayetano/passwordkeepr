module.exports = function(router, database) {
  const { getAccountWithOrgId, getOrganizationWithUserId, getAccountWithUserId, getSingleAccountWithUserId } = require('../db/utils')(database);

  router.get('/register', (_req, res) => {
    res.render('register');
  });

  router.get('/login/:id', (req, res) => {
    req.session.id = req.params.id;
    res.redirect('/');
  });

  router.get('/login', (_req, res) => {
    res.render('login');
  });

  router.get('/accounts/:id/edit', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
    }

    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
        getSingleAccountWithUserId(req.session.id, req.params.id).then(accounts => {
          if(accounts) {
            userWithOrg.account = accounts;
          }
          res.render('accountEdit', { data: userWithOrg });
      });
    });
  });

  router.get('/organization/create', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
      return;
    }

    getOrganizationWithUserId(req.session.id).then(result => {
        if(result.organization_id !== null) {
          res.redirect(`/organization/${result.organization_id}`);
        } else {
        res.render('organizationCreate', { data: result });
        }
    });
  });

  router.get('/organization', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
      return;
    }

    getOrganizationWithUserId(req.session.id).then(result => {
      if(result.organization_id !== null) {
        res.redirect(`/organization/${result.organization_id}`);
      } else {
        res.render('organizationCreate', { data: result });
      }
    });
  });

  router.get('/organization/:id', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
      return;
    }

    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
      if(userWithOrg) {
        getAccountWithOrgId(userWithOrg.organization_id).then(accounts => {
          if(accounts && accounts.length) {
            userWithOrg.accounts = accounts;
          }
          res.render('organization', { data: userWithOrg });
        });
      } else {
        res.redirect('/organization');
      }
    });
  });

  router.get('/', (req, res) => {
    if(!req.session.id) {
      res.redirect('/login');
    }

    getOrganizationWithUserId(req.session.id).then(userWithOrg => {
        getAccountWithUserId(req.session.id).then(accounts => {
          console.log(userWithOrg);
          if(accounts && accounts.length) {
            userWithOrg.accounts = accounts;
          }
          res.render('index', { data: userWithOrg });
      });
    });
  });

  return router;
}
