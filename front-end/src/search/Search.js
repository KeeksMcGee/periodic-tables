import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow"
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
    //this state stores the search input
    const [mobileNumber, setMobileNumber] = useState("");

    //this state will store the search results
    const [reservations, setReservations] = useState([]);

    //this state will store any errors
    const [error, setError] = useState(null);

    function handleChange({ target }) {
        setMobileNumber(target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const abortController = new AbortController();

        setError(null);

        //Our search query is the mobile_number (the name of the column in the reservations table)
        //The search value is our mobileNumber state
        listReservations({ mobile_number: mobileNumber }, abortController.signal)
            .then(setReservations)
            .catch(setError);
        
        return () => abortController.abort();
    }

    const searchResultsJSX = () => {
        //I will use a ternary here. Something different should return if there are no reservations
        return reservations.length > 0 ?
            //we can use the same ReservationRow component used in the dashboard
            reservations.map((reservation) => 
                <ReservationRow key={reservation.reservation_id} reservation={reservation} />) :
            <p>No Reservations Found</p>
    }


    return (
        <div>
            <form>
                <br />
                <ErrorAlert error={error} />
                <label className="form-label" htmlFor="mobile_number">Enter a customer's phone number:</label>
                <input
                    className="form-control"
                    name="mobile_number"
                    id="mobile_number"
                    type="tel"
                    onChange={handleChange}
                    value={mobileNumber}
                    required
                />
                <button className="btn btn-primary m-1" type="submit" onClick={handleSubmit}>Find</button>
            </form>

            <table className="table table-hover m-1">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile Number</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">People</th>
                        <th scope="col">Status</th>
                        <th scope="col">Edit</th>
			            <th scope="col">Cancel</th>
                        <th scope="col">Seat</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResultsJSX()}
                </tbody>
            </table>
        </div>
    )
}