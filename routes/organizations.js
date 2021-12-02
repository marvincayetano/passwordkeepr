module.exports = function(router, database) {
  const { addOrganization, addUserToOrganization, getOrganizationWithUserId, editOrganization, deleteOrganization, getUserWithId } = require('../db/utils')(database);

  // Create a new organization
  router.post('/organization', (req, res) => {
    const organization = req.body;
    if(!req.session.id) {
      res.redirect('/login');
      return;
    }

    // Check if user has organization already
    getUserWithId(req.session.id).then(user => {
      if(user && user.organization_id !== null) {
        res.redirect(`/organization/${user.organization_id}`);
        return;
      }

      // User doesn't have an org yet so you can create one
      addOrganization(organization, req.session.id)
      .then(organization => {
        if (!organization) {
          res.send({error: "Error occured while creating a new organization..."});
          return;
        }

        res.redirect(`/organization/${organization.id}`);
      })
      .catch(e => {
        console.log(e);
        res.render('organizationCreate', { error: e.message })
        return;
      });
    });
  });

  // Add User to Organization only the creator can do it
  router.post('/organization/:id/invite', (req, res) => {
    const invite = req.body;
    const orgId = req.params.id;
    const id = req.session.id;

    // Making sure the invite is coming from the creator
    getOrganizationWithUserId(id).then(result => {
      // Not the creator

      if(result && result.creator_id !== parseInt(id)) {
        res.render('organization', { error: "Invalid API request!" });
        return;
      }

      addUserToOrganization(orgId, invite.email)
      .then(user => {
        if (!user) {
          res.render('organization', { data: result, error: "Error occured while adding user... User might not exist in the database"});
          return;
        }

        res.render("organization", { data: result, message: `Successfully added ${invite.email}!` });
      })
      .catch(e => {
        console.log(e);
        res.render('/organization', { error: e.message })
        return;
      });

    });
  });

  // Update Organization name or description
  router.put('/organization/:id', (req, res) => {
    const organization = req.body;
    const id = req.session.id;

    // Making sure the invite is coming from the creator
    getOrganizationWithId(organization.id, id).then(result => {
      // Not the creator
      if(result === null) {
        res.send({ error: "Invalid API request!" });
        return;
      }

      editOrganization(organization, id)
      .then(user => {
        if (!user) {
          res.send({error: "Error occured while adding user to organization..."});
          return;
        }

        res.redirect("/organization");
      })
      .catch(e => {
        res.render('/organization', { error: e.message })
        return;
      });

    });
  });

  // Delete User FROM Organization make sure to not delete creator
  router.post('/organization/:id/delete', (req, res) => {
    const id = req.params.id;
    const creatorId = req.session.id;

    deleteOrganization(id, creatorId)
    .then(() => {
      res.redirect('/organization/create')
    }).catch(err => {
      console.log(err);
    });
  });

  return router;
}
