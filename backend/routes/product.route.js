import express from "express";
import {
	createProduct,
	createProductReview,
	deleteProduct,
	editProduct,
	getProductById,
	getProducts,
	getTopRatedProducts,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middlewares/auth.midddleware.js";
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/topRated").get(getTopRatedProducts);
router
	.route("/:id")
	.get(getProductById)
	.delete(protect, admin, deleteProduct)
	.patch(protect, admin, editProduct);
router.route("/:id/review").post(protect, createProductReview);

export default router;
