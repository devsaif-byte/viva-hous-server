const express = require("express");
const propertyController = require("../controller/propertyController");
const propertyRouter = express.Router();

// propertyRouter.get("/properties", propertyController.findAllProperties);

// router.get("/properties/:id", PropertyController.findOneProperty);

propertyRouter.post("/properties", propertyController.createProperty);

// router.patch("/properties/:id", PropertyController.updateProperty);

// router.delete("/properties/:id", propertyController.deleteProperty);

module.exports = propertyRouter;
