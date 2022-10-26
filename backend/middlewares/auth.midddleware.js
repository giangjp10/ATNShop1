import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
	let token = req?.headers?.authorization;

	if (token && token.startsWith("Bearer")) {
		try {
			const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			console.error(error);
			res.status(401);

			throw new Error("Not authorised, token failed");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

export const admin = async (req, res, next) => {
	const user = req.user;

	if (user && user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized as an Admin");
	}
};
