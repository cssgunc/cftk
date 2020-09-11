import React, { useState } from 'react';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import SearchBar from  '../SearchBar';

const EditRoutePanel = () => {

    const [routeName, setRouteName] = useState('');
    const [currStreet, setCurrStreet] = useState('');
    const [streetNames, setStreetNames] = useState([]);
    const [canningDate, setCanningDate] = useState('');
    const [numDonated, setNumDonated] = useState('');
    const [currNote, setCurrNote] = useState('');
    const [volNotes, setVolNotes] = useState([]);

    const updateInput = (e, setter) => {
        setter(e.target.value);
        console.log(e.target.value);
    }

    const updateStreetList = e => {
        e.preventDefault();
        if (streetNames.includes(currStreet)) {
            alert ("Please don't repeat a street name");
            return;
        } else if (currStreet === '') {
            alert ("Please enter a street name");
            return;
        }
        setStreetNames([...streetNames, currStreet]);
        setCurrStreet('');
    }

    const updateNoteList = e => {
        e.preventDefault();
        if (volNotes.includes(currNote)) {
            alert ("Please don't repeat an existing note");
            return;
        } else if (currNote === '') {
            alert ("Please enter some text");
            return;
        }
        setVolNotes([...volNotes, currNote]);
        setCurrNote('');
    }

    const handleDateFocus = e => {
        // When clicking on input, switches input type to date. Allows for placeholder text
        e.currentTarget.type = 'date';
    }

    const handleDateBlur = e => {
        // Changes input back to text if it is empty so placeholder text can still be shown
        if (canningDate === '' || canningDate === 'mm/d//yy') {
            e.currentTarget.type = 'text';
        }
    }

    const saveForm = e => {
        // Executes when save button is clicked.
        // Alerts and doesn't save if required inputs are not filled (Placeholder)
        if (routeName === '') {
            alert('Please enter a route name');
            return;
        } else if (streetNames.length === 0 && currStreet  === '') {
            alert('Please enter/add a street name');
            return;
        }  

        console.log({
            name: routeName,
            streets: streetNames,
            date: canningDate,
            donations: numDonated,
            notes: volNotes,
            created: new Date()
        })
    }

    var street = "Hillsborough+Street"; // get from input box, dynamically update and re-render
    var houseNumber = "425"; // get from input box, dynamically update and re-render
    var source = getHouse(street, houseNumber);

    function getHouse(street, houseNumber) {
        var address = `${houseNumber}+${street}`;
        return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${address}`;
    }

return(
    <div>
        <h1 className="title"> Edit Route</h1>
        <div className="columns">
            <div className="column">
                <form>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="tecxt" placeholder="Name(Required)" value={routeName} onChange = {(e) => updateInput(e, setRouteName)} />
                        </div>
                    </div>
                    <h1>Street Name</h1>
                    <div className="field is-grouped">
                        <div className="control">
                            <input className="input" type="text" placeholder="Street Name (Required)" value={currStreet} onChange = {(e) => updateInput(e, setCurrStreet)}/>
                        </div>
                        <button className="button" onClick = {updateStreetList}>ADD</button>
                    </div>
                    <div>
                        {streetNames.map(street => (
                            <button class="button is-info is-rounded" key={street}>{street}</button>
                        ))}
                    </div>
                    <h1 class="subtitle"> Previous Canning Data</h1>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="text" placeholder="Date (Optional)" onFocus={handleDateFocus} onBlur={handleDateBlur} value={canningDate} onChange = {(e) => updateInput(e, setCanningDate)}/>
                        </div>
                        <label className="label">MM/DD/YY</label>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input className="input" type="number" placeholder="Donations (Optional)" value={numDonated} onChange = {(e) => updateInput(e, setNumDonated)} />
                        </div>
                    </div>
                    <h1> Volunteer notes</h1>
                    <div className="field is-grouped">
                        <div className="control">
                            <input className="input" type="text" placeholder="Note" value={currNote} onChange = {(e) => updateInput(e, setCurrNote)} />
                        </div>
                        <button class="button" onClick = {updateNoteList}>ADD</button>
                    </div>
                    <div>
                        {volNotes.map (note => (
                            <button class="button is-rounded" key={note}>{note}</button>
                        ))}
                    </div>
                </form>
            </div>
            <div className="column">
                <div>
                    <iframe title="viewHouse"
                        width="600"
                        height="450"
                        frameBorder="0" styles="border:0"
                        src={source}
                        allowFullScreen>
                    </iframe>
                </div>
            </div>
        </div>
            <div class="field is-grouped">
                <button class="button is-primary" onClick={saveForm}>SAVE</button>
                <button class="button is-link is-light">
                    <Link to={ROUTES.ADMIN_ROUTES}>CANCEL</Link>
                </button>
            </div>
        </div>
    );
};
export default EditRoutePanel;
