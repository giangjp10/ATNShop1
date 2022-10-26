import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { clearState } from "./user.slice.js";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		authenticated: false,
		loading: false,
		userInfo: null,
		loginError: null,
		signupError: null,
	},
	reducers: {
		setAuthenticating: (state) => {
			state.loading = true;
		},
		setLoginSuccess: (state, { payload }) => {
			state.loading = false;
			state.authenticated = true;
			state.userInfo = payload;
			state.loginError = null;
		},
		setLoginFailed: (state, { payload }) => {
			state.loading = false;
			state.loginError = payload;
			state.userInfo = null;
		},
		setUserProfile: (state, { payload }) => {
			state.userInfo = { ...state.userInfo, name: payload?.name };
		},
		setLogout: (state) => {
			state.authenticated = false;
			state.loading = false;
			state.userInfo = null;
			state.loginError = null;
		},
		setSignupSuccess: (state) => {
			state.authenticated = true;
			state.loading = false;
			state.signupError = null;
		},
		setSignupFailed: (state, { payload }) => {
			state.loading = false;
			state.signupError = payload;
		},
	},
});

const {
	setUserProfile,
	setAuthenticating,
	setLoginFailed,
	setLoginSuccess,
	setLogout,
	setSignupFailed,
	setSignupSuccess,
} = authSlice.actions;

export const setProfile = (payload) => (dispatch) => {
	dispatch(setUserProfile(payload));
};

export const login = (email, password) => async (dispatch) => {
	try {
		dispatch(setAuthenticating(true));

		const reqBody = JSON.stringify({ email, password });
		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post("/api/users/login", reqBody, config);

		dispatch(setLoginSuccess(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setLoginFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const logout = () => (dispatch) => {
	dispatch(clearState(null));
	dispatch(setLogout());
};

export const register = (name, email, password) => async (dispatch) => {
	if (name && email && password) {
		try {
			dispatch(setAuthenticating(true));

			const reqBody = JSON.stringify({ name, email, password });
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			const { data } = await axios.post("/api/users", reqBody, config);

			data && dispatch(setSignupSuccess());
			data && dispatch(login(email, password));
		} catch (error) {
			console.error(error);
			dispatch(
				setSignupFailed(
					error?.response?.data?.message
						? error.response.data.message
						: error.message
				)
			);
		}
	} else {
		dispatch(setSignupFailed("Please fill all fields!"));
	}
};

export default authSlice.reducer;
