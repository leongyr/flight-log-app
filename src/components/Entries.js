import React from 'react'
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';


export const Entries = ({entries}) => {

    if (entries.length === 0) return null

    const EntryRow = (entry,index) => {

        return(
          <tr key={entry._id}>
              <td>{index+1}</td>
              <td>{entry.tailNumber}</td>
              <td>{entry.flightID}</td>
              <td>{entry.takeoff}</td>
              <td>{entry.landing}</td>
              <td>{entry.duration}</td>
              <td><Button color="primary" onClick="">Edit</Button></td>
              <td><Button color="secondary" onClick="">Delete</Button></td>
          </tr>
          )
    }

    const entryTable = entries.map((entry,index) => EntryRow(entry,index))

    return(
        <tbody>
            {entryTable}
        </tbody>
    )
}