import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

// @desc Create new order
// @route POST /api/orders
// @access Private
export const createOrder = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order Items");
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const newOrder = await order.save();

		res.status(201).json(newOrder._id);
	}
});

// @desc Get order by Id
// @route GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
	const id = req.params.id;

	const order = await Order.findById(id).populate("user", "name email");

	if (order) {
		res.status(200);
		res.json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Update order to paid
// @route PATCH /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
	const id = req.params.id;

	const order = await Order.findById(id);

	if (order) {
		res.status(200);
		order.isPaid = true;
		order.paidAt = Date.now();

		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.status,
			email_address: req.body.payer.email_address,
		};

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Update order status to delivered
// @route PATCH /api/orders/:id/deliver
// @access Private/Admin
export const markAsDelivered = asyncHandler(async (req, res) => {
	const id = req.params.id;

	const order = await Order.findById(id);

	if (order) {
		res.status(200);
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

// @desc Get loggedin user orders
// @route GET /api/orders/myOrders
// @access Private
export const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.status(200).json(orders);
});

// @desc Get ALL Orders
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate("user", "id name");
	res.status(200).json(orders);
});
