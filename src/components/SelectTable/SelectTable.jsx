import React from 'react'
import ReactTable from 'react-table-v6'
import { useSelector, useDispatch } from 'react-redux'

import './SelectTable.scss'

const SelectTable = () => {
  const global = useSelector((state) => state.global)
  const dispatch = useDispatch()

  const tableData = [...global.plotArbit.selectedData]

  const columns = [
    {
      Header: 'total_data_points',
      accessor: 'totalDataPoints', // String-based value accessors!
    },
    {
      Header: 'total_data_num_lots',
      accessor: 'totalNumLots',
      Cell: (props) => <span className='number'>{props.value}</span>, // Custom cell components!
    },
    {
      Header: 'median',
      accessor: 'median', // String-based value accessors!
    },
    {
      Header: 'time',
      accessor: 'time', // String-based value accessors!
    },
  ]

  return (
    <div className='SelectTable'>
      <ReactTable width={600} data={tableData} columns={columns} />
    </div>
  )

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
