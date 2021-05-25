import React, { useEffect, useRef, useState, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AXIS_FONT_SIZE } from '../../constants'
import CanvasJSReact from '../../lib/canvasjs-3.2.17/canvasjs.react'
import { PLOT_MIN, PLOT, getMedian } from '../../utils'
import VolumeChart from '../VolumeChart/VolumeChart'

import {
  updatePlotArbit,
  updateBarArbit,
  updateViewport,
  updateRefs,
} from '../../features/global/globalSlice'

import './Scatter.scss'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart

const Scatter = (props) => {
  const { rangeHandler } = props
  const viewport = useSelector((state) => state.global.viewport)
  const plotArbit = useSelector((state) => state.global.plotArbit)
  const barArbit = useSelector((state) => state.global.barArbit)
  const [chartData, setChartData] = useState([])
  const [originalChartData, setOriginalChartData] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const plotChartRef = useRef(null)
  const barChartRef = useRef(null)
  const dispatch = useDispatch()

  const [volumeData, setVolumeData] = useState([])

  const [fakeState, setFakeState] = useState(0)

  // const [viewport, setViewport] = useState({
  //   viewportMinimum: 1621390598622.0627,
  //   viewportMaximum: 1621409415869.5188,
  // })

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
      // const x = current.x
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
    console.log(e)
    const {
      dataSeries: { dataPoints },
      dataPoint: { x, y, z, time },
    } = e
    // const arr = chartData.filter((item) => item.y === e.y)
    const newDataPoints = dataPoints.filter((item) => +item.x !== +x)
    const selectedDataPoints = dataPoints.filter((item) => +item.x === +x)
    let totalNumLots = 0
    for (let i = 0; i < selectedDataPoints.length; i++) {
      totalNumLots += selectedDataPoints[i].numLots
    }
    const medianValue = getMedian(
      selectedDataPoints.map((item) => item.numLots)
    )
    setSelectedData((prev) => {
      const newData = {
        time,
        totalNumLots,
        totalDataPoints: selectedDataPoints.length,
        median: +Number.parseFloat(medianValue).toFixed(3),
      }
      return [...prev, newData]
    })
    console.log(chartData.length)
    console.log(newDataPoints.length)
    // setChartData(newDataPoints)
    setChartData([...newDataPoints])
  }

  // const rangeHandler = (e) => {
  //   // console.log(e)
  //   if (e.trigger === 'reset') {
  //     console.log('RESET')
  //     setChartData(originalChartData)
  //     // changeToPanMode();
  //   }
  //   if (e.trigger === 'pan') {
  //     return
  //     // changeToPanMode();
  //   }
  //   const { chart } = e
  //   console.log(e)
  //   console.log(
  //     'type : ' +
  //       e.type +
  //       ', trigger : ' +
  //       e.trigger +
  //       ', AxisX viewportMininum : ' +
  //       e.axisX[0].viewportMinimum +
  //       ' AxisX viewportMaximum : ' +
  //       e.axisX[0].viewportMaximum
  //   )

  //   const minOffset = e.axisX[0].viewportMinimum - viewport.viewportMinimum
  //   const maxOffset = viewport.viewportMaximum - e.axisX[0].viewportMaximum

  //   const zoomValue =
  //     (maxOffset - minOffset) /
  //     (viewport.viewportMaximum - viewport.viewportMinimum)

  //   const prevDataPoints = [...plotArbit.data]
  //   console.log(prevDataPoints)
  //   const newDataPoints = prevDataPoints.map((point) => {
  //     return {
  //       ...point,
  //       markerSize: point.markerSize * (1 + Math.abs(zoomValue)),
  //     }
  //   })
  //   // Replace previous datapoits of chart option
  //   dispatch(updatePlotArbit({ data: newDataPoints }))

  //   dispatch(
  //     updateViewport({
  //       viewportMinimum: e.axisX[0].viewportMinimum,
  //       viewportMaximum: e.axisX[0].viewportMaximum,
  //     })
  //   )
  // }

  const onMouseMove = (e) => {
    // if (!barChartRef) return
    // console.log(e)
    // const {
    //   dataPoint: { x, y },
    // } = e
    // console.log(barChartRef)
    // barChartRef.current.chart.axisX[0].crosshair.showAt(x)
    // barChartRef.current.chart.axisY[0].crosshair.showAt(y)
    // barChartRef.current.chart.axisX[0].crosshair.set('snapToDataPoint', true)
    // barChartRef.current.chart.axisX[0].crosshair.set('x', x)
    // barChartRef.current.chart.axisX[0].crosshair.set('y', y)
    // console.log(barChartRef.current.chart.axisX[0])
    // console.log(barChartRef.current.chart.axisX[0].crosshair)
  }

  const crosshairXMove = (e) => {
    if (!barChartRef.current) return
    barChartRef.current.chart.axisX[0].crosshair.showAt(e.value)
  }

  const crosshairYMove = (e) => {
    if (!barChartRef.current) return
    barChartRef.current.chart.axisY[0].crosshair.showAt((+e.value / 440) * 80)
  }

  return (
    <div>
      {/* Plot chart */}
      <CanvasJSChart
        ref={plotChartRef}
        id='chart-01'
        options={{
          title: {
            text: 'Scatter Plots',
            fontSize: 30,
          },
          height: 1000,
          interactivityEnabled: true,
          zoomEnabled: true,
          // height: 700,
          axisX: {
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              updated: crosshairXMove,
            },
            gridThickness: 0,
            // viewportMaximum: 100,
            viewport: viewport,
          },
          axisY: {
            // maximum: 800,
            labelFontSize: AXIS_FONT_SIZE,
            crosshair: {
              enabled: true,
              updated: crosshairYMove,
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
              color: 'rgb(162, 162, 255)',
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
            {selectedData.length > 0 &&
              selectedData.map(
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
      <p>Hello</p>
    </div>
  )
}

export default Scatter

{
  /* //   selectedData.map(({ totalDataPoints, totalNumLots }) => {
        //     return (
        //       <div className='info-item'>
        //         <span>total_data_points: {totalDataPoints}</span>
        //         <span>total_num_lots: {totalNumLots}</span>
        //       </div>
        //     )
        //   })} */
}
