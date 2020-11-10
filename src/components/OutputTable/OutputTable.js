import Axios from 'axios';
import React, { Component } from 'react';
import get from 'lodash/get';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const BASE_API_URL = process.env.REACT_APP_API_URL;
const ROUTE_TYPE = 2; //commuter rail
const TABLE_HEADERS = [
  'Time', 'Destination', 'Train #', 'Track #', 'Status'
];

export class OutputTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      departureData: [],
      errorMessage: null
    };
  }

  getDepartures = (selectedStationValue) => {
    const calledAPIURL = this.getAPIURL(selectedStationValue);
    Axios.get(calledAPIURL)
      .then(( response ) => {
        if(response.status === 200 && response.data) {
          this.setState({ errorMessage: null });
          this.processResponse(response.data);
        }
      })
      .catch((error )=> {
        console.log(error);
        this.setState({ errorMessage: error });
      })
  }

  processResponse = ( response ) => {
    const predictedTrainData = response.data;
    const included = response.included;
    const isValidData = predictedTrainData && included;
    
    if(isValidData) {
      const outputDepartureData = [];

      //filtering out departures on last stop and already departed trains
      const runningDepartures = predictedTrainData.filter(d => d.attributes.status !== 'Departed' && d.attributes.departureTime !== null);
      // gathering data from included/related data for associated trips/stops/schedule
      const stopData = included.filter(d => d.type === 'stop');
      const tripData = included.filter(d => d.type === 'trip');
      const scheduleData = included.filter(d => d.type === 'schedule');
      // iterate through running trips to collect data

      runningDepartures.forEach(rd => {
        const status = get(rd, 'attributes.status');
        const routeName = get(rd, 'relationships.route.data.id');

        // Get track/platform code/number via stop info/id
        const stopID = get(rd, 'relationships.stop.data.id');
        const stopInfo = stopData.find(s => s.id === stopID);
        const trackNumber = get(stopInfo, 'attributes.platform_code');

        // Get Vehicle # via trip info/id
        const tripID = get(rd, 'relationships.trip.data.id');
        const tripInfo = tripData.find(t => t.id === tripID);
        const tripDestination = get(tripInfo, 'attributes.headsign');
        const vehicleIdentifier = get(tripInfo, 'attributes.name');

        // Get Departure Time of train via schedule/scheduleID'
        const scheduleID = get(rd, 'relationships.schedule.data.id');
        const scheduleInfo = scheduleData.find(sch => sch.id === scheduleID);
        const departureTime = get(scheduleInfo, 'attributes.departure_time');
       
        // compile information to add to result array 
        // filtered out train data with destination of south/north station 
        if(tripDestination !== this.props.selectedStationName)
        {
          outputDepartureData.push({
            departureTime,
            routeName,
            tripDestination,
            vehicleIdentifier, 
            trackNumber: (trackNumber !== null ? trackNumber : 'TBD'),
            status,
          });
          outputDepartureData.sort((a,b) => new Date(a.departureTime) - new Date(b.departureTime));
          this.setState({ departureData: outputDepartureData});
        }
      });
    }
  }

  setTimer = () => {
    const { selectedStation } = this.props;

    // fetch new departure data every minute
    this.intervalID = setInterval(
      () => this.getDepartures(selectedStation),
      60000
    );
  }

  componentDidMount = () => {
    const { selectedStation } = this.props;
    this.getDepartures(selectedStation);
    this.setTimer();
  }

  componentDidUpdate = (previousProps) => {
    const { selectedStation } = this.props;

    if(previousProps.selectedStation !== selectedStation) {
     
      this.setState({departureData: []});
      this.getDepartures(selectedStation);
      clearInterval(this.intervalID);
      this.setTimer();
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  }

  getAPIURL = (selectedStation) =>{
    const filters = `filter[stop]=${selectedStation}&filter[route_type]=${ROUTE_TYPE}`;
    const includes = ['stop','trip','schedule'] ;

    return `${BASE_API_URL}predictions?${filters}&[direction_id]=1&include=${includes.join()}`;
  }

  render() {
    const {departureData} = this.state;
    if(!departureData ){
      return (
        <p className="loading">No Current Departure Information...</p>
      );
    }
    else {
      return (
        <Table striped responsive bordered className='row w-100 d-inline  justify-content-center' >
          <thead class="thead-dark">
            <tr>
              {TABLE_HEADERS.map(th => (
                <th key={th}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departureData && departureData.map((d, index) => (
            <tr key={index}>
              <td>{new Intl.DateTimeFormat(
                "en-US", 
                { 
                  hour: "2-digit", 
                  minute: "2-digit"
                }
                ).format(new Date(d.departureTime))}</td>
              <td>{d.tripDestination}</td>
              <td>{d.vehicleIdentifier}</td>
              <td>{d.trackNumber}</td>
              <td>{d.status}</td>
            </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  }
}



export default OutputTable;