import {
	configureStore,
	combineReducers,
	getDefaultMiddleware,
} from "@reduxjs/toolkit";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import autoMergeLevel1 from "reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1";
import authSlice from "./slices/auth.slice";
import productsSlice from "./slices/products.slice";
import productSlice from "./slices/product.slice";
import cartSlice from "./slices/cart.slice";
import userSlice from "./slices/user.slice.js";
import orderSlice from "./slices/order.slice";

const persistConfig = {
	key: "proshop",
	storage,
	stateReconciler: autoMergeLevel1,
	whitelist: ["authReducer", "cartReducer", "orderReducer"],
};

const reducers = combineReducers({
	authReducer: authSlice,
	productListReducer: productsSlice,
	productReducer: productSlice,
	cartReducer: cartSlice,
	userReducer: userSlice,
	orderReducer: orderSlice,
});

const _persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: _persistedReducer,
	middleware: getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}),
});

export const persistor = persistStore(store);

export default store;
