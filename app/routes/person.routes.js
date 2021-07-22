module.exports = app => {
    const person = require("../controllers/person.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", person.create);
  
    // Retrieve all person
    router.get("/", person.findAll);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", person.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", person.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", person.delete);
  
    // Create a new Tutorial
    router.delete("/", person.deleteAll);
  
    app.use('/api/person', router);
  };