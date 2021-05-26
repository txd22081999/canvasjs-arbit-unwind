import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ARBIT_PLOT_COLOR, AXIS_FONT_SIZE } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian } from '../../utils'
import VolumeChart from '../VolumeChart/VolumeChart'

import {
  updatePlotArbit,
  updateBarArbit,
  updateViewport,
  updateRefs,
  updatePlotArbitBig,
} from '../../features/global/globalSlice'

import './Scatter.scss'

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
    const { updateRef } = props
    updateRef({ name: 'plotArbit', ref: plotChartRef })
  }, [])

  useEffect(() => {
    // const newChartData = PLOT_MIN.slice(0, 100).map((item) => {
    // const newChartData = PLOT.slice(0, 2000).map((item) => {
    const newChartData = PLOT.map((item) => {
      const time = item.time.split(':')
      const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
      const z = item.radius ^ 0.5
      const zValue = +Number.parseFloat(item.radius).toFixed(3)
      const markerSize = Number.parseFloat(item.radius).toFixed(4)

      return {
        x: newTime,
        y: item.y,
        markerSize,
        numLots: item.num_lots,
        time: item.time,
      }
    })

    dispatch(
      updatePlotArbit({
        originalData: newChartData,
        data: newChartData,
      })
    )

    const newNumLotsData = newChartData.map(({ x, numLots }) => ({
      x,
      y: 1,
    }))

    console.log(newNumLotsData)
    const volumeDataArr = newNumLotsData.reduce((accumulator, current) => {
      const found = accumulator.find((elem) => {
        return +elem.x === +current.x
      })
      if (found) found.y += current.y
      else accumulator.push(current)
      return accumulator
    }, [])

    dispatch(
      updateBarArbit({
        originalData: volumeDataArr,
        data: volumeDataArr,
      })
    )
  }, [])

  console.log(plotArbit)

  const onPointClick = (e) => {
    const {
      dataSeries: { dataPoints },
      dataPoint: { x, y, z, time },
    } = e

    const newDataPoints = dataPoints.filter((item) => +item.x !== +x)
    const newBigArbitDataPoints = [...global.plotArbitBig.data].filter(
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
  }

  const onMouseMove = (e) => {}

  console.log(viewport)

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
          height: 700,
          interactivityEnabled: true,
          zoomEnabled: true,
          axisX: {
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
                crosshairYMove(e, plotArbit.maxY)
              },
            },
            gridThickness: 0,
          },
          data: [
            {
              type: 'line',
              // mousemove: onMouseMove,
              toolTipContent: `<div class='tool-tip'><p>r: {markerSize}</p><p>y: {y}</p></div>`,
              fillOpacity: 0,
              dataPoints: [...plotArbit.data],
              markerType: 'circle',
              // lineThickness: 0,
              lineColor: 'white',
              color: ARBIT_PLOT_COLOR,
              click: (e) => {
                onPointClick(e)
              },
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
      <div className='info'>
        <table>
          <thead>
            <tr>
              <th>total_data_points</th>
              <th>total_data_num_lots</th>
              <th>median</th>
              <th>time</th>
            </tr>
          </thead>

          <tbody>
            {global.plotArbit.selectedData.length > 0 &&
              global.plotArbit.selectedData.map(
                ({ totalDataPoints, totalNumLots, time, median }) => {
                  return (
                    <tr>
                      <td>{totalDataPoints}</td>
                      <td>{totalNumLots}</td>
                      <td>{median}</td>
                      <td>{time}</td>
                    </tr>
                  )
                }
              )}
          </tbody>
        </table>
      </div>

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
