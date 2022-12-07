const express = require("express");
const router = new express.Router();
const warehouseController = require("../controllers/warehouse/barcodeScan.controller.js");
const dashboard = require("../controllers/warehouse/dashboard.controller.js");
router.get("/", warehouseController.getIndex);
router.get("/dashboard", dashboard.getIndex);
router.post("/scanBarcode/poUpdate",warehouseController.poUpdate);

router.post("/scanBarcode/CheckId",warehouseController.CheckId);
module.exports = router;