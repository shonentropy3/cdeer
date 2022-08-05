import { createSlice } from '@reduxjs/toolkit'

export const web3_reactSlice = createSlice({
  name: 'web3_react',
  initialState: {
    value: {},
  },
  reducers: {
    changeValue: (state, action) => {
      state.value = action.payload
    },
    clearValue: state => {
      state.value = {}
    },
  }
})

// Action creators are generated for each case reducer function
export const { changeValue, clearValue } = web3_reactSlice.actions

export default web3_reactSlice.reducer