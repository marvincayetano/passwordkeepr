
module.exports = function(router, database) {
  const { addAccount } = require('../db/utils')(database);

  // Create Account
  router.post('/accounts', (req, res) => {
    const account = req.body;

    // Check if organization with the same name exists with your id
    addAccount(account, req.session.id).then(result => {
      if(result !== null) {
        res.send({ account });
        return;
      }
    });
  });

  // Create Account for organization
  // Update Account
  // Delete Account
  // Share Account to Organization
  // Unshare Account to Organization
}
