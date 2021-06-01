import React, { useEffect, useRef, createRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import socketIOClient from 'socket.io-client'
import axios from 'axios'

import PairChart from '../../components/PairChart'
import Scatter from '../../components/Scatter'
import ScatterBig from '../../components/ScatterBig'
import SelectTable from '../../components/SelectTable'
import VolumeChart from '../../components/VolumeChart'
import {
  AXIS_FONT_SIZE,
  GREEN_PLOT_COLOR,
  PINK_COLOR,
  VIEWPORT_MAXIMUM,
  VIEWPORT_MINIMUM,
  INTERVAL_TIME,
} from '../../constants'

import {
  updateRefs,
  updatePlotArbit,
  updateViewport,
  updateBarArbit,
  updatePairVol,
  updateSummary,
  updatePlotArbitBig,
} from '../../features/global/globalSlice'

import './Main.scss'
import { ARBIT_ENDPOINT } from '../../services'
import { UNWIND } from '../../utils'

const SOCKET_ENDPOINT = `http://45.119.214.155:60009`

const Main = () => {
  const dispatch = useDispatch()
  const global = useSelector((state) => state.global)
  const { plotArbit, barArbit, plotArbitBig, viewport, pairVol } = global
  // const refs = useSelector((state) => state.global.refs)
  const [refArr, setRefArr] = useState({
    plotArbit: null,
    barArbit: null,
    plotArbitBig: null,
    pairVol: null,
  })
  const [date, setDate] = useState(new Date())

  const ref1 = useRef(null)

  // const connectSocket = async () => {
  //   const res = await axios({
  //     url: SOCKET_ENDPOINT,
  //     method: 'GET',
  //   })
  //   const socket = socketIOClient(SOCKET_ENDPOINT)
  //   socket.on('FromAPI', (data) => {
  //     console.log(data)
  //   })

  //   console.log(res)
  // }

  const fetchArbitData = async () => {
    const res = await axios({
      method: 'GET',
      url: ARBIT_ENDPOINT,
    })

    const { data = [] } = res

    const newChartData = data.map((item) => {
      const time = item.time.split(':')
      // const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
      const newTime = new Date(item.time)
      const numLots = item.num_lots
      const counted = item.counted
      const color = counted ? GREEN_PLOT_COLOR : ''
      const bigColor = counted ? '' : PINK_COLOR
      const markerSize = Number.parseFloat(+numLots * 2).toFixed(4)

      return {
        x: newTime,
        y: item.y,
        markerSize,
        numLots,
        time: item.time,
        counted,
        color,
        bigColor,
      }
    })

    return newChartData
  }

  const setUpData = async () => {
    let newChartData = await fetchArbitData()
    // newChartData = newChartData.slice(0, 100)
    // console.log(newChartData)

    // const newChartData = UNWIND.circles.map((item) => {
    //   const time = item.time.split(':')
    //   const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
    //   const z = item.radius ^ 0.5
    //   const zValue = +Number.parseFloat(item.radius).toFixed(3)
    //   const markerSize = Number.parseFloat(item.radius).toFixed(4)

    //   return {
    //     x: newTime,
    //     y: item.y,
    //     markerSize,
    //     numLots: item.num_lots,
    //     time: item.time,
    //     // counted: item.counted,
    //     color: item.counted ? '' : GREEN_PLOT_COLOR,
    //     bigColor: item.counted ? '' : 'pink',
    //   }
    // })

    // console.log(newChartData)

    const timeArr = newChartData.map(({ x }) => x)
    const minX = new Date(Math.min.apply(null, timeArr))
    const maxX = new Date(Math.max.apply(null, timeArr))

    console.log(minX)
    console.log(maxX)

    dispatch(
      updatePlotArbit({
        originalData: newChartData,
        data: newChartData,
        minX,
        maxX,
      })
    )

    const newBigChartData = newChartData
      .filter((item) => item.numLots > 2.5)
      .map((item) => {
        // const time = item.time.split(':')
        // const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
        const newTime = new Date(item.time)
        const markerSize = Number.parseFloat(+item.markerSize * 1).toFixed(4)
        const color = item.counted ? GREEN_PLOT_COLOR : ''

        return {
          x: newTime,
          y: item.y,
          markerSize,
          numLots: item.numLots,
          time: item.time,
          color,
        }
      })

    dispatch(
      updatePlotArbitBig({
        originalData: newBigChartData,
        data: newBigChartData,
      })
    )

    // const newNumLotsData = newChartData.map(({ x, numLots }) => ({
    //   x,
    //   y: 1,
    // }))

    // old
    // const volumeDataArr = UNWIND.predictions.map(
    //   ({ time: timeInput, num_lots }) => {
    //     const time = timeInput.split(':')
    //     const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
    //     return { x: newTime, y: num_lots }
    //   }
    // )

    // new
    const volumeDataArr = newChartData.map(({ time: timeInput, numLots }) => {
      // const time = timeInput.split(':')
      // const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
      // return { x: newTime, y: numLots }
      return { x: new Date(timeInput), y: numLots }
    })

    // const pairVolDataArr = UNWIND.pair_count.map(
    //   ({ time: timeInput, num_lots }) => {
    //     const time = timeInput.split(':')
    //     const newTime = new Date(2021, 4, 19, +time[0], +time[1], +time[2])
    //     return { x: newTime, y: num_lots }
    //   }
    // )

    dispatch(
      updateBarArbit({
        originalData: volumeDataArr,
        data: volumeDataArr,
        minX,
        maxX,
      })
    )

    // dispatch(
    //   updatePairVol({
    //     originalData: pairVolDataArr,
    //     data: pairVolDataArr,
    //     minX,
    //     maxX,
    //   })
    // )
    // dispatch(updateSummary(UNWIND.summary))
  }

  console.log('RENDER')

  useEffect(() => {
    // connectSocket()
    setUpData()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      console.log('Hello')
      setUpData()
      setDate(new Date())
    }, INTERVAL_TIME)
  }, [date])

  const updateRef = ({ name, ref }) => {
    setRefArr((prevRefArr) => {
      return {
        ...prevRefArr,
        [name]: ref,
      }
    })
  }

  const setDefaultToPan = (chartEl) => {
    const panBtn = chartEl.querySelectorAll('button')[0] // change default mode from Zoom to Pan
    if (panBtn.getAttribute('state') === 'pan') {
      panBtn.click()
    }
  }

  const rangeHandler = (e) => {
    const { chart } = e
    if (e.trigger === 'reset') {
      console.log('RESET')
      return
      // changeToPanMode();
    }
    const minOffset = e.axisX[0].viewportMinimum - viewport.viewportMinimum
    const maxOffset = viewport.viewportMaximum - e.axisX[0].viewportMaximum
    if (e.trigger === 'zoom') {
      const zoomValue =
        (maxOffset - minOffset) /
        (viewport.viewportMaximum - viewport.viewportMinimum)

      console.log(zoomValue)
      dispatch(updatePlotArbit({ zoomValue }))

      // changeToPanMode();
    }
    if (e.trigger === 'pan') {
      // changeToPanMode();
    }

    dispatch(
      updateViewport({
        viewportMinimum: e.axisX[0].viewportMinimum,
        viewportMaximum: e.axisX[0].viewportMaximum,
      })
    )
  }

  const crosshairXMove = (e) => {
    // if (!ref1.current) return
    // console.log(ref1.current)
    // ref1.current.chart.axisX[0].crosshair.showAt(e.value)
    if (!refArr.barArbit || !refArr.barArbit.current) return
    // console.log(refArr.barArbit.current)
    refArr.barArbit.current.chart.axisX[0].crosshair.showAt(e.value)
    refArr.plotArbit.current.chart.axisX[0].crosshair.showAt(e.value)
    refArr.plotArbitBig.current.chart.axisX[0].crosshair.showAt(e.value)
    refArr.pairVol.current.chart.axisX[0].crosshair.showAt(e.value)
  }

  const crosshairYMove = (e, max) => {
    // if (!ref1.current) return
    // console.log(ref1.current)
    // ref1.current.chart.axisX[0].crosshair.showAt(e.value)
    if (!refArr.barArbit) return
    refArr.barArbit.current.chart.axisY[0].crosshair.showAt(
      (e.value / max) * barArbit.maxY
    )
    refArr.plotArbit.current.chart.axisY[0].crosshair.showAt(
      (e.value / max) * plotArbit.maxY
    )
    refArr.plotArbitBig.current.chart.axisY[0].crosshair.showAt(
      (e.value / max) * plotArbitBig.maxY
    )
    refArr.pairVol.current.chart.axisY[0].crosshair.showAt(
      (e.value / max) * pairVol.maxY
    )
  }

  const zoomOnScroll = (ref, e) => {
    if (!window.event.ctrlKey) return
    e.preventDefault()

    const chart = ref.current.chart

    let dir = (e.wheelDelta || -e.detail) > 0 ? -1 : +1
    let axisX = chart.axisX[0]
    let delta = (dir * (axisX.viewportMaximum - axisX.viewportMinimum)) / 10

    let newViewportMinimum =
      axisX.viewportMinimum - delta * (e.clientX / chart.width)
    let newViewportMaximum =
      axisX.viewportMaximum + delta * (1 - e.clientX / chart.width)

    const zoomValue =
      (newViewportMinimum / viewport.viewportMinimum - 1) * 1000000 + 1

    console.log('Zoom', zoomValue)
    dispatch(updatePlotArbit({ zoomValue }))

    console.log(axisX.viewportMinimum)
    console.log(axisX.viewportMaximum)

    dispatch(
      updateViewport({
        viewportMinimum: newViewportMinimum,
        viewportMaximum: newViewportMaximum,
      })
    )
  }

  if (global.plotArbit.data.length === 0) {
    return null
  }

  return (
    <div>
      {/* <button
        onClick={() => {
          // refArr.plotArbit.current.options.height = 200
          // refArr.plotArbit.current.options.title.text = 'Wut'
          // console.log(refArr.plotArbit.current.chart.render)
          // refArr.plotArbit.current.chart.render()
          // console.log(refArr)
          // setRefArr((prevArr) => ({ ...prevArr }))

          ref1.current.options.height = 1000
          console.log(ref1)
          ref1.current.chart.render()
        }}
      >
        Hello
      </button> */}
      {/* <span className='summary'>2021_05_24_Arbit 50.26 tỷ VND</span> */}
      {/* <span className='summary'>
        2021_05_24_Arbit {Number.parseFloat(global.summary.unwind).toFixed(2)}{' '}
        tỷ VND
      </span> */}
      <Scatter
        updateRef={updateRef}
        rangeHandler={rangeHandler}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        barArbitRef={refArr.barArbit}
        zoomOnScroll={zoomOnScroll}
        setDefaultToPan={setDefaultToPan}
      />
      <PairChart
        updateRef={updateRef}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        rangeHandler={rangeHandler}
        zoomOnScroll={zoomOnScroll}
        setDefaultToPan={setDefaultToPan}
      />
      <VolumeChart
        updateRef={updateRef}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        rangeHandler={rangeHandler}
        zoomOnScroll={zoomOnScroll}
        setDefaultToPan={setDefaultToPan}
      />
      <ScatterBig
        updateRef={updateRef}
        rangeHandler={rangeHandler}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        barArbitRef={refArr.barArbit}
        zoomOnScroll={zoomOnScroll}
        setDefaultToPan={setDefaultToPan}
      />
      <SelectTable />
    </div>
  )
  // return <p>Loading</p>
}

export default Main
