const express = require("express");
const router = new express.Router();
const controller = require("../controllers/innovation.controller");

// const authorize = function(req, res, next) {
//     if (req.user.dept == 1) {
//         next();
//     } else {
//         res.status("401").send("Bạn không có quyền truy cập");
//     }
// }

const authorize = function(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authorize based on user role
        (req, res, next) => {
            if(!req.isAuthenticated()){
                return res.render("login", {msg: "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại."});
            }
            // if (roles.length && !roles.includes(req.user.roles)) {
            if (roles && !req.user.roles.includes(roles)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            // authentication and authorization successful
            next();
        }
    ];
}

router.get("/", authorize(6), controller.getIndex)
router.post("/getPartRequest", controller.getPartRequest)
router.post("/suggest", controller.suggestPart)
router.post("/filter", controller.filterRequest)

module.exports = router;