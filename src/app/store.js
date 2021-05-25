import { configureStore } from '@reduxjs/toolkit'
import globalReducer from '../features/global/globalSlice'

export default configureStore({
  reducer: {
    global: globalReducer,
  },
})
