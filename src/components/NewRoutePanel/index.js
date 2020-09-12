import React, { useState } from 'react';

const NewRoutePanel = () => {

  // TODO 1: Implement donation, route, and house metrics
  // TODO 2: Implement revision history and modified by
  // TODO 3: Deal with google map implementation
  // TODO 4: Deal with donation amount not necessarily being a number value
  // TODO 5: Figure out required functionality


  // variables used in the state
  const [routeName, setRouteName] = useState('');
  const [currStreet, setCurrStreet] = useState('');
  const [streetNames, setStreetNames] = useState([]);
  const [canningDate, setCanningDate] = useState('');
  const [numDonated, setNumDonated] = useState('');
  const [currNote, setCurrNote] = useState('');
  const [volNotes, setVolNotes] = useState([]);


  const defaultQuery = 'University+of+North+Carolina+Chapel+Hill';
  const defaultOrigin = 'University+of+North+Carolina+Chapel+Hill';
  const [mapURL, setMapURL] = useState(parseQuery(defaultQuery));




  function updateInput(e, setter) {
    // Executes the passed in setter, allows for additional functionality afterwards as well
    setter(e.target.value)
    console.log(e.target.value)
  }

  function addToStreetList(e) {
    // Adds street to list as long as street not already included or input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (streetNames.includes(currStreet)) {
      alert("Please don't repeat a street name");
      return;
    } else if (currStreet === '') {
      alert("Please enter a street name");
      return;
    }

    setStreetNames([...streetNames, currStreet]);
    setCurrStreet('');
    mapRoute([...streetNames, currStreet]);
  }

  function removeFromStreetList(e, toRemove) {
    e.preventDefault();
    let newStreets = streetNames.filter(name => name !== toRemove);
    setStreetNames(newStreets);
    if (newStreets.length > 0) {
      mapRoute(newStreets);
    } else {
      setMapURL(parseQuery(defaultQuery))
    }
  }

  function addToNoteList(e) {
    // Adds note to list as long as the note is not already included or the input is not empty
    // preventDefault() prevents the page from reloading whenever a button is pressed
    e.preventDefault()
    if (volNotes.includes(currNote)) {
      alert("Please don't repeat a existing note");
      return;
    } else if (currNote === '') {
      alert("Please enter some text");
      return;
    }

    setVolNotes([...volNotes, currNote]);
    setCurrNote('');
  }

  function removeFromNoteList(e, toRemove) {
    e.preventDefault();
    setVolNotes(volNotes.filter(note => note !== toRemove));
  }

  function handleDateFocus(e) {
    // When clicking on input, switches input type to date. Allows for placeholder text
    e.currentTarget.type = 'date';
  }

  function handleDateBlur(e) {
    // Changes input back to text if it is empty so placeholder text can still be shown
    if (canningDate === '' || canningDate === 'mm/dd/yy') e.currentTarget.type = 'text';
  }

  function saveForm() {
    // Executes when save button is clicked.
    // Alerts and doesn't save if required inputs are not filled (Placeholder)
    if (routeName === '') {
      alert('Please enter a route name');
      return;
    } else if (streetNames.length === 0 && currStreet === '') {
      alert('Please enter/add a street name');
      return;
    }

    // Currently only logs form information to console
    console.log({
      name: routeName,
      streets: streetNames,
      date: canningDate,
      donations: numDonated,
      notes: volNotes,
      created: new Date().toString()
    })
  }




  function searchMap(e) {
    // generates and sets a new map url for map
    if (e.target.value.length > 0) {
      let query = parseQuery(e.target.value)
      setMapURL(query);
    } else if (streetNames.length > 0) {
      mapRoute(streetNames);
    } else {
      setMapURL(parseQuery(defaultQuery))
    }
  }

  function parseQuery(query) {
    query.replace(' ', '+');
    return `https://www.google.com/maps/embed/v1/search?key=${process.env.REACT_APP_MAPS_API_KEY}&q=${query}`;
  }

  function mapRoute(streets) {
    let waypoints = '';
    streets.forEach(street => {
      waypoints += `${street.replace(' ', '+')}|`
    })
    setMapURL(`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_MAPS_API_KEY}
    &origin=${defaultOrigin}
    &destination=${defaultOrigin}
    &waypoints=${waypoints.substring(0, waypoints.length - 1)}`);
  }





  return (
    <div>
      <h1 className="title">New Route</h1>
      <div className="columns">
        <div className="column">
          <form>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Name (Required)" value={routeName} onChange={(e) => updateInput(e, setRouteName)} />
              </div>
            </div>
            <h1>Street Name</h1>
            <div>
              {/* List to render street names, starts empty */}
              {streetNames.map(street => (
                // Holds street names in buttons, temporarily in buttons. Will figure out details later
                <button className="button" key={street} onClick={(e) => removeFromStreetList(e, street)}>{street}</button>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                <input className="input" type="text" placeholder="Street Name (Required)" value={currStreet} onChange={(e) => { updateInput(e, setCurrStreet); searchMap(e) }} />
              </div>
              {/* Pushes current street to list, then clears input */}
              <button className="button" onClick={addToStreetList}>Add</button>
            </div>
            <h1>Last Canning Data</h1>
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Date (optional)" onFocus={handleDateFocus} onBlur={handleDateBlur} value={canningDate} onChange={(e) => updateInput(e, setCanningDate)} />
              </div>
              <label className="label">MM/DD/YY</label>
            </div>
            <div className="field">
              <div className="control">
                <input className="input" type="number" placeholder="Donations (optional)" value={numDonated} onChange={(e) => updateInput(e, setNumDonated)} />
              </div>
            </div>
            <h1>Volunteer Notes</h1>
            <div>
              {/* List to render volunteer notes, starts empty */}
              {volNotes.map(note => (
                // Holds street names in buttons, onClick functionality to be dealt with later
                <button className="button" key={note} onClick={(e) => removeFromNoteList(e, note)}>{note}</button>
              ))}
            </div>
            <div className="field is-grouped">
              <div className="control">
                {/* Pushes current note to list, then clears input */}
                <input className="input" type="text" placeholder="Note" value={currNote} onChange={(e) => updateInput(e, setCurrNote)} />
              </div>
              <button className="button" onClick={addToNoteList}>Add</button>
            </div>
          </form>
        </div>
        <div className="column">
          {/* Placeholder google map */}
          <div>
            <iframe title="viewRoute"
              width="600"
              height="450"
              frameBorder="0" styles="border:0"
              src={mapURL}
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
      {/* Figuring out submit button, might put into form */}
      <input className="button" type="submit" onClick={saveForm} value="Save"></input>
    </div>

  );
};

export default NewRoutePanel;
