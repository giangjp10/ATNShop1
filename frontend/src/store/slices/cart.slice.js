import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		cartItems: [],
		shippingAddress: {},
		paymentMethod: null,
	},
	reducers: {
		setCart: (state, { payload }) => {
			state.cartItems = payload;
		},
		setShippingAddress: (state, { payload }) => {
			state.shippingAddress = payload;
		},
		setPaymentMethod: (state, { payload }) => {
			state.paymentMethod = payload;
		},
	},
});

const { setCart, setShippingAddress, setPaymentMethod } = cartSlice.actions;

export const addToCart = (id, qty) => async (dispatch, getState) => {
	try {
		const { data } = await axios.get(`/api/products/${id}`);

		const newProduct = {
			id: data._id,
			name: data.name,
			image: data.image,
			price: data.price,
			countInStock: data.countInStock,
			qty,
		};

		const previousState = getState()?.cartReducer?.cartItems;
		const existingItem = previousState.find(
			(item) => item.id === newProduct.id
		);

		if (existingItem) {
			const existingItemId = previousState.findIndex(
				(item) => item.id === newProduct.id
			);

			const state = [...previousState];
			state.splice(existingItemId, 1, newProduct);

			dispatch(setCart([...state]));
		} else {
			dispatch(setCart([...previousState, newProduct]));
		}
	} catch (error) {
		dispatch(setCart(getState()?.cartReducer?.cartItems));
		console.log(error);
	}
};

export const removeFromCart = (id) => async (dispatch, getState) => {
	const previousState = [...getState()?.cartReducer?.cartItems];

	const index = previousState.findIndex((item) => item.id === id);

	previousState.splice(index, 1);

	dispatch(setCart(previousState));
};

export const saveShippingAddress = (data) => (dispatch) => {
	dispatch(setShippingAddress(data));
};

export const savePaymentMethod = (method) => (dispatch) => {
	dispatch(setPaymentMethod(method));
};

export default cartSlice.reducer;
