import React, { Component } from 'react';

export class Clock extends Component {
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
                <h2>Current Time: {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

export default Clock;

