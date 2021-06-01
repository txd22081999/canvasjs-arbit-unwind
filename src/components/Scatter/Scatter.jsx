import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AXIS_FONT_SIZE,
  GREEN_PLOT_COLOR,
  PLOT_ARBIT_COLOR,
} from '../../constants'
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
  updateSummary,
} from '../../features/global/globalSlice'

import './Scatter.scss'
import moment from 'moment'
import SelectTable from '../SelectTable'

// console.log(UNWIND)

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const Scatter = (props) => {
  const { rangeHandler, crosshairXMove, crosshairYMove } = props
  const viewport = useSelector((state) => state.global.viewport)
  const plotArbit = useSelector((state) => state.global.plotArbit)

  const plotChartRef = useRef(null)

  const dispatch = useDispatch()
  const global = useSelector((state) => state.global)

  useEffect(() => {
    const { updateRef, zoomOnScroll, setDefaultToPan } = props
    updateRef({ name: 'plotArbit', ref: plotChartRef })

    const chartEl = document.querySelector('#canvasjs-react-chart-container-1')
    console.log(chartEl)
    chartEl.addEventListener('wheel', (e) => {
      zoomOnScroll(plotChartRef, e)
    })
    setDefaultToPan(chartEl)
  }, [])

  useEffect(() => {}, [global.plotArbit])

  const onPointClick = (e) => {
    const {
      dataSeries: { dataPoints },
      dataPoint: { x, y, z, time },
    } = e

    const newDataPoints = dataPoints.filter((item) => +item.x !== +x)
    const newBigArbitDataPoints = [...global.plotArbitBig.data].filter(
      (item) => +item.x !== +x
    )

    const newPairVolDataPoints = [...global.pairVol.data].filter(
      (item) => +item.x !== +x
    )
    const newBarArbitData = [...global.barArbit.data].filter(
      (item) => +item.x !== +x
    )

    const selectedDataPoints = global.plotArbit.data.filter(
      (item) => +item.x === +x
    )
    let totalNumLots = 0
    for (let i = 0; i < selectedDataPoints.length; i++) {
      totalNumLots += selectedDataPoints[i].numLots
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

    dispatch(
      updatePlotArbit({
        data: newDataPoints,
        selectedData: [...global.plotArbit.selectedData, newData],
      })
    )
    dispatch(
      updateBarArbit({
        data: newBarArbitData,
      })
    )
    dispatch(
      updatePlotArbitBig({
        data: newBigArbitDataPoints,
        selectedData: [...global.plotArbitBig.selectedData, newData],
      })
    )
    dispatch(
      updatePairVol({
        data: newPairVolDataPoints,
        selectedData: [...global.pairVol.selectedData, newData],
      })
    )
  }

  const onMouseMove = (e) => {}

  return (
    <div>
      <CanvasJSChart
        ref={plotChartRef}
        id='chart-01'
        options={{
          // title: {
          //   text: 'Scatter Plots',
          //   fontSize: 30,
          // },
          height: 500,
          // interactivityEnabled: true,
          zoomEnabled: true,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            intervalType: 'minute',
            interval: 20,
            crosshair: {
              enabled: true,
              updated: crosshairXMove,
            },
            labelFormatter,
            gridThickness: 0,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              updated: (e) => {
                crosshairYMove(e, plotArbit.maxY)
              },
            },
            gridThickness: 0,
          },
          data: [
            {
              type: 'line',
              // mousemove: onMouseMove,
              toolTipContent: `<div class='tool-tip'><p>r: {markerSize}</p><p>x: {x}</p></div><p>y: {y}</p></div>`,
              markerType: 'circle',
              lineColor: 'white',
              color: PLOT_ARBIT_COLOR,
              click: (e) => {
                onPointClick(e)
              },
              dataPoints: [...plotArbit.data],
              // dataPoints: [
              //   { x: new Date('2021-05-31 09:44:08'), y: 565 },
              //   { x: new Date('2021-05-31 09:54:08'), y: 255 },
              //   { x: new Date('2021-05-31 09:34:08'), y: 405 },
              // ],
            },
          ],
          // mousemove: (e) => {
          //   console.log(e)
          // },
          // rangeSelector: {
          //   height: 45, //Change it to 30
          //   inputFields: {
          //     startValue: new Date(2021, 5, 20, 11, 22, 30),
          //     endValue: new Date(2021, 5, 20, 12, 22, 30),
          //   },
          // },
          rangeChanged: rangeHandler,
        }}
      />

      {/* Volume bar */}
      {/* <VolumeChart ref={barChartRef} /> */}

      {/* <CanvasJSChart
        options={{
          title: {
            text: 'Z values in Bubble Chart',
          },
          data: [
            {
              type: 'bubble',
              dataPoints: [
                { x: 110, y: 71, z: 10 },
                { x: 20, y: 55, z: 10 },
                { x: 30, y: 50, z: 5 },
                { x: 40, y: 65, z: 2 },
                { x: 50, y: 95, z: 10 },
                { x: 60, y: 68, z: 13 },
                { x: 70, y: 28, z: 11 },
                { x: 70, y: 50, z: 11.95555 },
                { x: 70, y: 80, z: 12 },
                { x: 80, y: 34, z: 5 },
                { x: 90, y: 14, z: 6 },
              ],
            },
          ],
          rangeSelector: {
            height: 45, //Change it to 30

            inputFields: {
              enabled: true,
              startValue: 40,
              endValue: 60,
            },
          },
        }}
      /> */}
    </div>
  )
}

export default Scatter
