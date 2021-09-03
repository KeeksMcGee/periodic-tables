import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//FIRST STEPS:
/*
1. Import React
2. Create component function and export it
3. Create a return statement
*/

export default function NewReservation() {
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

    const history = useHistory();
    /* USE HISTORY:
    * history.go(-1) OR history.goBack() = to go back a page
    */

    function handleChange({ target }) { //deconstruct the event argument
        //Will be using the useState hook to store whatever changes are made
        //this is why I use underscore, so when the target is accessed we get the input name in underscore
        setFormData({ ...formData, [target.name]: target.value });
        //use the spread operator '...' so all previous values do not get overwritten
    }
    
    return (
        <form>
            {/*use the following as a template for your input fields */}
            <label htmlFor="first_name">First Name:&nbsp;</label>
            {/*&nbsp; is a fancy way for HTML t place a space. It stands for 'non-breakable space */}
            <input
                name="first_name"
                id="first_name"
                type="text"
                onChange={handleChange} //onChange will automatically pass the 'event argument based off of which input was clicked
                //I can now use useState hook to store the values of each input now
                value={formData.first_name}
                required
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={history.goBack}>Cancel</button>
        </form>
    );
}