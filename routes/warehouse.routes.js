const express = require("express");
const router = new express.Router();
const home = require("../controllers/warehouse/warehouseHome.controller.js")
const accountant = require("../controllers/warehouse/accountant.controller.js")
const shippingMarkScan = require("../controllers/warehouse/shippingMarkScan.controller.js");
const dashboard = require("../controllers/warehouse/dashboard.controller.js");
router.get("/", home.getIndex);
router.get("/shippingMarkScan",shippingMarkScan.getIndex);
router.get("/accountant",accountant.getIndex);
router.get("/dashboard", dashboard.getIndex);
router.post("/scanBarcode/poUpdate",shippingMarkScan.poUpdate);
router.post("/scanBarcode/CheckId",shippingMarkScan.CheckId);
router.post("/scanBarcode/UploadPallet",shippingMarkScan.UploadPallet);
module.exports = router;