const expres = require('express');
const { registerAUser, loginUser, getAllUser, updateUser, deleteUser, getAUser, blockUser, unBlockUser, updatePassword, forgotPasswordToken, resetPassword, } = require('../controllers/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const userRouter = expres.Router();

/* all post Routes */ 
userRouter.post("/register", registerAUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgot-password", forgotPasswordToken);

/* all get Routes */
userRouter.get("/all-users",authMiddleware, isAdmin, getAllUser);
userRouter.get("/:id", authMiddleware, getAUser);

/* all put Routes */
userRouter.put("/update-profile", authMiddleware, updateUser);
userRouter.put("/block/:id", authMiddleware, isAdmin, blockUser);
userRouter.put("/unblock/:id", authMiddleware, isAdmin, unBlockUser);
userRouter.put("/update-password", authMiddleware, updatePassword);
userRouter.put("/reset-password/:token", resetPassword);



/* all delete routes */
userRouter.delete('/:id', authMiddleware, isAdmin, deleteUser); 

module.exports = userRouter;