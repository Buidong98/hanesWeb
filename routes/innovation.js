//
const express = require("express");
const router = new express.Router();
const controller = require("../controllers/innovation.controller");
const authController = require("../middleware/auth.controller");


// Part route
router.get("/", controller.getIndex)
router.post("/getPartRequest", controller.getPartRequest)
router.get("/request/:id", controller.getRequestDetail)
router.post("/suggest", controller.suggestPart)
router.post("/request/add", controller.addRequest)
router.post("/request/update", controller.updateRequest)
router.post("/request/download", controller.downloadRequest)

router.post("/warning", controller.getWarningPart)
router.post("/warning/download", controller.downloadWarningPart)

router.post("/parts", controller.getAllPart)
router.get("/parts/:id", controller.getPartDetail)
router.post("/parts/add", controller.addPart)
router.post("/parts/update", controller.updatePart)
router.post("/part/upload", controller.upload)
router.post("/part/download", controller.downloadPart)

// Machine
// router.get("/machine", authController.authenticate, controller.getMachineIndex)
router.get("/machine", controller.getMachineIndex)
router.get("/machine/:id", controller.getMachineDetail)
router.post("/get-machine", controller.getMachine)
router.post("/machine/add", controller.addMachine)
router.post("/machine/update", controller.updateMachine)
router.post("/machine/download", controller.downloadMachine)

// Model
router.get("/model/:id", controller.getModelDetail)
router.post("/get-model", controller.getModel)
router.post("/model/add", controller.addModel)
router.post("/model/update", controller.updateModel)
router.post("/model/download", controller.downloadModel)

// Export
module.exports = router;