import React, { Component } from 'react';

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
export class CurrentDate extends Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }
    
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
  
    tick() {
        this.setState({
            date: new Date()
        });
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }
  
    render() {
        return (
            <div>
                <h2>Today is {this.state.date.toLocaleDateString("en-US", options)}.</h2>
            </div>
        );
    }
}

export default CurrentDate;

