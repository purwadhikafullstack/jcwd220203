import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    cart: [],
    totalPrice: 0,
    totalQuantity: 0
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            let newItem = action.payload
            state.cart.push(newItem)
        },
        fillCart: (state, action) => {
            state.cart = action.payload
        },
        getTotalPrice: (state, action) => {
            state.totalPrice = action.payload
        },
        getTotalQuantity: (state, action) => {
            state.totalQuantity = action.payload
        },
    },
});

export const { addItemToCart, fillCart, getTotalPrice, getTotalQuantity } = cartSlice.actions
export default cartSlice.reducer
