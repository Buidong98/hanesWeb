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
router.post("/shippingMark/CheckId",shippingMarkScan.CheckId);
router.post("/shippingMark/UploadPallet",shippingMarkScan.UploadPallet);
router.post("/shippingMark/planUpload",accountant.planUpload);
router.post("/shippingMark/findDateChanged",accountant.findDateChanged);
router.post("/shippingMark/findVenderChanged",accountant.findVenderChanged);
router.post("/shippingMark/LoadDataTable",accountant.LoadDataTable);
router.post("/shippingMark/updateQuantity",accountant.updateQuantity);
module.exports = router;