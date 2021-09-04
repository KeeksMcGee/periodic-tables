import React from "react";

//I will pass in a reservation object as a prop:
export default function Reservation({ reservation }) {
    /*returning 'null' inside of a react component basically means return nothing. 
    However, we always want o make sure we return null if we intend to return null*/
    //If the reservation is finished, we do not want it to be shwon on the dashboard
    if (!reservation || reservation.status === "finished") return null;

    return (
        <tr>
            {/*because the reservation id is a primary key, I can make this into a table header (and make the text bold)*/}
            <th scope="row">{reservation.reservation_id}</th>
            {/* for everthing else, we can use 'td', meaning table data */}
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.resevation_id}>{reservation.status}</td>
            {reservation.status === "booked" &&
                <td>
                <a href={`/reservations/${reservation.reservation_id}/seat`}>
                    <button type="button">Seat</button>
                </a>
            </td>
            }
        </tr>
    );
}