const express = require("express");
const propertyController = require("../controller/propertyController");
const router = express.Router();

// router.get("/properties", PropertyController.findAllProperties);

// router.get("/properties/:id", PropertyController.findOneProperty);

router.post("/properties", propertyController.createProperty);

// router.patch("/properties/:id", PropertyController.updateProperty);

// router.delete("/properties/:id", propertyController.deleteProperty);

module.exports = router;
