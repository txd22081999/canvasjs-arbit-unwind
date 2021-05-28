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
    const { updateRef, zoomOnScroll } = props
    updateRef({ name: 'barArbit', ref: barArbitChartRef })
    const chartEl = document.querySelector('#canvasjs-react-chart-container-5')
    chartEl.addEventListener('wheel', (e) => zoomOnScroll(barArbitChartRef, e))
  }, [])

  return (
    <div>
      <CanvasJSChart
        // ref={ref}
        ref={barArbitChartRef}
        options={{
          height: 70,
          // interactivityEnabled: true,
          zoomEnabled: true,
          // height: 700,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            labelFormatter,
            crosshair: {
              enabled: true,
              // showAt: 1621396741826.3198,
              updated: (e) => {
                crosshairXMove(e)
              },
            },
            gridThickness: 0,
            // minimum: new Date('2021-05-19 09:16:00'),
            // maximum: new Date('2021-05-19 11:00:00'),
            minimum: barArbit.minX,
            maximum: barArbit.maxX,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
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
              // fillOpacity: 0,
              dataPoints: [...barArbit.data],
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
