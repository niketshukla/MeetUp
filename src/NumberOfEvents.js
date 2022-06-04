import React, { Component } from 'react';

class NumberOfEvents extends Component {


  render() {
    return (
      <div className="numberOfEvents">
        <label>Number of Events: </label>
        <input 
          className="number-of-events"
          type="number"
          value={this.props.numberOfEvents}>
        </input>
      </div>
    );
  }
}

export default NumberOfEvents;