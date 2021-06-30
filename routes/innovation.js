//
const express = require("express");
const router = new express.Router();
const partController = require("../controllers/innovation/innovation.controller");
const machineController = require("../controllers/innovation/machine.controller");
const importController = require("../controllers/innovation/import.controller");
const authController = require("../middleware/auth.controller");


// Part route
router.get("/", partController.getIndex)
router.post("/getPartRequest", partController.getPartRequest)
router.get("/request/:id", partController.getRequestDetail)
router.post("/suggest", partController.suggestPart)
router.post("/request/add", partController.addRequest)
router.post("/request/update", partController.updateRequest)
router.post("/request/download", partController.downloadRequest)

router.post("/warning", partController.getWarningPart)
router.post("/warning/download", partController.downloadWarningPart)

router.post("/parts", partController.getAllPart)
router.get("/parts/:id", partController.getPartDetail)
router.post("/parts/add", partController.addPart)
router.post("/parts/update", partController.updatePart)
router.post("/part/upload", partController.upload)
router.post("/part/download", partController.downloadPart)

// Machine
// router.get("/machine", authController.authenticate, controller.getMachineIndex)
router.get("/machine", machineController.getMachineIndex)
router.get("/machine/:id", machineController.getMachineDetail)
router.post("/machine/get", machineController.getMachine)
router.post("/machine/add", machineController.addMachine)
router.post("/machine/update", machineController.updateMachine)
router.post("/machine/download", machineController.downloadMachine)

// Model
router.get("/model/:id", machineController.getModelDetail)
router.post("/model/get", machineController.getModel)
router.post("/model/add", machineController.addModel)
router.post("/model/update", machineController.updateModel)
router.post("/model/download", machineController.downloadModel)

// Import part from vendor
router.get("/import", importController.getImportIndex)
router.post("/import/get", importController.getImport)
router.post("/import/get-import-detail", importController.getImportDetail)
router.get("/import/add", importController.addUI)
router.post("/import/add", importController.addImportRequest)
router.post("/import/update", importController.updateImportRequest)

module.exports = router;