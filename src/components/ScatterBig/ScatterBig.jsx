import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AXIS_FONT_SIZE, PLOT_ARBIT_COLOR } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian, UNWIND, labelFormatter } from '../../utils'
import VolumeChart from '../VolumeChart/VolumeChart'

import {
  updatePlotArbit,
  updateBarArbit,
  updateViewport,
  updateRefs,
  updatePlotArbitBig,
  updatePairVol,
} from '../../features/global/globalSlice'

import './ScatterBig.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const ScatterBig = (props) => {
  const { rangeHandler, crosshairXMove, crosshairYMove } = props
  const viewport = useSelector((state) => state.global.viewport)
  const plotArbitBig = useSelector((state) => state.global.plotArbitBig)

  const plotArbitBigRef = useRef(null)

  const dispatch = useDispatch()
  const global = useSelector((state) => state.global)

  useEffect(() => {
    const { updateRef, zoomOnScroll, setDefaultToPan } = props
    updateRef({ name: 'plotArbitBig', ref: plotArbitBigRef })
    // const chartEl = document.querySelector('#canvasjs-react-chart-container-7')
    // chartEl.addEventListener('wheel', (e) => zoomOnScroll(plotArbitBigRef, e))
    // setDefaultToPan(chartEl)
  }, [])

  useEffect(() => {
    const { updateRef, zoomOnScroll, setDefaultToPan } = props
    const chartEl = document.querySelector('#canvasjs-react-chart-container-7')
    chartEl.addEventListener('wheel', (e) => zoomOnScroll(plotArbitBigRef, e))
    setDefaultToPan(chartEl)
    console.log('Here')
  }, [document.querySelector('#canvasjs-react-chart-container-7')])

  useEffect(() => {
    // const newChartData = PLOT_MIN.slice(0, 100).map((item) => {
    // const newChartData = PLOT.slice(0, 2000).map((item) => {
    // const newChartData = UNWIND.circles
    //   .filter((item) => item.num_lots > 2.5)
    //   .map((item) => {
    //     const time = item.time.split(':')
    //     const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
    //     const markerSize = Number.parseFloat(item.radius * 1.5).toFixed(4)
    //     return {
    //       x: newTime,
    //       y: item.y,
    //       markerSize,
    //       numLots: item.num_lots,
    //       time: item.time,
    //     }
    //   })
    // dispatch(
    //   updatePlotArbitBig({
    //     originalData: newChartData,
    //     data: newChartData,
    //   })
    // )
  }, [])

  const onPointClick = (e) => {
    const {
      dataSeries: { dataPoints },
      dataPoint: { x, y, z, time },
    } = e

    const newDataPoints = global.plotArbit.data.filter((item) => +item.x !== +x)
    const newBigDataPoints = global.plotArbitBig.data.filter(
      (item) => +item.x !== +x
    )
    const newBarArbitData = [...global.barArbit.data].filter(
      (item) => +item.x !== +x
    )

    const newPairVolData = [...global.pairVol.data].filter(
      (item) => +item.x !== +x
    )

    const selectedDataPoints = global.plotArbit.data.filter(
      (item) => +item.x === +x
    )

    let totalNumLots = 0
    for (let i = 0; i < selectedDataPoints.length; i++) {
      totalNumLots += +selectedDataPoints[i].numLots
    }

    const medianValue = getMedian(
      selectedDataPoints.map((item) => item.numLots)
    )

    const newData = {
      time,
      totalNumLots,
      totalDataPoints: selectedDataPoints.length,
      median: +Number.parseFloat(medianValue).toFixed(3),
    }
    // return [...prev, newData]

    const selectedDataArr = JSON.stringify([
      ...global.plotArbit.selectedData,
      newData,
    ])

    sessionStorage.setItem('selected', selectedDataArr)

    dispatch(
      updatePlotArbit({
        data: newDataPoints,
        selectedData: [...global.plotArbit.selectedData, newData],
      })
    )
    dispatch(
      updatePlotArbitBig({
        data: newBigDataPoints,
        selectedData: [...global.plotArbitBig.selectedData, newData],
      })
    )
    dispatch(
      updateBarArbit({
        data: newBarArbitData,
      })
    )
    dispatch(
      updatePairVol({
        data: newPairVolData,
      })
    )
  }

  const onMouseMove = (e) => {}

  return (
    <div>
      <CanvasJSChart
        ref={plotArbitBigRef}
        id='chart-03'
        options={{
          // title: {
          //   text: 'Scatter Plots',
          //   fontSize: 30,
          // },
          height: 250,
          interactivityEnabled: true,
          zoomEnabled: true,
          axisX: {
            labelFormatter,
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              updated: crosshairXMove,
            },
            gridThickness: 0,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              updated: (e) => {
                crosshairYMove(e, plotArbitBig.maxY)
              },
            },
            gridThickness: 0,
          },
          data: [
            {
              type: 'line',
              // mousemove: onMouseMove,
              toolTipContent: `<div class='tool-tip'><p>{pair[0]} - {pair[1]}</p><p>num_lots: {numLots}</p></div>`,
              fillOpacity: 0,
              dataPoints: [...plotArbitBig.data],
              markerType: 'circle',
              // lineThickness: 0,
              lineColor: 'white',
              color: PLOT_ARBIT_COLOR,
              click: (e) => {
                onPointClick(e)
              },
            },
          ],

          rangeChanged: rangeHandler,
        }}
      />
    </div>
  )
}

export default ScatterBig
