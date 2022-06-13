import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations } from './api';
import './nprogress.css';
import { OfflineAlert } from './Alert';

class App extends Component {

  state = {
    events: [],
    locations: [],
    locationSelected: 'all',
    numberOfEvents: 10,
    OfflineAlertText: ""
  }
  
  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) });
      }
    });
    if (!navigator.onLine) {
      this.setState({
        OfflineAlertText: 'You are not connected to the internet'
      });
    } else {
      this.setState({
        OfflineAlertText: ''
      });
    }
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  
  updateEvents = (location, eventCount) => {
    if (eventCount === undefined) {
        eventCount = this.state.numberOfEvents;
    } else(
        this.setState({ numberOfEvents: eventCount })
    )
    if (location === undefined) {
        location = this.state.locationSelected;
    }
    console.log(eventCount, location)
    getEvents().then((events) => {
      let locationEvents = location === "all" ? events : events.filter((event) => event.location === location);
      this.setState({
          events: locationEvents.slice(0, eventCount),
          numberOfEvents: eventCount,
          locationSelected: location,
      });
    });
  }
  render() {
    return (
      <div className="App">
        <OfflineAlert text={this.state.OfflineAlertText} />
        <h1>Meet App</h1>
        <h4>Choose your nearest city</h4>
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <NumberOfEvents updateEvents={this.updateEvents} />
        <EventList events={this.state.events} />
      </div>
    );
  }
}

export default App;