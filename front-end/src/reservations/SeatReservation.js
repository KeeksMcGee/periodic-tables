import React, {useState} from "react";
import { useHistory, useParams } from "react-router-dom";


export default function SeatReservation({ reservations, tables }) {
    const history = useHistory();

    //here are the tables we need to keep track of
    const [tableId, setTableId] = useState(0);
    const [errors, setErrors] = useState([]);

    const reservation_id = useParams();

    //in case the props passed in do not exist
    if (!tables || !reservations) return null;

    //change handler sets tableId state
    function handleChange({ target }) {
        setTableId(target.value);
    }

    //submit handler
    function handleSubmit(event) {
        event.preventDefault();

        if (validateSeat()) {
            history.push(`/dashboard`);
        }
    }

    function validateSeat() {
        const foundErrors = [];

        //We need to be able to use the find method here to get hte actual table/reservations objects from their ids
        const foundTable = tables.find((table) => table.table_id === tableId);
        const foundReservation = reservations.find((reservation) => reservation.reservation_id === reservation_id);

        if (!foundTable) {
            foundErrors.push("The table you selected does not exist");
        } else if (!foundReservation) {
            foundErrors.push("This reservation does not exist")
        } else {
            if (foundTable.status === "occupied") {
                foundErrors.push("The table you have selected is currently occupied.")
            }
            if (foundTable.capacity < foundReservation.people) {
                foundErrors.push(`The table you have selected can not seat ${foundReservation.people} people.`)
            }
        }

        setErrors(foundErrors);
        //this conditional will either return true or false based off of whether foundErrors is equal to 0
        return foundErrors.length === 0;
    }

    const tableOptionsJSX = () => {
        return tables.map((table) =>
            /*Make sure to include the values. The option text is required for the tests in the instructions */
            <option values={table.table_id}>{table.name} - {table.capacity}</option>);
    }
    return (
        <form>
            <label htmlFor="table_id">Choose table:</label>
            <select
                name="table_id"
                id="table_id"
                value={tableId}
                onChange={handleChange}
            >
                {tableOptionsJSX()}
            </select>
            <br/>
            <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-danger" type="button" onClick={history.goBack}>Cancel</button>
       </form>
    )
}