var authController = {};

authController.authorize = function(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authorize based on user role
        (req, res, next) => {
            if(!req.isAuthenticated()){
                return res.render("login", { msg: "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại." });
            }
            // if (roles.length && !roles.includes(req.user.roles)) {
            if (roles && !req.user.roles.includes(roles)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Bạn không có quyền truy cập chức năng này' });
            }
            // authentication and authorization successful
            next();
        }
    ];
}

authController.authenticate = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.render("login", { msg: "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại." });
    }
    // authentication and authorization successful
    next();
}

module.exports = authController;