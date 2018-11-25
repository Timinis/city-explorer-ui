import React, { Component } from 'react';
import superagent from 'superagent';
import style from './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      city: '',
      screenSwitched: 'default',
      initialResult: {},
      stateConfirmation: [],
      weather: [],
      movies: [],
      yelp: [],
      meetups: [],
      trails: [],
      googleLink: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log(state);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  screenSwitch = event => {
    event.preventDefault();
    this.setState({ screenSwitched: 'city' });
    document.getElementById('submit-form').value = '';
    console.log(this.state.screenSwitched);
  };
  //https://city-explorer-backend.herokuapp.com/weather?data%5Bid%5D=2&data%5Bsearch_query%5D=Seattle&data%5Bformatted_query%5D=Seattle%2C%20WA%2C%20USA&data%5Blatitude%5D=47.606210&data%5Blongitude%5D=-122.332071&data%5Bcreated_at%5D=
  //https://city-explorer-backend.herokuapp.com/weather?data%5Bid%5D=43&data%5Bsearch_query%5D=Paris&data%5Bformatted_query%5D=Paris%2C%20France&data%5Blatitude%5D=48.856614&data%5Blongitude%5D=2.352222&data%5Bcreated_at%5D=
  getResource = resource => {
    if (this.state.stateConfirmation.length === 2) {
      superagent
        .get(
          `${this.state.url}/${resource}?data%5Bid%5D=${
            this.state.initialResult.id
          }&data%5Bsearch_query%5D=${
            this.state.initialResult.search_query
          }&data%5Bformatted_query%5D=${this.state.stateConfirmation[0]}%2C%20${
            this.state.stateConfirmation[1]
          }&data%5Blatitude%5D=${
            this.state.initialResult.latitude
          }&data%5Blongitude%5D=${
            this.state.initialResult.longitude
          }&data%5Bcreated_at%5D=`
        )
        .then(result => {
          this.setState({ [resource]: result.body });
          console.log(this.state[resource]);
        })
        .catch(console.error);
    } else if (this.state.stateConfirmation.length === 3) {
      superagent
        .get(
          `${this.state.url}/${resource}?data%5Bid%5D=${
            this.state.initialResult.id
          }&data%5Bsearch_query%5D=${
            this.state.initialResult.search_query
          }&data%5Bformatted_query%5D=${this.state.stateConfirmation[0]}%2C%20${
            this.state.stateConfirmation[1]
          }%2C%20${this.state.stateConfirmation[2]}&data%5Blatitude%5D=${
            this.state.initialResult.latitude
          }&data%5Blongitude%5D=${
            this.state.initialResult.longitude
          }&data%5Bcreated_at%5D=`
        )
        .then(result => {
          this.setState({ [resource]: result.body });
          console.log(this.state[resource]);
        })
        .catch(console.error);
    }
  };
  urlFetch = event => {
    event.preventDefault();
    superagent('get', `${this.state.url}/location?data=${this.state.city}`)
      .then(results => {
        this.setState({ initialResult: results.body });
        console.log(this.state);
        this.setState({
          stateConfirmation: this.state.initialResult.formatted_query.split(
            `, `
          )
        });
        this.setState({
          googleLink: `https://maps.googleapis.com/maps/api/staticmap?center=${
            this.state.initialResult.latitude
          }%2c%20${
            this.state.initialResult.longitude
          }&zoom=13&size=600x300&maptype=roadmap
  &key=AIzaSyAmSTIw4Djm-CERTOKtJ7hoIdoB0cko-Ns`
        });
      })
      .then(results => {
        this.getResource('weather');
        this.getResource('movies');
        this.getResource('yelp');
        this.getResource('meetups');
        this.getResource('trails');
        this.setState({ screenSwitched: 'result' });
        document.getElementById('submit-form').value = '';
      })
      .catch(console.error);
  };

  render() {
    if (this.state.screenSwitched === 'default') {
      return (
        <React.Fragment>
          <h1>City Explorer</h1>
          <p>
            Enter a location below to learn about the weather, events,
            restaurants, movies filmed there, and more!
            <br />
            Enter the URL to your deployed back end, making sure to remove the
            trailing forward slash
          </p>
          <form onSubmit={this.screenSwitch}>
            <input name="url" onChange={this.handleChange} id="submit-form" />
            <button>GO!</button>
          </form>
        </React.Fragment>
      );
    }
    if (this.state.screenSwitched === 'city') {
      return (
        <React.Fragment>
          <h1>City Explorer</h1>
          <p>
            Enter a location below to learn about the weather, events,
            restaurants, movies filmed there, and more!
            <br />
            Search for a location
          </p>
          <form onSubmit={this.urlFetch}>
            <input name="city" onChange={this.handleChange} id="submit-form" />
            <button>Explore</button>
          </form>
        </React.Fragment>
      );
    }
    if (this.state.screenSwitched === 'result') {
      return (
        <React.Fragment>
          <h1>City Explorer</h1>
          <p>
            Enter a location below to learn about the weather, events,
            restaurants, movies filmed there, and more!
            <br />
            Search for a location
          </p>
          <form onSubmit={this.urlFetch}>
            <input name="city" onChange={this.handleChange} id="submit-form" />
            <button>Explore</button>
          </form>

          <img
            src={this.state.googleLink}
            alt="Google Map display of Search Query"
          />

          <h2>
            Here are the results for {this.state.initialResult.formatted_query}
          </h2>
          <article>
            <section id="weather">
              <h3>Results from the Dark Sky API</h3>

              {this.state.weather.map((record, index) => {
                return (
                  <div key={index}>
                    The forecast for {record.time} is: {record.forecast}
                  </div>
                );
              })}
            </section>
            <section id="yelp">
              <h3>Results from the Yelp API</h3>

              {this.state.yelp.map((record, index) => {
                return (
                  <div key={index}>
                    <a href={record.url}>{record.name}</a>
                    <p>
                      The average rating is {record.rating} out of 5 and the
                      average cost is {record.price} out of 4
                    </p>
                    <img src={record.image_url} alt="resturaunt menu" />
                  </div>
                );
              })}
            </section>
            <section id="meetups">
              <h3>Results from the Meetup API</h3>

              {this.state.meetups.map((record, index) => {
                return (
                  <div key={index}>
                    <a href={record.link}>{record.name}</a>
                    <p>
                      Hosted by: {record.host}
                      <br />
                      Created on: {record.creation_date}
                    </p>
                  </div>
                );
              })}
            </section>
            <section id="movies">
              <h3>Results from The Movie DB API</h3>

              {this.state.movies.map((record, index) => {
                return (
                  <div key={index}>
                    <p>
                      {record.title} was released on {record.released_on}. Out
                      of {record.total_votes} total votes, {record.titles} has
                      an average vote of {record.average_votes} and a popularity
                      score of (record.popularity).)
                    </p>
                    <img src={record.image_url} alt="description of img" />
                  </div>
                );
              })}
            </section>
            <section id="trails">
              <h3>Results from the Hiking Project API</h3>
              {this.state.trails.map((record, index) => {
                return (
                  <div key={index}>
                    <p>
                      Hike Name: <a href={record.trail_url}>{record.name}</a>,
                      Location: {record.location}, Distance: {record.length}{' '}
                      miles <br />
                      On {record.condition_date} at {record.condition_time} ,
                      trail conditions were reported as: {record.conditions}{' '}
                      <br />
                      This trail has a rating of {record.stars} stars (out of{' '}
                      {record.star_votes} votes) <br />
                      {record.summary}
                    </p>
                  </div>
                );
              })}
            </section>
          </article>
        </React.Fragment>
      );
    }
  }
}

export default App;
