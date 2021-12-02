
module.exports = function(router, database) {
  const { addAccount, updateAccount, deleteAccount, shareAccountToOrg, unshareFromOrg, getUserWithId } = require('../db/utils')(database);

  // Create Account
  router.post('/accounts', (req, res) => {
    const account = req.body;
    console.log(account);

    // Check if organization with the same name exists with your id
    addAccount(account, req.session.id).then(result => {
      if(result !== null) {
        res.redirect('/');
        return;
      }
    });
  });

  // Update Account
  router.post('/accounts/:id', (req, res) => {
    const account = req.body;
    const accountId = req.params.id;

    updateAccount(accountId, account).then(result => {
      if(result !== null) {
        res.redirect('/');
        return;
      }
    });
  });

  // Delete Account
  router.post('/accounts/:id/delete', (req, res) => {
    const accountId = req.params.id;

    deleteAccount(accountId, req.session.id).then(result => {
      if(result) {
        res.redirect('/');
      }
    });
  });

  // Share Account to Organization
  router.post('/accounts/:id/share', (req, res) => {
    const accountId = req.params.id;

    getUserWithId(req.session.id).then(user => {
      if(user) {
        shareAccountToOrg(accountId, user.organization_id).then(() => {
          res.redirect('/');
          return;
        });
      } else {
        res.redirect('/');
        return;
      }
    });
  });

  // Unshare Account to Organization
  router.post('/accounts/:id/unshare', (req, res) => {
    const accountId = req.params.id;

    getUserWithId(req.params.id).then(user => {
      if(user) {
        unshareFromOrg(accountId).then(() => {
          res.redirect('/');
          return;
        });
      } else {
        res.redirect('/');
        return;
      }
    });
  });

  return router;
}
