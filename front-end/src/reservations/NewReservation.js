import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//FIRST STEPS:
/*
1. Import React
2. Create component function and export it
3. Create a return statement
*/

export default function NewReservation() {

    const history = useHistory();
    /* USE HISTORY:
    * history.go(-1) OR history.goBack() = to go back a page
    */
    
    //Create an initial, default form that the user will see when they first visit the page
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
        //For this, I underscored instead of camelcased to keep consistent with the name attributes that will be edited later
    });

    function handleChange({ target }) { //deconstruct the event argument
        //Will be using the useState hook to store whatever changes are made
        //this is why I use underscore, so when the target is accessed we get the input name in underscore
        setFormData({ ...formData, [target.name]: target.value });
        //use the spread operator '...' so all previous values do not get overwritten
    }

    function handleSubmit(event) {
        event.preventDefault(); //the normal submit refreshes the entire page and I don't want that to happen

        //TODO: Edit this to post the request to the database
        /* The submit button will redirect the user to the dashboard on a specific date.
        the dashboard will have a URL query with the data. It looks like /dashboard?date=2035-12-30, so I'll replicate this here
        the push function 'pushes' the user to whatever path you give.*/
        history.push(`/dashboard?date=${formData.reservation_date}`);
    }
    
    return (
        <form>
            {/*use the following as a template for your input fields */}
            <label className="form-label" htmlFor="first_name">First Name:</label>
           
            <input
                className="form-control"
                name="first_name"
                id="first_name"
                type="text"
                onChange={handleChange} //onChange will automatically pass the 'event argument based off of which input was clicked
                //I can now use useState hook to store the values of each input now
                value={formData.first_name}
                required
            />
            <label className="form-label" htmlFor="last_name">Last Name:</label>
            <input
                className="form-control"
                name="last_name"
                id="last_name"
                type="text"
                onChange={handleChange}
                value={formData.last_name}
                required
            />
            <label className="form-label" htmlFor="mobile_number">Mobile Number:</label>
            <input
                className="form-control"
                name="mobile_number"
                id="mobile_number"
                type="number"
                onChange={handleChange}
                value={formData.mobile_number}
                required
            />
            <label className="form-label" htmlFor="reservation_date">Reservation Date</label>
                <input
                    className="form-control"
                    name="reservation_date"
                    id="reservation_date"
                    type="date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    required
                />
            
            <label className="form-label" htmlFor="reservation_time">Reservation Time</label>
                <input
                    className="form-control"
                    name="reservation_time"
                    id="reservation_time"
                    type="time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    required
            />
            <label className="form-label" htmlFor="people">Party Size:</label>
            <input
                className="form-control"
                name="people"
                id="people"
                type="number"
                min="1"
                onChange={handleChange}
                value={formData.people}
                required
            />
            <br/>
            <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-danger" type="button" onClick={history.goBack}>Cancel</button>
        </form>
    );
}