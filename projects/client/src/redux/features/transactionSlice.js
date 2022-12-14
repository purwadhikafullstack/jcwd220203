import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
}

const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {
        addItemTransaction: (state, action) => {
            state.data.push(action.payload)
        },
        fillTransaction: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { addItemTransaction, fillTransaction } = transactionSlice.actions
export default transactionSlice.reducer