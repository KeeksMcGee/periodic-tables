import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {
    const history = useHistory();

    const [error, setError] = useState([]);
    const [formData, setFormData] = useState({
        //initial default data
        table_name: "",
        capacity: 1,
    });

    function handleChange({ target }) {
        setFormData({ ...formData, [target.name]: target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (validateFields()) {
            history.push(`/dashboard`);
        }
    }

    function validateFields() {
        let foundError = null;

        if (formData.table_name === "" || formData.capacity === "") {
            foundError = { message: "Please fill out all fields" };
        } else if (formData.table_name.length < 2) {
            foundError = {message: "Table name must be at least two characters."}
        }

        setError(foundError);

        return foundError.length !== null;
    }

    return (
        <form>
           <ErrorAlert error={error} />

            <label className="form-label" htmlFor="table_name">Table Name:</label>
            <input
                className="form-control"
                name="table_name"
                id="table_name"
                type="text"
                minLength="2"
                onChange={handleChange}
                value={formData.table_name}
                required
            />

            <label className="form-label" htmlFor="capacity">Capacity:</label>
            <input
                className="form-control"
                name="capacity"
                id="capacity"
                type="number"
                min="1"
                onChange={handleChange}
                value={formData.capacity}
                required
            />
            <br/>
            <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Submit</button>
            <button className="btn btn-danger" type="button" onClick={history.goBack}>Cancel</button>
            
        </form>
    )


}