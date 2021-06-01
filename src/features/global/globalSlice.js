import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    refs: {
      plotArbit: null,
      barArbit: null,
    },
    viewport: {
      // old
      // viewportMinimum: 1621390598622.0627,
      // viewportMaximum: 1621409415869.5188,
      // new
      viewportMinimum: 1622513736500,
      // viewportMaximum: 1622517723500,
      viewportMaximum: 1622526723500,
    },
    plotArbit: {
      originalData: [],
      data: [],
      selectedData: [],
      minY: 0,
      maxY: 0,
      minX: 0,
      maxX: 0,
    },
    barArbit: {
      originalData: [],
      selectedData: [],
      data: [],
      minY: 0,
      maxY: 0,
      minX: 0,
      maxX: 0,
    },
    pairVol: {
      originalData: [],
      selectedData: [],
      data: [],
      minY: 0,
      maxY: 0,
      minX: 0,
      maxX: 0,
    },
    plotArbitBig: {
      originalData: [],
      data: [],
      selectedData: [],
      minY: 0,
      maxY: 0,
      minX: 0,
      maxX: 0,
    },
    summary: {},
  },
  reducers: {
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },

    updateRefs: (state, action) => {
      const { payload } = action
      // state.refs = [...payload.refs]
      state.refs = {
        // ...state.refs,
        [payload.name]: JSON.stringify(payload.ref),
      }
    },

    updatePlotArbit: (state, action) => {
      const { payload } = action
      if (payload.data) {
        const minY = Math.min.apply(
          null,
          payload.data.map(({ y }) => y)
        )

        const maxY = Math.max.apply(
          null,
          payload.data.map(({ y }) => y)
        )
        state.plotArbit = {
          ...state.plotArbit,
          ...payload,
          minY,
          maxY,
        }
      }
      if (payload.zoomValue) {
        const prevDataPoints = [...state.plotArbit.originalData]
        const newDataPoints = prevDataPoints.map((point) => {
          return {
            ...point,
            markerSize: point.markerSize * payload.zoomValue,
          }
        })
        state.plotArbit = {
          ...state.plotArbit,
          data: newDataPoints,
        }
      }
    },

    updatePlotArbitBig: (state, action) => {
      const { payload } = action
      const minY = Math.min.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      const maxY = Math.max.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      state.plotArbitBig = {
        ...state.plotArbit,
        ...payload,
        minY,
        maxY,
      }
    },

    updateBarArbit: (state, action) => {
      const { payload } = action

      const minY = Math.min.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      const maxY = Math.max.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      state.barArbit = {
        ...state.barArbit,
        ...payload,
        minY,
        maxY,
      }
    },

    updateViewport: (state, action) => {
      const { payload } = action
      state.viewport = {
        ...state.viewport,
        ...payload,
      }
    },

    updatePairVol: (state, action) => {
      const { payload } = action

      const minY = Math.min.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      const maxY = Math.max.apply(
        null,
        payload.data.map(({ y }) => y)
      )

      state.pairVol = {
        ...state.pairVol,
        ...payload,
        minY,
        maxY,
      }
    },

    updateSummary: (state, action) => {
      const { payload } = action

      state.summary = { ...payload }
    },

    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
  },
})

// Action creators are generated for each case reducer function
export const {
  incrementByAmount,
  updatePlotArbit,
  updatePlotArbitBig,
  updateBarArbit,
  updateViewport,
  updatePairVol,
  updateRefs,
  updateSummary,
} = globalSlice.actions

export default globalSlice.reducer
