import React, { Component } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.css';


//	using CSS in JS to style dropdown to be smaller and centered
const customStyles = {
	container: (provided) => ({
    ...provided,
		width: '25%',
		display: 'inline-block',
		'text-align': 'center',
		'margin-bottom': '2em'
	}),
	menu: (provided) => ({
    ...provided,
		width: '92%',
  }),
  option: (provided) => ({
    ...provided,
		display: 'inline-block',
		'text-align': 'center'
  }),
  control: (provided) => ({
    ...provided,
		marginTop: "5%",
		'text-align': 'center'
	}),
	singleValue: (provided) => ({
    ...provided,
    display: 'inline-block',
		'text-align': 'center'
	}),isSelected: (provided) => ({
    ...provided,
    display: 'inline-block',
		'text-align': 'center'
	}),
}

export class StationPicker extends Component {

	// handle function to call callback function from App.js to change selected station from parent state 
	// (lifting state from child to parent component)
	
	handleStationSelect = (e) => {
		const value = e.value;
		const label= e.label;

		this.props.handleStationValueChange({'newStationValue': value, 'newStationName': label});
	}

	render(){
		return (
			<div>
				<h3>Select Destination Station below:</h3>
				<Select options={this.props.destinationOptions} 
								styles={customStyles} className="justify-content-center mt-4 col-md-8 col-offset-4 row-offset-4" 
								defaultValue = {this.props.destinationOptions[0]} 
								onChange={this.handleStationSelect} 
				/>
			</div>
		)
	}	
}

export default StationPicker;