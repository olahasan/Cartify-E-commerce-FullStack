import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import productReducer from "@products/productSlice";
import cartReducer from "@cart/cartSlice";
import wishlistReducer from "@wishlist/wishlistSlice";
import authReducer from "@auth/authSlice";
import profileReducer from "@profile/ProfileSlice";
import searchReducer from "@search/SearchSlice";
import checkoutReducer from "@checkout/checkoutSlice";
import promoReducer from "@promo/promoSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "wishlist"],
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["RegisterReturn", "LoginReturn"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};

const rootReducer = combineReducers({
  product: productReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  wishlist: wishlistReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  profile: profileReducer,
  search: searchReducer,
  checkout: checkoutReducer,
  promo: promoReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
