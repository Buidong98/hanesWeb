const express = require("express");
const router = new express.Router();
const home = require("../controllers/warehouse/warehouseHome.controller.js")
const warehouseController = require("../controllers/warehouse/shippingMarkScan.controller.js");
const dashboard = require("../controllers/warehouse/dashboard.controller.js");
router.get("/", home.getIndex);
router.get("/shippingMarkScan",warehouseController.getIndex);
router.get("/dashboard", dashboard.getIndex);
router.post("/scanBarcode/poUpdate",warehouseController.poUpdate);

router.post("/scanBarcode/CheckId",warehouseController.CheckId);
module.exports = router;