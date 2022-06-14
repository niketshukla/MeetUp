import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import './nprogress.css';
import { OfflineAlert } from './Alert';
import WelcomeScreen from './WelcomeScreen';

class App extends Component {

  state = {
    events: [],
    locations: [],
    locationSelected: 'all',
    numberOfEvents: 10,
    OfflineAlertText: "",
    showWelcomeScreen: undefined
  }
  
  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({
      showWelcomeScreen: !(code || isTokenValid)
    });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events,
            locations: extractLocations(events)
          });
        }
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
    if (this.state.showWelcomeScreen === undefined) return <div className="App" />
    return (
      <div className="App">
        <OfflineAlert text={this.state.OfflineAlertText} />
        <h1>Meet App</h1>
        <h4>Choose your nearest city</h4>
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <NumberOfEvents updateEvents={this.updateEvents} />
        <EventList events={this.state.events} />
        <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen} getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;