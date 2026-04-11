import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || []
            state.totalItems = action.payload.totalItems || 0
            state.totalAmount = action.payload.totalAmount || 0
        },
        clearCart: (state) => {
            state.items = []
            state.totalItems = 0
            state.totalAmount = 0
        },
    },
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer