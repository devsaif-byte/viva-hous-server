const express = require("express");
const UserController = require("../controller/bookingUser");
const router = express.Router();

router.get("/booking", UserController.findAll);
router.get("/booking/:id", UserController.findOne);
router.post("/booking", UserController.create);
router.patch("/booking/:id", UserController.update);
router.delete("/booking/:id", UserController.destroy);

module.exports = router;
