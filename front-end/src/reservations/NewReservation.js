import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

//FIRST STEPS:
/*
1. Import React
2. Create component function and export it
3. Create a return statement
*/

//to differentiate a new reservation from an existing one, I will pass an optional prop I'm editing
export default function NewReservation({ edit, reservations }) {

    const history = useHistory();
    /* USE HISTORY:
    * history.go(-1) OR history.goBack() = to go back a page
    */
    
    const { reservation_id } = useParams();
    
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

    const [errors, setErrors] = useState([]);

    function handleChange({ target }) { //deconstruct the event argument
        //Will be using the useState hook to store whatever changes are made
        //this is why I use underscore, so when the target is accessed we get the input name in underscore
        setFormData({ ...formData, [target.name]: target.value });
        //use the spread operator '...' so all previous values do not get overwritten
    }

        
    function handleSubmit(event) {
        event.preventDefault(); //the normal submit refreshes the entire page and I don't want that to happen

        //create an empty array for the errors
        const foundErrors = [];

        /* If there are no errors, we don't want to push the user to a different page, but stay on this page
        until the issue is resolved. A return statement in the validation function will be true when the date is valid
        and false if it isn't we only push the user if there are no users with the reservation date
        */
        if (validateFields(foundErrors) && validateDate(foundErrors)) {
            history.push(`/dashboard?date=${formData.reservation_date}`)
        }

        //The validation function will set its found errors into the state. If no errors, it'll return an empty array
        setErrors(foundErrors);

        //TODO: Edit this to post the request to the database
        /* The submit button will redirect the user to the dashboard on a specific date.
        the dashboard will have a URL query with the data. It looks like /dashboard?date=2035-12-30, so I'll replicate this here
        the push function 'pushes' the user to whatever path you give.*/
        
    }

    //A function to make sure all the reservation fields are filled out.
    function validateFields(foundErrors) {
        for (const field in formData) {
            if (formData[field] === "") {
                foundErrors.push({ message: `${field.split("_").join(" ")} can not be left blank.`})
            }
        }
        if (formData.people <= 0) {
            foundErrors.push({ message: "Party must be size of at least one person"})
        }

        if (foundErrors.length > 0) {
            return false;
        }
        return true;
    }


    /*create a function to see if the reservation is on Tuesday(when the restaurant is closed) or if a a 
        or if a reservation is made outside of restaurant operating hours
    */
    function validateDate(foundErrors) {
        /* I will use a built-in Date class to compare the dates 
        Previously, I stored the form's input values ian a react state called formData
        I can caccess that here, and use the Date constructor
        the string is already stored in the format YYYY-MM-DD, so nothing special needs to be done
        EDIT: Changed to be a date string with the time included
        */
        const reserveDate = new Date(`${formData.reservation_date}T${formData.reservation_time}:00.000`);
        //const reserveDate = new Date(formData.reservation_date);
        //We will need to compare the reservation date to today's date.
        //an empty construtor defaults to today's date
        const todaysDate = new Date();

        //the Date class has many functions, one of which returns the date (0 is Sunday, so 2 is Tuesday)
        if (reserveDate.getDay() === 2) {
            //if it's Tuesday, push an error object to our foundErrors array
            foundErrors.push({message: "Reservations cannot be made on a Tuesday: restaurant is closed"})
        }
        /*  HOW DATES ARE COMPARED
            Every date is stored as a number that represents the number of milliseconds that have elapsed since Jan. 1, 19**
            so we know a date is in the past if there are less milliseconds in one date than the other
         */

        if (reserveDate < todaysDate) {
            foundErrors.push({ message: "Reservations cannot be made in the past."})
        }

        //If it is before 1030a, reservations cannot be made
        if (reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)) {
            foundErrors.push({ message: "Reservation can not be made: restaurant is not open until 10:30AM."})
        }

        //If it is after 10:30p
        else if (reserveDate.getHours() > 22 || (reserveDate.getHours === 22 && reserveDate.getMinutes() > 30)) {
            foundErrors.push({ message: "Reservation can not be made: restaurant is closed after 10:30PM."})
        }

        //if it is after 9:30p
        else if (reserveDate.getHours() > 21 || (reserveDate.getHours === 21 && reserveDate.getMinutes() > 30)) {
            foundErrors.push({ message: "Reservation can not be made: reservation must be at least an hour before closing (10:30PM)"})
        }

        //if any issues, the reservation date is not valid
        if (foundErrors.length > 0) {
            return false;
        }
        //If we get here, the reservation date is valid and handleSubmit will push the user forward
        return true;
    }

    const errorsJSX = () => {
        return errors.map((error, idx) => <ErrorAlert key={idx} error ={error}/>)
    }
    
    return (
        <form>
            {/*use the following as a template for your input fields */}
            {errorsJSX()}
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