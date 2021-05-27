import { useEffect, useState } from 'react'
import moment from 'moment'

import Main from './pages/Main'
import './App.scss'
import { addSecond } from './utils'

const App = () => {
  useEffect(() => {
    // const start = '09:16:00'
    // const end = '11:00:00'
    // const a = addSecond('09:41:40')
    // const b = addSecond(a)
  }, [])

  return (
    <div className='App'>
      {/* <Scatter /> */}
      <Main />
    </div>
  )
}

export default App
