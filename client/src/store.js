import { configureStore } from "@reduxjs/toolkit";
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
import orderReducer from "./redux/orderSlice";
import ingredientReducer from "./redux/ingredientSlice";
import builderReducer from "./redux/builderSlice";
import authReducer from "./redux/authSlice";
import cartReducer from "./redux/cartSlice";
import messageReducer from "./redux/messageSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    order: orderReducer,
    ingredient: ingredientReducer,
    builder: builderReducer,
    auth: authReducer,
    cart: persistedCartReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
