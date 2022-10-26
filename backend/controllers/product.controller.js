import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const searchFilter = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: "i",
				},
		  }
		: {};

	const count = await Product.countDocuments({ ...searchFilter });

	const products = await Product.find({ ...searchFilter })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc delete product
// @route DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		product.remove();
		res.status(200).json({ message: "Product removed successfully" });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

// @desc Create product
// @route POST /api/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		user: req.user._id,
		name: "Sample name",
		price: 0,
		image: "/images/sample.jpg",
		brand: "Sample brand",
		category: "Smple category",
		description: "Sample description",
		rating: 0,
		countInStock: 0,
		numReviews: 0,
	});

	const createdProduct = await product.save();

	res.status(201).json(createdProduct);
});

// @desc edit product
// @route PATCH /api/products/:id
// @access Private/Admin
export const editProduct = asyncHandler(async (req, res) => {
	if (req.body) {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body);

		if (product) {
			const newProduct = await Product.findById(req.params.id);

			res.status(200).json(newProduct);
		} else {
			res.status(404);
			throw new Error("Product not found");
		}
	} else {
		res.status(422);
		throw new Error("Can't update product with null");
	}
});

// @desc Create new Review
// @route POST /api/products/:id/review
// @access Private
export const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	if (req.body) {
		const product = await Product.findById(req.params.id);

		if (product) {
			const alreadyExists = product.reviews.find(
				(review) => review?.user.toString() === req.user._id.toString()
			);

			if (alreadyExists) {
				res.status(400);
				throw new Error("User already reviewed this product");
			} else {
				const review = {
					name: req.user.name,
					rating: Number(rating),
					comment,
					user: req.user._id,
				};

				product.reviews.push(review);
				product.numReviews = product.reviews.length;
				product.rating =
					product.reviews.reduce((acc, item) => item.rating + acc, 0) /
					product.reviews.length;

				await product.save();

				res.status(201).json({ message: "Review added successfully!" });
			}

			res.status(200).json(newProduct);
		} else {
			res.status(404);
			throw new Error("Product not found");
		}
	} else {
		res.status(422);
		throw new Error("Can't update product with null");
	}
});

// @desc Fetch Top Rated Products
// @route GET /api/products/topRated
// @access Public
export const getTopRatedProducts = asyncHandler(async (req, res) => {
	const topRatedProducts = await Product.find({ rating: { $gte: 4 } })
		.sort({ rating: -1 })
		.limit(3);

	res.status(200).json(topRatedProducts);
});
