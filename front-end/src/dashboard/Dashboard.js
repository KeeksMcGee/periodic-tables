import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  /* Two states are bring stored. the 'reservations' state is esp important because it is holding the response
  from the API
  */
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  /*useEffect(func, depend) - func that is called when the page first renders, and every time one of the variables in the dependency array changes
  a dependency of [] i.e. (func, [])will only be ran once
  in this case, useEffect will call the loadDashboard function every time the 'date' variable changes */
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //abort controller is used for async calls and to avoid race conditions
    const abortController = new AbortController();
    //no errors
    setReservationsError(null);
    //time to make the API call. the first parameter {data} is the search param for the database, and also the value of 'date'.
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    //where all other abortControllers will dump their asyn calls - race conditions fixed
    return () => abortController.abort();
  }

  /*This return statement has a component that will show errors if something goes wrong (ErrorAlert), then it stringifies the response from the API 
  Right now, the stringify will still output some js-looking strings. Need to find another way to later format this nicely for the user*/
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
      <button type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      <button type="button" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;
