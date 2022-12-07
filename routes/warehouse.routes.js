const express = require("express");
const router = new express.Router();
const warehouseController = require("../controllers/warehouse/barcodeScan.controller.js");
const dashboard = require("../controllers/warehouse/dashboard.controller.js");
router.get("/", warehouseController.getIndex);
router.get("/dashboard", dashboard.getIndex);
module.exports = router;