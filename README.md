# MeetUp
## Overview
Meet app is React app coded using a test-driven development process. The app uses the Google Calendar API to fetch upcoming events from a a CareerFoundry events calendar.  

To connect to the api, the app makes use of Amazon Web Service's Lambda service to perform authentication. Because this app is in test mode, a new user must have their gmail account added to my test users lists from my Google Console. If you would like to have access to the app, please reach out to me so I can grant you access. The new user will be redirected to the Google Oauth authentication screen where they must confirm that they want to give permissions to the Google Calendar API. One permission is granted, the user is redirected to the application.

The app is a single page app with two inputs, one for a city name, and one for a number of events to show. Simply input your desired city and select it from the suggestions dropdown, then narrow down or increase the number of events shown with using the number input. Clicking on the "more details" button for an event will display a description and URL for the event.

## AWS Lambda functions
The code for the AWS Lambda functions is stored in the auth-server folder. The serverless.yml contains some minimal configuration for the functions, which are contained in the handler.js file. This project makes use of three functions with AWS Lambda:
- `getAuthURL`
- `getAccessToken`
- `getCalendarEvents`

### getAuthURL (Step 1)
`https://hv2altwv0j.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url`  
`getAuthURL` generates a Url for oAuth2 authentication with Google which includes a code to be used with the getAccessToken function.

### getAccessToken (Step 2)
`https://hv2altwv0j.execute-api.us-east-1.amazonaws.com/dev/api/token/{code}`  
`getAccessToken` is called using the code from getAuthURL in place of "{code}" in the URL. The function returns an access token which may be used to gain access to the Google Calendar API.

### getCalendarEvents (Step 3)
`https://hv2altwv0j.execute-api.us-east-1.amazonaws.com/dev/api/get-calendar-events/{accessToken}`
`getCalendarEvents` is called using the access token obtained from getAccessToken in place of "{accessToken}". A sucessful response will include a JSON object containing a list of event objects from the CareerFoundry events calendar. These events are then filtered and trimmed within the main part of meet app.

### Bringing Google Calendar API data into the meet app
the `api.js` contains functions used to call the AWS Lambda functions and send the events data to the app. A call to `getEvents()` will begin by checking to see if the user already has a valid access token. if so, `getCalendarEvents` is called (Step 3) and the events are sent to the app. If there is no valid access token, the app checks to see if there is a code saved. If so, we can start from Step 2. If there is no access token or code, the user is redirected to the Google oAuth screen (Step 1).  

Regardless of which step the `getEvents()` begins from, eventually a list of event objects and a list of locations (extracted from the event objects) is sent back to the app from the `api.js` file.

## User interface
The `<App>` element calls `getEvents()` from with its `componentDidMount()` method. The events and locations returned by the function call are stored in the state. The `<App>` has the child components `<CitySearch>`, `<NumberOfEvents>`, and `<EventList>`. City queries are made from the `<CitySearch>` element. The displayed number of events is changed from the `<NumberOfEvents>` element. The events stored in the apps's state are sent to `<EventList>` to be rendered.

The user interface is made responsive using CSS grid with media queries altering the width of the event cards and number of columns based on the screen size.

## Testing
### Unit Testing and Integration Testing
Unit testing and integration testing are performed using Jest. Test files are contained in the __tests__ subdirectory. 
### Acceptance testing
Acceptance test is performed using [Jest-Cucumber](https://www.npmjs.com/package/jest-cucumber). Jest-Cucumber was selected over the standard Cucumber because it allows for writing tests using similar syntax to our unit testing and integration testing with Jest. Test and feature files are contained in the 'features' subdirectory.

### End-to-end testing
End-to-end testing for Feature 2: Show/hide an event's details was performed using [Puppeteer](https://github.com/puppeteer/puppeteer#usage).

## User Stories and Requirements
### FEATURE 1: FILTER EVENTS BY CITY
**User Story**: As a user, I should be able to filter the events by city so that I can see the list of events that take place near that city.  

**Scenario 1**: Given the user hasn’t searched for any city, when the user opens the app, then the user should see a list of all upcoming events. 

**Scenario 2**: Given the main page is open, when the user starts typing in the city textbox, then the user should see a list of cities (suggestions) that match what they’ve typed.  

**Scenario 3**: Given the user was typing “Berlin” in the city textbox, and the list of suggested cities is showing, when the user selects a city (eg., “Berlin, Germany”) from the list, then their city should be changed to that city (i.e., “Berlin, Germany”), and the user should receive a list of upcoming events in that city.  

### FEATURE 2: SHOW/HIDE AN EVENT’S DETAILS
User Story: As a user, I should be able to hide or show event details so that I can see more or less about an event.  

**Scenario 1**: Given that the main page is open, when the user has not clicked on an event, each event element should be collapsed.  

**Scenario 2**: Given that an event element is collapsed, when the user clicks on an event, the event element should expand.  

**Scenario 3**: Given that an event element is expanded, when the user clicks on an event, the event element should collapse.  

### FEATURE 3: SPECIFY NUMBER OF EVENTS
**User Story**: As a user, I should be able to specify the number of events so that I can see a specific number of events.

**Scenario 1**: Given that the user has not specified a number of events to show, when the user loads the data, 32 events should be displayed.

**Scenario 2**: Given the main page is open, when the user types a number into the number of events textbox, the number of events displayed should match the number input by the user, unless there are fewer events than the specified number.

### FEATURE 4: USE THE APP WHEN OFFLINE
**User Story**: As a user, I should be able to use the app while offline so that I can see the events I was viewing the last time I was connected to the internet.

**Scenario 1**: Given that there is no internet connection and the user has cached data, when the user loads the application, the user should see the events they saw the last time they were connected to the internet.

**Scenario 2**: Given that there is no internet connection, when the user changes the settings (city, time range), the user should see an error message warning them that their search cannot be performed because they are offline.

### FEATURE 5: DATA VISUALIZATION
**User Story**: As a user, I should be able to see a chart showing the number and type of upcoming events in each city so that I can see what types of events are happening in each city.

**Scenario 1**: Given that the main page is open, when the user wants to see the upcoming events by city, the user should see a pie chart displaying the types of events and a bar chart displaying the number of events in each city.