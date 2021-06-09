const express = require("express");
const router = new express.Router();

var controller = require("../controllers/innovation.controller");

router.get("/", controller.getIndex)

router.get("/suggest", controller.suggestPart)

module.exports = router;