import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AXIS_FONT_SIZE, PREDICT_COLOR } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian, labelFormatter } from '../../utils'
import './VolumeChart.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const VolumeChart = forwardRef((props, ref) => {
  // const { dataPoints = [], viewport } = props
  const global = useSelector((state) => state.global)
  const { viewport, barArbit, plotArbit } = global
  const barArbitChartRef = useRef(null)

  const { rangeHandler, crosshairXMove, crosshairYMove } = props

  const onMouseMove = (e) => {}

  useEffect(() => {
    const { updateRef, zoomOnScroll, setDefaultToPan } = props
    updateRef({ name: 'barArbit', ref: barArbitChartRef })
    const chartEl = document.querySelector('#canvasjs-react-chart-container-5')
    console.log(chartEl)
    chartEl.addEventListener('wheel', (e) =>
      zoomOnScroll(barArbitChartRef, e, global.viewport)
    )
    setDefaultToPan(chartEl)
  }, [])

  return (
    <div className='hello1'>
      <CanvasJSChart
        className='hello'
        // ref={ref}
        ref={barArbitChartRef}
        options={{
          height: 70,
          zoomEnabled: true,
          // height: 700,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            margin: 10,
            labelFormatter,
            crosshair: {
              enabled: true,
              updated: (e) => {
                crosshairXMove(e)
              },
            },
            gridThickness: 0,
            // minimum: barArbit.minX,
            // maximum: barArbit.maxX,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
            margin: 10,
            labelFontSize: AXIS_FONT_SIZE,
            maximum: barArbit.maxY,
            crosshair: {
              enabled: true,
              updated: (e) => {
                crosshairYMove(e, barArbit.maxY)
              },
            },
            gridThickness: 0,
          },
          data: [
            {
              // type: 'bubble',
              type: 'column',
              mousemove: onMouseMove,
              toolTipContent: `<div class='tool-tip'><p>num_lots: {y}</p></div>`,
              dataPoints: [...barArbit.data],
              // dataPoints: [
              //   { x: 1, y: 10 },
              //   { x: 2, y: 10 },
              //   { x: 3, y: 10 },
              //   { x: 4, y: 10 },
              //   { x: 5, y: 10 },
              //   { x: 6, y: 10 },
              // ],
              color: PREDICT_COLOR,
              // click: (e) => {
              //   onPointClick(e)
              // },
            },
          ],
          rangeChanged: rangeHandler,
          // rangeChanged: rangeHandler,
        }}
      />
    </div>
  )
})

export default VolumeChart
