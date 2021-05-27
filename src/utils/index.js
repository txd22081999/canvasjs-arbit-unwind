import moment from 'moment'

export * from './plot-min'
export * from './plot'
export * from './unwind'

export const getMedian = (values) => {
  if (values.length === 0) return 0

  values.sort(function (a, b) {
    return a - b
  })

  var half = Math.floor(values.length / 2)

  if (values.length % 2) return values[half]

  return (values[half - 1] + values[half]) / 2.0
}

export const sampleDatPoints = [
  { x: 1110, y: 71, z: 10 },
  { x: 500, y: 55, z: 20 },
  { x: 500, y: 40, z: 1 },
  { x: 30, y: 50, z: 1 },
  { x: 40, y: 65, z: 2 },
  { x: 50, y: 95, z: 50 },
  { x: 60, y: 68, z: 13 },
  { x: 70, y: 28, z: 21 },
  { x: 80, y: 34, z: 5 },
  { x: 90, y: 14, z: 6 },
]

export const addSecond = (inputTime, seconds = 1) => {
  const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
  let newTime, input
  if (typeof inputTime === 'object') {
    input = inputTime
  } else {
    // const a = moment(`2021-05-27 09:41:40`, momentFormat)
    let time = moment(`2021-05-27 ${inputTime}`, dateTimeFormat)
    input = time
  }
  newTime = input.add({ seconds })
  newTime = moment(newTime.format(dateTimeFormat))
  return newTime
}

export const labelFormatter = (e) => {
  return moment(e.value).format('HH:MM')
}
