import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    id: 0,
    username: "",
    email: "",
    phone_number: 0,
    profile_picture: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id
            state.username = action.payload.username
            state.email = action.payload.email
            state.phone_number = action.payload.phone_number
            state.profile_picture = action.payload.profile_picture
        },
        logout: (state) => {
            state.id = 0
            state.username = ""
            state.email = ""
            state.phone_number = 0
            state.profile_picture = ""
        },
    },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
