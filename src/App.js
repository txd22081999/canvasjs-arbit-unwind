import { useEffect, useState } from 'react'
import moment from 'moment'

import Main from './pages/Main'
import { addSecond } from './utils'

import 'react-table-v6/react-table.css'
import './App.scss'

const App = () => {
  useEffect(() => {
    // const start = '09:16:00'
    // const end = '11:00:00'
    // const a = addSecond('09:41:40')
    // const b = addSecond(a)
    return () => {
      sessionStorage.removeItem('selected')
    }
  }, [])

  return (
    <div className='App'>
      {/* <Scatter /> */}
      <Main />
    </div>
  )
}

export default App
