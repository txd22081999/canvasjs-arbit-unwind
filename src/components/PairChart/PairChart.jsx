import React, { useState, useEffect, forwardRef, useRef } from 'react'
import { useSelector } from 'react-redux'
import { AXIS_FONT_SIZE, PAIR_COUNT_COLOR } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian, labelFormatter } from '../../utils'
import './PairChart.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const PairChart = forwardRef((props, ref) => {
  // const { dataPoints = [], viewport } = props
  const global = useSelector((state) => state.global)
  const { viewport, barArbit, pairVol } = global
  const pairVolChartRef = useRef(null)

  const { rangeHandler, crosshairXMove, crosshairYMove } = props

  const onMouseMove = (e) => {}

  useEffect(() => {
    const { updateRef, zoomOnScroll, setDefaultToPan } = props
    updateRef({ name: 'pairVol', ref: pairVolChartRef })
    const chartEl = document.querySelector('#canvasjs-react-chart-container-3')
    chartEl.addEventListener('wheel', (e) =>
      zoomOnScroll(pairVolChartRef, e, global.viewport)
    )
    setDefaultToPan(chartEl)
  }, [])

  return (
    <div>
      <CanvasJSChart
        // ref={ref}
        ref={pairVolChartRef}
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
            minimum: pairVol.minX,
            maximum: pairVol.maxX,
            viewportMinimum: viewport.viewportMinimum,
            viewportMaximum: viewport.viewportMaximum,
          },
          axisY: {
            labelFontSize: AXIS_FONT_SIZE,
            maximum: pairVol.maxY,
            crosshair: {
              enabled: true,
              updated: (e) => {
                // console.log(pairVol.maxY)
                crosshairYMove(e, pairVol.maxY)
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
              dataPoints: [...pairVol.data],
              // dataPoints: [
              //   { x: new Date('09:41:40'), y: 2.2362657934417456 },
              //   { x: new Date('09:48:35'), y: 2.258014270108162 },
              //   { x: new Date('09:51:15'), y: 0.6519968470835523 },
              //   { x: new Date('09:51:25'), y: 0.7052341597796143 },
              //   { x: new Date('10:15:15'), y: 0.786730945821855 },
              //   { x: new Date('10:15:25'), y: 2.234722098313855 },
              //   { x: new Date('10:15:35'), y: 0.7820630547903276 },
              //   { x: new Date('10:15:45'), y: 0.8919928576052478 },
              //   { x: new Date('10:15:50'), y: 0.7867309458218549 },
              //   { x: new Date('10:15:55'), y: 0.7820630547903276 },
              //   { x: new Date('10:16:50'), y: 0.7820630547903276 },
              //   { x: new Date('10:17:15'), y: 0.7820630547903276 },
              //   { x: new Date('10:17:20'), y: 0.7685183683265582 },
              // ],
              color: PAIR_COUNT_COLOR,
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

export default PairChart
