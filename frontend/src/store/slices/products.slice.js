import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
	name: "productList",
	initialState: {
		products: [],
		loading: false,
		error: null,
		deleteProductSuccess: null,
		deleteProductError: null,
		topRatedProducts: [],
	},
	reducers: {
		setIsLoading: (state) => {
			state.loading = true;
		},
		setProductListSuccess: (state, { payload }) => {
			state.loading = false;
			state.error = null;
			state.products = payload;
			state.deleteProductSuccess = null;
		},
		setProductListFail: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		setDeleteProductSuccess: (state, { payload }) => {
			state.loading = false;
			state.deleteProductSuccess = payload;
			state.deleteProductError = null;
		},
		setDeleteProductFailed: (state) => {
			state.loading = false;
			state.deleteProductSuccess = null;
			state.deleteProductError = true;
		},
		setTopRatedProducts: (state, { payload }) => {
			state.loading = false;
			state.topRatedProducts = payload;
		},
	},
});

const {
	setIsLoading,
	setProductListFail,
	setProductListSuccess,
	setDeleteProductFailed,
	setDeleteProductSuccess,
	setTopRatedProducts,
} = productsSlice.actions;

export const getProductList =
	(keyword = "", pageNum = 1) =>
	async (dispatch) => {
		try {
			dispatch(setIsLoading());

			const { data } = await axios.get(
				`/api/products?keyword=${keyword}&pageNumber=${pageNum}`
			);
			dispatch(setProductListSuccess(data));
		} catch (error) {
			dispatch(
				setProductListFail(
					error?.response?.data?.message
						? error.response.data.message
						: error.message
				)
			);
		}
	};

export const deleteProduct = (id) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setIsLoading());

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.delete(`/api/products/${id}`, config);

		dispatch(setDeleteProductSuccess(data?.message));
	} catch (error) {
		dispatch(
			setDeleteProductFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const getTopRatedProducts = () => async (dispatch) => {
	try {
		dispatch(setIsLoading());

		const { data } = await axios.get(`/api/products/topRated`);
		dispatch(setTopRatedProducts(data));
	} catch (error) {
		console.log(error);
	}
};

export default productsSlice.reducer;
