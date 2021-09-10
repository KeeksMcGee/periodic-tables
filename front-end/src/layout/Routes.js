import React, { useState, useEffect } from "react";
import { listReservations, listTables } from "../utils/api"
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation"
import useQuery from "../utils/useQuery"
import NewTable from "../tables/NewTable";
import SeatReservation from "../reservations/SeatReservation"
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date") ? query.get("date") : today();

   /* Two states are bring stored. the 'reservations' state is esp important because it is holding the response
  from the API
  */
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
   
   
   const [tables, setTables] = useState([]);
   const [tablesError, setTablesError] = useState(null);

  /*useEffect(func, depend) - func that is called when the page first renders, and every time one of the variables in the dependency array changes
  a dependency of [] i.e. (func, [])will only be ran once
  in this case, useEffect will call the loadDashboard function every time the 'date' variable changes */
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    //abort controller is used for async calls and to avoid race conditions
    const abortController = new AbortController();
    //no errors
    setReservationsError(null);
    setTablesError(null);
    //time to make the API call. the first parameter {data} is the search param for the database, and also the value of 'date'.
    listReservations({ date: date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    
    listTables(abortController.signal)
      .then((tables) => tables.sort((tableA, tableB) => tableA.table_id - tableB.table_id))
      .then(setTables)
      .catch(setTablesError);
    //where all other abortControllers will dump their asyn calls - race conditions fixed
    return () => abortController.abort();
   }
   
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <NewReservation
          loadDashboard={loadDashboard}
          edit={true}
        />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation
          reservations={reservations}
          tables={tables}
        />
      </Route>
      <Route path="/tables/new">
        <NewTable
        loadDashboard={loadDashboard}
        />
      </Route>
      <Route path="/dashboard">
        {/*if date exists, pass in that date. Otherwise use today's date */}
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>
         <Route path="/search">
        <Search/>
        </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
