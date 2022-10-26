import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id).select(["-password", "-__v"]);

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Register new user
// @route POST /api/users
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists with this email");
	}

	const user = await User.create({ name, email, password });

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc Update user profile
// @route PATCH /api/users/profile/:id
// @access Public
export const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (req.body.name && req.body.email) {
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();

			res.status(200).json({
				_id: updatedUser._id,
				name: updatedUser.name,
				email: updatedUser.email,
				isAdmin: updatedUser.isAdmin,
				token: generateToken(updatedUser._id),
			});
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	} else {
		res.status(422);
		throw new Error("Can't update profile with null");
	}
});

// @desc Get user profile
// @route GET /api/users/
// @access Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select(["-password", "-__v"]);
	res.status(200).json(users);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		res.status(200).json({ message: "User removed successfully!" });
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Get user by Id
// @route GET /api/users/:id
// @access Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.params.id }).select([
		"-password",
		"-__v",
	]);

	if (user) {
		res.status(200).json(user);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

// @desc Update user
// @route PATCH /api/users/:id
// @access Private/Admin
export const updateUserAsAdmin = asyncHandler(async (req, res) => {
	const user = await User.findById({ _id: req.params.id });

	if (req.body) {
		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.isAdmin = req.body.isAdmin;

			const updatedUser = await user.save();

			res.status(200).json(updatedUser);
		} else {
			res.status(404);
			throw new Error("User not found");
		}
	} else {
		res.status(422);
		throw new Error("Can't update user with null");
	}
});
