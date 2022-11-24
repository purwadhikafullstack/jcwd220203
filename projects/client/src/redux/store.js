import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./features/authSlice"
import profileSlice from "./features/profileSlice"
import resetSlice from "./features/resetSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        profile: profileSlice,
        reset: resetSlice
    },
})
