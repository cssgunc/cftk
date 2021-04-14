// import { AddCircle } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import houseDefault from "../../../assets/images/MapIcons/houseDefault.svg";
import houseDefaultSelected from "../../../assets/images/MapIcons/houseDefaultSelected.svg";


// based on https://developers.google.com/maps/documentation/javascript/adding-a-google-map

function useFlatAddress(addresses) {
  // Custom hook that splits the addresses object into 3 lists, the new ones that were added, the ones that were removed, and the currently existing ones
  const [markerCoords, setMarkerCoords] = useState([]);
  const asString = JSON.stringify(addresses);

  useEffect(() => {
    let temp = [];
    for (let street in addresses) {
      for (let address in addresses[street]) {
        temp.push(addresses[street][address]);
      }
    }

    setMarkerCoords(temp);

  }, [asString, addresses]);

  return markerCoords
}
// To look at in the future, use snap to roads api to convert addresses to a road, but API key seems to be rejected
// function useSnappedRoads(addresses) {

//   const [roads, setRoads] = useState({});

//   useEffect(() => {
//     let snapPromises = []
//     for (let street in addresses) {
//       if (!roads[street] || Object.keys(addresses[street]) != Object.keys(roads[street])) {
//         let streetCoords = []
//         for (let address in addresses[street]) {
//           streetCoords.push(`${addresses[street][address].lat},${addresses[street][address].lng}`)
//         }
//         snapPromises.push(fetch('https://roads.googleapis.com/v1/snapToRoads', {
//           interpolate: true,
//           key: process.env.REACT_APP_MAPS_API_KEY,
//           path: streetCoords.join('|')
//         }))
//       }
//     }
//     Promise.all(snapPromises).then(res => console.log(res))
//   }, [JSON.stringify(addresses)])
// }

function Map(props) {
  const defaultLoc = { lat: 35.9132, lng: -79.0558 }
  const { ref, map, google } = useGoogleMaps(
    process.env.REACT_APP_MAPS_API_KEY,
    {
      zoom: 18,
      center: defaultLoc
    },
  );
  const coords = useFlatAddress(props.addresses);
  // const roads = useSnappedRoads(props.addresses);
  function createMarkerListeners(marker) {
    const markerIn = marker.addListener('mouseover', function() {
      // Action on the way in
      marker.setIcon(houseDefaultSelected)
    });
    const markerOut = marker.addListener('mouseout', function() {
      // Reset on the way out
      marker.setIcon(houseDefault)
    });
    const markerClick = marker.addListener('click', function() {
      // Action on click
      console.log('click');
    })
    return [markerIn, markerOut, markerClick]
  }

  useEffect(() => {

    // Exit if the map or google objects are not yet ready
    if (!map || !google || coords.length === 0) return;

    map.panTo(coords[0]);

    let tempMarkers = []
    for (let address of coords) {
      const marker = new google.maps.Marker({
        map: map,
        position: address,
        icon: houseDefault
      });
      createMarkerListeners(marker);
      tempMarkers.push(marker);
    }

    return function cleanup() {
      for (let marker of tempMarkers) {
        marker.setMap(null);
        google.maps.event.clearInstanceListeners(marker);
        marker = null;
      }
    }

  }, [coords, map, google]);

  return (
    <div>
      <div ref={ref} style={{ width: props.width, height: props.height }} />
    </div>
  );
}

export default Map;