import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './web3_reactSlice'

export default configureStore({
    reducer: {
        web3_react: counterReducer
      },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})