import React from 'react'

import { useSelector, useDispatch } from 'react-redux'

import './SelectTable'

const SelectTable = () => {
  const global = useSelector((state) => state.global)
  const dispatch = useDispatch()

  return (
    <div>
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
    </div>
  )
}

export default SelectTable
