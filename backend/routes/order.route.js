import express from "express";
import {
	createOrder,
	getAllOrders,
	getOrderById,
	getUserOrders,
	markAsDelivered,
	updateOrderToPaid,
} from "../controllers/order.controller.js";
import { admin, protect } from "../middlewares/auth.midddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders);
router.route("/myOrders").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").patch(protect, updateOrderToPaid);
router.route("/:id/deliver").patch(protect, admin, markAsDelivered);

export default router;
