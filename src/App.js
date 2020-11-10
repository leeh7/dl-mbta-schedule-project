import React, { Component } from 'react';
import { OutputTable } from './components/OutputTable/OutputTable.js';
import Clock from './components/Clock/Clock.js';
import CurrentDate from './components/CurrentDate/CurrentDate';
import StationPicker from './components/StationPicker/StationPicker.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const DESTINATION_OPTIONS = [
	{ value: 'place-north', label: 'North Station' },
	{ value: 'place-sstat', label: 'South Station' }
];

export class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
       selectedStationValue: DESTINATION_OPTIONS[0].value,
       selectedStationName: DESTINATION_OPTIONS[0].label,
       destinationOptions: DESTINATION_OPTIONS
    };
  }

  // callback function to be passed into StationPicker component to enable dropdown selection of station to view 
  // (update page with selection and api call for table data)
  handleStationValueChange = ({newStationValue, newStationName}) => {
    this.setState({
      selectedStationValue: newStationValue,
      selectedStationName: newStationName
    })
  }

  render() {
    const {selectedStationValue, selectedStationName, destinationOptions} = this.state;
    return (
      <div className="App">
        <h2>UPCOMING MBTA COMMUTER RAIL DEPARTURES from {selectedStationName} </h2>
        <CurrentDate />
        <Clock />
        <StationPicker destinationOptions = {destinationOptions} handleStationValueChange = {this.handleStationValueChange}/>
        <OutputTable selectedStation = {selectedStationValue} selectedStationName = {selectedStationName}/>
        <footer>
            <p>Note: Table data refreshes approximately every minute</p>
        </footer>
      </div>
    )
  }
}

export default App;
