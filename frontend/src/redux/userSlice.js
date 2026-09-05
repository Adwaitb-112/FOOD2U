import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopsInMyCity: null,
        itemsInMyCity: null,
        cartItems: [],
        totalAmount: 0,
        myOrders: [],
        searchItems: null,
        socket: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload
        },
        setSItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload
        },
        addToCart: (state, action) => {
            const cartItem = action.payload
            const existingItem = state.cartItems.find(i => i.id == cartItem.id)
            if (existingItem) {
                existingItem.quantity += cartItem.quantity
            } else {
                state.cartItems.push(cartItem)
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0)
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload
            const item = state.cartItems.find(i => i.id == id)
            if (item) {
                item.quantity = quantity
            }
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0)
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.id == action.payload)
            state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0)

        },
        setMyOrders: (state, action) => {
            state.myOrders = action.payload
        },
        addMyOrders: (state, action) => {
            state.myOrders = [action.payload, ...state.myOrders]
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload
        },
        updateOrdersStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order) {
                if (order.shopOrders && order.shopOrders.shop._id == shopId) {
                    order.shopOrders.status = status
                }
            }
        },
        updateRealtimeOrdersStatus: (state, action) => {
            const { orderId, shopId, status } = action.payload
            const order = state.myOrders.find(o => o._id == orderId)
            if (order) {
                const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
                if (shopOrder) {
                    shopOrder.status = status
                }
            }
        },
        setSocket: (state, action) => {
            state.socket = action.payload
        }
    }
})

export const { setUserData, setCurrentCity, setCurrentState, setCurrentAddress, setShopsInMyCity, setSItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrders, updateOrdersStatus, setSearchItems, setSocket, updateRealtimeOrdersStatus } = userSlice.actions
export default userSlice.reducer