import React from "react";
import { finishTable } from "../utils/api";

export default function TableRow({ table, loadDashboard }) {
    if (!table) return null;

    const abortController = new AbortController();
   

    /*window.confirm will show a dialogue that will give an "OK" button or a "Cancel" button.
    It will return true if the OK button is pressed, false for cancel
    The dashboard should reload if OK is pressed, so we use history here for that reason */
    //Call when the user wants to finish a table that is currently seated
    function handleFinish() {
        if (window.confirm("Is this table ready to seat new guests? This can not be undone")) {
            //TODO: Delete the request here
            finishTable(table.table_id, abortController.signal)
                .then(loadDashboard);
            
            return () => abortController.abort();
        }
    } 

    return (
        <tr>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            {/*the tests are looking for data-table-id-status so be sure to include it*/}
            <td data-table-id-status={table.table_id}>{table.status}</td>
            <td>{table.reservation_id ? table.reservation_id : "--"}</td>
            {table.status === "occupied" &&
                <td>
                <button data-table-id-finish={table.table_id} onClick={handleFinish} type="button">Finish</button>
                </td>
            }
        </tr>
    )
}