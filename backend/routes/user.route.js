import express from "express";
import {
	authUser,
	deleteUser,
	getUserById,
	getUserProfile,
	getUsers,
	registerUser,
	updateUserAsAdmin,
	updateUserProfile,
} from "../controllers/user.controller.js";
import { admin, protect } from "../middlewares/auth.midddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router
	.route("/profile")
	.get(protect, getUserProfile)
	.patch(protect, updateUserProfile);
router
	.route("/:id")
	.delete(protect, admin, deleteUser)
	.get(protect, admin, getUserById)
	.patch(protect, admin, updateUserAsAdmin);

export default router;
