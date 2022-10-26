import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setProfile } from "./auth.slice";

const userSlice = createSlice({
	name: "user",
	initialState: {
		loading: false,
		profile: null,
		updateProfileError: null,
		profileError: null,
		updateSuccess: false,
		myOrders: [],
		usersListLoading: false,
		users: [],
		fetchUsersError: null,
		deleteUserSuccess: null,
		deleteUserFailed: null,
		updateUserError: null,
		updateUserSuccess: null,
		userToEdit: null,
	},
	reducers: {
		setLoading: (state, { payload }) => {
			state.loading = true;
		},
		setUserProfile: (state, { payload }) => {
			state.loading = false;
			state.profile = payload;
			state.updateProfileError = null;
		},
		setUserProfileFailed: (state, { payload }) => {
			state.loading = false;
			state.profileError = payload;
		},
		setUpdateProfileSuccess: (state, { payload }) => {
			state.loading = false;
			state.profile = payload;
			state.updateSuccess = true;
			state.updateProfileError = null;
		},
		setUpdateProfileFailed: (state, { payload }) => {
			state.loading = false;
			state.updateSuccess = false;
			state.updateProfileError = payload;
		},
		setMyOrders: (state, { payload }) => {
			state.loading = false;
			state.myOrders = payload;
		},
		setUserListLoading: (state) => {
			state.usersListLoading = true;
		},
		setUsersList: (state, { payload }) => {
			state.usersListLoading = false;
			state.users = payload;
			state.fetchUsersError = null;
			state.deleteUserSuccess = null;
			state.deleteUserFailed = null;
			state.userToEdit = null;
			state.updateUserSuccess = null;
		},
		setUserListFailed: (state, { payload }) => {
			state.usersListLoading = false;
			state.users = [];
			state.fetchUsersError = payload;
			state.deleteUserSuccess = null;
			state.deleteUserFailed = null;
			state.userToEdit = null;
		},
		setDeleteUserSuccess: (state, { payload }) => {
			state.usersListLoading = false;
			state.deleteUserSuccess = payload;
			state.deleteUserFailed = null;
		},
		setDeleteUserFailed: (state, { payload }) => {
			state.usersListLoading = false;
			state.deleteUserFailed = payload;
			state.deleteUserSuccess = null;
		},
		setUserToEdit: (state, { payload }) => {
			state.userToEdit = payload;
		},
		setUpdateUserSuccess: (state, { payload }) => {
			state.loading = false;
			state.updateUserError = null;
			state.userToEdit = payload;
			state.updateUserSuccess = true;
		},
		setUpdateUserFailed: (state, { payload }) => {
			state.loading = false;
			state.updateUserError = payload;
			state.updateUserSuccess = null;
		},
	},
});

const {
	setLoading,
	setUserProfile,
	setUserProfileFailed,
	setUpdateProfileSuccess,
	setUpdateProfileFailed,
	setMyOrders,
	setUserListLoading,
	setUsersList,
	setUserListFailed,
	setDeleteUserSuccess,
	setDeleteUserFailed,
	setUpdateUserFailed,
	setUpdateUserSuccess,
	setUserToEdit,
} = userSlice.actions;

export const clearState = () => (dispatch) => {
	dispatch(setUserProfile(null));
};

export const fetchProfile = () => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get("/api/users/profile", config);

		data && dispatch(setUserProfile(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setUserProfileFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const updateProfile = (user) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.patch(
			"/api/users/profile",
			JSON.stringify(user),
			config
		);

		dispatch(setUpdateProfileSuccess());
		dispatch(setProfile(data));
	} catch (error) {
		console.error(error);
		dispatch(
			setUpdateProfileFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const getMyOrders = () => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get("/api/orders/myOrders", config);

		dispatch(setMyOrders(data));
	} catch (error) {
		console.error(error);
	}
};

export const fetchAllUsers = () => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setUserListLoading());

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get("/api/users", config);

		dispatch(setUsersList(data));
	} catch (error) {
		dispatch(
			setUserListFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const deleteUser = (id) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setUserListLoading());

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.delete(`/api/users/${id}`, config);

		dispatch(setDeleteUserSuccess(data?.message));
	} catch (error) {
		dispatch(
			setDeleteUserFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export const getUserToEdit = (id) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.get(`/api/users/${id}`, config);

		dispatch(setUserToEdit(data));
	} catch (error) {
		console.log(error);
	}
};

export const updateUserAsAdmin = (id, body) => async (dispatch, getState) => {
	const token = getState().authReducer?.userInfo?.token;

	try {
		dispatch(setLoading(true));

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		};

		const { data } = await axios.patch(
			`/api/users/${id}`,
			JSON.stringify(body),
			config
		);

		dispatch(setUpdateUserSuccess(data));
	} catch (error) {
		dispatch(
			setUpdateUserFailed(
				error?.response?.data?.message
					? error.response.data.message
					: error.message
			)
		);
	}
};

export default userSlice.reducer;
