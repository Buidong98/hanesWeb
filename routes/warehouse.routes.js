const express = require("express");
const router = new express.Router();
const warehouseController = require("../controllers/warehouse/barcodeScan.controller.js");
router.get("/", warehouseController.getIndex);
router.post("/scanBarcode/poUpdate",warehouseController.poUpdate);
module.exports = router;