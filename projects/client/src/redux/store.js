import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./features/authSlice"
import profileSlice from "./features/profileSlice"

export const store = configureStore({
    reducer: { auth: authSlice, profile: profileSlice },
})
