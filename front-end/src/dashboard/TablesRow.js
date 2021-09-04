import React from "react";
import { useHistory } from "react-router";

export default function TableRow({ table, handleFinish }) {
    const history = useHistory();
    if (!table) return null;
   

    /*window.confirm will show a dialogue that will give an "OK" button or a "Cancel" button.
    It will return true if the OK button is pressed, false for cancel
    The dashboard should reload if OK is pressed, so we use history here for that reason */
    function handleFinish() {
        if (window.confirm("Is this table ready to seat new guests? This can not be undone")) {
            //TODO: Delete the request here
            history.pushState("/dashboard");
        }
    } 

    return (
        <tr>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            {/*the tests are looking for data-table-id-status so be sure to include it*/}
            <td data-table-id-status={table.table_id}>{table.status}</td>
            {table.status === "occupied" &&
                <td data-table-id-finish={table.table_id}>
                    <button onClick={handleFinish} type="button">Finish</button>
                </td>
            }
        </tr>
    )
}