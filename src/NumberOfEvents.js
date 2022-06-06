import React, { Component } from 'react';

class NumberOfEvents extends Component {
  state = { 
    numberOfEvents : 10
  }

  changeNumOfEvents = (e) => {
    let newValue = parseInt(e.target.value);
        this.setState({
          numberOfEvents: newValue
        });
        this.props.updateEvents(undefined, newValue);
  }

  render() {
    return (
      <div className="numberOfEvents">
        <label>Number of Events: </label>
        <input className="number-of-events" type="number" onChange={this.changeNumOfEvents} value={this.state.numberOfEvents} />
      </div>
    );
  }
}

export default NumberOfEvents;