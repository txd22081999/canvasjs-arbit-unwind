import React, { useState, useEffect, forwardRef } from 'react'
import { AXIS_FONT_SIZE } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian } from '../../utils/'
import './VolumeChart.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const VolumeChart = forwardRef((props, ref) => {
  const { dataPoints = [], viewport } = props

  // console.log(props)
  console.log('render')

  const onMouseMove = (e) => {
    console.log(e)
  }

  return (
    <div>
      <CanvasJSChart
        ref={ref}
        options={{
          height: 300,
          // interactivityEnabled: true,
          zoomEnabled: true,
          // height: 700,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
            },
            gridThickness: 0,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
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
              dataPoints,
              color: 'rgb(162, 162, 255)',
              // click: (e) => {
              //   onPointClick(e)
              // },
            },
          ],
          // rangeChanged: rangeHandler,
        }}
      />
    </div>
  )
})

export default VolumeChart
