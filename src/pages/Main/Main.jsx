import React, { useEffect, useRef, createRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Scatter from '../../components/Scatter'
import VolumeChart from '../../components/VolumeChart'

import {
  updateRefs,
  updatePlotArbit,
  updateViewport,
} from '../../features/global/globalSlice'

const Main = () => {
  const dispatch = useDispatch()
  const global = useSelector((state) => state.global)
  const { plotArbit, barArbit, viewport } = global
  // const refs = useSelector((state) => state.global.refs)
  const [refArr, setRefArr] = useState({
    plotArbit: null,
    barArbit: null,
  })

  const ref1 = useRef(null)

  console.log('Main render')
  console.log(ref1)

  const updateRef = ({ name, ref }) => {
    setRefArr((prevRefArr) => {
      return {
        ...prevRefArr,
        [name]: ref,
      }
    })
  }

  const rangeHandler = (e) => {
    // console.log(e)
    console.log(e)
    if (e.trigger === 'reset') {
      console.log('RESET')
      // changeToPanMode();
    }
    if (e.trigger === 'pan') {
      return
      // changeToPanMode();
    }
    const { chart } = e
    console.log(e)
    console.log(
      'type : ' +
        e.type +
        ', trigger : ' +
        e.trigger +
        ', AxisX viewportMininum : ' +
        e.axisX[0].viewportMinimum +
        ' AxisX viewportMaximum : ' +
        e.axisX[0].viewportMaximum
    )

    const minOffset = e.axisX[0].viewportMinimum - viewport.viewportMinimum
    const maxOffset = viewport.viewportMaximum - e.axisX[0].viewportMaximum

    const zoomValue =
      (maxOffset - minOffset) /
      (viewport.viewportMaximum - viewport.viewportMinimum)

    const prevDataPoints = [...plotArbit.data]
    console.log(prevDataPoints)
    const newDataPoints = prevDataPoints.map((point) => {
      return {
        ...point,
        markerSize: point.markerSize * (1 + Math.abs(zoomValue)),
      }
    })
    // Replace previous datapoits of chart option
    dispatch(updatePlotArbit({ data: newDataPoints }))

    dispatch(
      updateViewport({
        viewportMinimum: e.axisX[0].viewportMinimum,
        viewportMaximum: e.axisX[0].viewportMaximum,
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
      <Scatter updateRef={updateRef} rangeHandler={rangeHandler} />
      {/* <VolumeChart /> */}
      <VolumeChart
        // ref={ref1}
        updateRef={updateRef}
        rangeHandler={rangeHandler}
      />
    </div>
  )
  // return <p>Loading</p>
}

export default Main
