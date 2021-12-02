
module.exports = function(router, database) {
  const { addAccount, updateAccount, deleteAccount, shareAccountToOrg, unshareFromOrg } = require('../db/utils')(database);

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

  // // Create Account for organization
  // router.post('/organizations/:id/accounts', (req, res) => {
  //   const account = req.body;
  //   const organization_id = req.params.id;

  //   // Check if organization with the same name exists with your id
  //   addAccount(account, req.session.id).then(result => {
  //     if(result !== null) {
  //       res.send({ account });
  //       return;
  //     }
  //   });
  // });

  // Update Account
  router.post('/accounts/:id', (req, res) => {
    const account = req.body;
    account.id = req.params.id;

    updateAccount(account).then(result => {
      if(result !== null) {
        res.send({ result });
        return;
      }
    });
  });

  // Delete Account
  router.delete('/accounts/:id', (req, res) => {
    const accountId = req.params.id;


    deleteAccount(account_id, req.session.id).then(result => {
      if(result) {
        res.send({ success: true });
      }
    });
  });

  // Share Account to Organization
  router.patch('/accounts/:id/share', (req, res) => {
    const organizationId = req.body;

    shareAccountToOrg(req.params.id, organizationId).then(result => {
      if(result !== null) {
        res.send({ result });
        return;
      }
    });
  });

  // Unshare Account to Organization
  router.post('/accounts/:id/unshare', (req, res) => {
    unshareFromOrg(req.params.id).then(result => {
      if(result !== null) {
        res.send({ result });
        return;
      }
    });
  });

  return router;
}
