import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    trans: [],
    totalPrice: 0,
    totalQuantity: 0,
    checkoutCart: []
}

const transSlice = createSlice({
    name: "trans",
    initialState,
    reducers: {
        fillTrans: (state, action) => {
            state.trans = action.payload
        }
    },
});

export const { fillTrans } = transSlice.actions
export default transSlice.reducer
