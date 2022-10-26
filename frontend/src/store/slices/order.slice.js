import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const orderSlice = createSlice({
	name: "orders",
	initialState: {
		loading: false,
		success: false,
		orderId: null,
		failed: false,
		order: null,
		orderDetailsFailed: false,
		orderPaySuccess: false,
		orderPayFailed: null,
		allOrders: [],
		getAllOrdersError: null,
	},
	reducers: {
		setLoading: (state) => {
			state.loading = true;
		},
		setOrderSuccess: (state, { payload }) => {
			state.loading = false;
			state.success = true;
			state.failed = false;
			state.orderId = payload;
		},
		setOrderFailed: (state, { payload }) => {
			state.loading = false;
			state.success = false;
			state.failed = payload;
			state.orderId = null;
		},
		setOrderDetails: (state, { payload }) => {
			state.loading = false;
			state.order = payload;
		},
		setOrderDetailsFailed: (state, { payload }) => {
			state.loading = false;
			state.order = null;
			state.orderDetailsFailed = payload;
		},
		setOrderReset: (state) => {
			state.order = null;
			state.orderId = null;
			state.orderPaySuccess = false;
			state.success = false;
		},
		setOrderPaySuccess: (state) => {
			state.loading = false;
			state.orderPaySuccess = true;
			state.orderPayFailed = null;
		},
		setOrderPayFailed: (state, { payload }) => {
			state.loading = false;
			state.orderPaySuccess = false;
			state.orderPayFailed = payload;
		},
		setAllOrders: (state, { payload }) => {
			state.loading = false;
			state.allOrders = payload;
			state.getAllOrdersError = null;
		},
		setAllOrdersFailed: (state, { payload }) => {
			state.loading = false;
			state.allOrders = [];
			state.getAllOrdersError = payload;
		},
	},
});

const {
	setOrderSuccess,
	setOrderFailed,
	setLoading,
	setOrderDetails,
	setOrderDetailsFailed,
	setOrderPayFailed,
	setOrderPaySuccess,
	setOrderReset,
	setAllOrders,
	setAllOrdersFailed,
} = orderSlice.actions;

export const createOrder = (order) => async (dispatch, getState) => {
	const token = getState().authReducer.userInfo.token;

	const updatedOrderItems = order?.orderItems.map((item) => {
		return {
			product: item.id,
			name: item.name,
			image: item.image,
			price: item.price,
			countInStock: item.countInStock,
			qty: item.qty,
		};
	});

	order.orderItems = updatedOrderItems;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.post(
			"/api/orders",
			JSON.stringify(order),
			config
		);

		data && dispatch(setOrderSuccess(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setOrderFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const getOrder = (id) => async (dispatch, getState) => {
	const token = getState().authReducer.userInfo.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get(`/api/orders/${id}`, config);

		data && dispatch(setOrderDetails(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setOrderDetailsFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const updateOrderToPaid =
	(id, paymentResult) => async (dispatch, getState) => {
		const token = getState().authReducer.userInfo.token;

		try {
			dispatch(setLoading(true));

			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.patch(
				`/api/orders/${id}/pay`,
				JSON.stringify(paymentResult),
				config
			);

			data && dispatch(setOrderPaySuccess(true));
		} catch (error) {
			console.error(error);
			dispatch(
				setOrderPayFailed(
					error?.response?.data?.message
						? error.response.data.message
						: error.message
				)
			);
		}
	};
export const markOrderAsDelivered =
	(id) => async (dispatch, getState) => {
		const token = getState().authReducer.userInfo.token;

		try {
			dispatch(setLoading(true));

			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.patch(
				`/api/orders/${id}/deliver`,
				{},
				config
			);

			data && dispatch(setOrderPaySuccess(true));
		} catch (error) {
			console.error(error);
			dispatch(
				setOrderPayFailed(
					error?.response?.data?.message
						? error.response.data.message
						: error.message
				)
			);
		}
	};

export const resetOrder = () => (dispatch) => {
	dispatch(setOrderReset());
};

export const getAllOrders = () => async (dispatch, getState) => {
	const token = getState().authReducer.userInfo.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get(`/api/orders`, config);

		data && dispatch(setAllOrders(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setAllOrdersFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export default orderSlice.reducer;
