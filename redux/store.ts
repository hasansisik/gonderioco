// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { customerReducer } from "./reducers/customerReducer";
import { offerReducer } from "./reducers/offerReducer";
import { staffReducer } from "./reducers/staffReducer";
import { productReducer } from "./reducers/productReducer";
import { warehouseReducer } from "./reducers/warehouseReducer";
import { departmentReducer } from "./reducers/departmentReducer";
import { templateReducer } from "./reducers/templateReducer";
import { termReducer } from "./reducers/termReducer";
import settingsReducer from "./reducers/settingsReducer";
import messageReducer from "./reducers/messageReducer";
import notificationReducer from "./reducers/notificationReducer";
import { massMessageReducer } from "./reducers/massMessageReducer";
import commissionReducer from "./reducers/commissionReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    offer: offerReducer,
    staff: staffReducer,
    product: productReducer,
    warehouse: warehouseReducer,
    department: departmentReducer,
    template: templateReducer,
    term: termReducer,
    settings: settingsReducer,
    message: messageReducer,
    notification: notificationReducer,
    massMessage: massMessageReducer,
    commission: commissionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
