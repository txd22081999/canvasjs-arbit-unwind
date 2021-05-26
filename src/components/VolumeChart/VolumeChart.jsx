import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AXIS_FONT_SIZE } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian } from '../../utils'
import './VolumeChart.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const VolumeChart = forwardRef((props, ref) => {
  // const { dataPoints = [], viewport } = props
  const global = useSelector((state) => state.global)
  const { viewport, barArbit, plotArbit } = global
  const barArbitChartRef = useRef(null)

  const { rangeHandler, crosshairXMove, crosshairYMove } = props

  // console.log(props)
  console.log('render')

  const onMouseMove = (e) => {
    // console.log(e)
  }

  useEffect(() => {
    const { updateRef } = props
    updateRef({ name: 'barArbit', ref: barArbitChartRef })
  }, [])

  return (
    <div>
      <CanvasJSChart
        // ref={ref}
        ref={barArbitChartRef}
        options={{
          height: 100,
          // interactivityEnabled: true,
          zoomEnabled: true,
          // height: 700,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              // showAt: 1621396741826.3198,
              updated: (e) => {
                crosshairXMove(e)
              },
            },
            gridThickness: 0,
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
              color: 'rgb(162, 162, 255)',
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
