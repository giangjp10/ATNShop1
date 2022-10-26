import asyncHandler from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";

// @desc Upload image to cloudinary
// @route POST /api/upload
// @access Public
export const uploadImage = asyncHandler(async (req, res) => {
	const file = req.body.image;

	if (file) {
		try {
			const data = await cloudinary.uploader.upload(file, {
				width: 640,
				height: 510,
				crop: "limit",
				upload_preset: "proshop",
			});

			res.status(201).json(data.url);
		} catch (error) {
			res.status(400);
			throw new Error("Something went wrong!");
		}
	} else {
		res.status(401);
		throw new Error("Cannot upload null as image");
	}
});
