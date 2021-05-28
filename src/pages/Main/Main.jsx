import React, { useEffect, useRef, createRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PairChart from '../../components/PairChart'

import Scatter from '../../components/Scatter'
import ScatterBig from '../../components/ScatterBig'
import SelectTable from '../../components/SelectTable'
import VolumeChart from '../../components/VolumeChart'
import { VIEWPORT_MAXIMUM, VIEWPORT_MINIMUM } from '../../constants'

import {
  updateRefs,
  updatePlotArbit,
  updateViewport,
} from '../../features/global/globalSlice'

import './Main.scss'

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

  const ref1 = useRef(null)

  const updateRef = ({ name, ref }) => {
    setRefArr((prevRefArr) => {
      return {
        ...prevRefArr,
        [name]: ref,
      }
    })
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

    dispatch(
      updateViewport({
        viewportMinimum: newViewportMinimum,
        viewportMaximum: newViewportMaximum,
      })
    )
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
      <span className='summary'>
        2021_05_24_Arbit {Number.parseFloat(global.summary.unwind).toFixed(2)}{' '}
        tỷ VND
      </span>
      <Scatter
        updateRef={updateRef}
        rangeHandler={rangeHandler}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        barArbitRef={refArr.barArbit}
        zoomOnScroll={zoomOnScroll}
      />
      <PairChart
        // ref={ref1}
        updateRef={updateRef}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        rangeHandler={rangeHandler}
        zoomOnScroll={zoomOnScroll}
      />
      <VolumeChart
        // ref={ref1}
        updateRef={updateRef}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        rangeHandler={rangeHandler}
        zoomOnScroll={zoomOnScroll}
      />
      <ScatterBig
        updateRef={updateRef}
        rangeHandler={rangeHandler}
        crosshairXMove={crosshairXMove}
        crosshairYMove={crosshairYMove}
        barArbitRef={refArr.barArbit}
        zoomOnScroll={zoomOnScroll}
      />
      <SelectTable />
    </div>
  )
  // return <p>Loading</p>
}

export default Main
