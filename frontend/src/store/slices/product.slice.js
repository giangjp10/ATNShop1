import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const productSlice = createSlice({
	name: "productDetails",
	initialState: {
		product: {
			reviews: [],
		},
		createdProduct: null,
		productUpdateSuccess: false,
		productUpdateError: null,
		reviewError: null,
		newProduct: null,
	},
	reducers: {
		setIsLoading: (state) => {
			state.loading = true;
		},
		setProductDetailsSuccess: (state, { payload }) => {
			state.loading = false;
			state.error = null;
			state.product = payload;
		},
		setProductDetailsFailed: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		setCreateProductSuccess: (state, { payload }) => {
			state.loading = false;
			state.newProduct = payload;
		},
		setResetState: (state) => {
			state.loading = false;
			state.newProduct = null;
			state.productUpdateSuccess = false;
		},
		setCreateProductFailed: (state) => {
			state.loading = false;
			state.newProduct = null;
		},
		setProductUpdateSuccess: (state) => {
			state.loading = false;
			state.newProduct = null;
			state.productUpdateSuccess = true;
			state.productUpdateError = false;
		},
		setProductUpdateFailed: (state, { payload }) => {
			state.loading = false;
			state.productUpdateSuccess = false;
			state.productUpdateError = payload;
		},
		setAddReviewSuccess: (state, { payload }) => {
			state.loading = false;
			state.product = payload;
			state.reviewError = null;
		},
		setAddReviewFailed: (state, { payload }) => {
			state.loading = false;
			state.reviewError = payload;
		},
	},
});

const {
	setIsLoading,
	setProductDetailsFailed,
	setProductDetailsSuccess,
	setCreateProductSuccess,
	setCreateProductFailed,
	setProductUpdateFailed,
	setProductUpdateSuccess,
	setResetState,
	setAddReviewFailed,
	setAddReviewSuccess,
} = productSlice.actions;

export const getProductDetails = (id) => async (dispatch) => {
	try {
		dispatch(setIsLoading());

		const { data } = await axios.get(`/api/products/${id}`);
		dispatch(setProductDetailsSuccess(data));
	} catch (error) {
		dispatch(
			setProductDetailsFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const createProduct = () => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setIsLoading());

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.post(`/api/products`, {}, config);
		dispatch(setCreateProductSuccess(data));
	} catch (error) {
		console.log(error);
		dispatch(setCreateProductFailed());
	}
};

export const editProduct = (id, body) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setIsLoading(true));

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.patch(
			`/api/products/${id}`,
			JSON.stringify(body),
			config
		);

		dispatch(setProductUpdateSuccess(data));
	} catch (error) {
		dispatch(
			setProductUpdateFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const resetSelectedProduct = () => (dispatch) => {
	dispatch(setResetState());
};

export const reviewProduct = (id, review) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setIsLoading());

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.post(
			`/api/products/${id}/review`,
			JSON.stringify(review),
			config
		);
		dispatch(setAddReviewSuccess(data));
	} catch (error) {
		dispatch(
			setAddReviewFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export default productSlice.reducer;
