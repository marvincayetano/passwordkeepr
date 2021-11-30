module.exports = function(router, database) {
  const { addOrganization, addUserToOrganization, getOrganizationWithId, getOrganizationWithNameId, editOrganization, deleteOrganization } = require('../db/utils')(database);

  // Create a new organization
  router.post('/organizations', (req, res) => {
    const organization = req.body;

    // Check if organization with the same name exists with your id
    getOrganizationWithNameId(organization.name, req.session.id).then(result => {
      if(result !== null) {
        res.send({ error: "Organization with the same name already exists!" });
        return;
      }

      // It doesn't exist yet so we can create a new organization
      addOrganization(user)
      .then(organization => {
        if (!organization) {
          res.send({error: "Error occured while creating a new organization..."});
          return;
        }

        res.redirect('/organizations');
      })
      .catch(e => {
        res.render('/organizations', { error: e.message })
        return;
      });

    });
  });

  // Add User to Organization only the creator can do it
  router.post('/organizations/:id/invite', (req, res) => {
    const organization = req.body;
    const id = req.session.id;

    // Making sure the invite is coming from the creator
    getOrganizationWithId(organization.id, id).then(result => {
      // Not the creator
      if(result === null) {
        res.send({ error: "Invalid API request!" });
        return;
      }

      addUserToOrganization(result.id, id)
      .then(user => {
        if (!user) {
          res.send({error: "Error occured while adding user to organization..."});
          return;
        }

        res.redirect("/index");
      })
      .catch(e => {
        res.render('/organizations', { error: e.message })
        return;
      });

    });
  });

  // Update Organization name or description
  router.put('/organizations/:id', (req, res) => {
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

        res.redirect("/organizations");
      })
      .catch(e => {
        res.render('/organizations', { error: e.message })
        return;
      });

    });
  });

  // Delete User FROM Organization make sure to not delete creator
  router.delete('/organizations/:id', (req, res) => {
    const id = req.body.id;
    const creatorId = req.session.id;

    deleteOrganization(id, creatorId)
    .then(() => {
      console.log("DELETE SUCCESS");
    }).catch(err => {
      console.log(err);
    });
  });

  return router;
}
