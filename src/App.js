import React, { Component } from 'react';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

import { NavLayout } from "./components";
import { Overview, Settings, Sewing, Login } from './containers';
import { EventSourceContext, LoggedInUserContext } from './context';
import { MemoryRouter as Router, Switch, Route } from "react-router-dom";
import { isUserLoggedIn } from './utils/utils';

library.add([faCog, faChartPie, faChartLine])
dom.watch()

const APP_URL = process.env.REACT_APP_SERVER_URL

class App extends Component {
  constructor(props){
    super(props)
    this.eventSource = new EventSource(`${APP_URL}/sse/event/`)
  
    this.setUserLogInState = (loggedIn) => {
      this.setState({
        loggedIn: loggedIn,
      })
    }
  
    const userLoggedIn = isUserLoggedIn()
    this.state = {
      loggedIn: userLoggedIn,
      setUserLogInState: this.setUserLogInState,
    }
  }
  
  componentWillUnmount() {
    this.eventSource.close()
  }

  render() {
    return (
      <LoggedInUserContext.Provider value={this.state}>
        <Router>
          <Switch>
            <Route exact path="/login"><Login /></Route>
            <Route path="">
              <EventSourceContext.Provider value={this.eventSource}>
                <NavLayout pages={[
                  {
                    'content': <Overview/>,
                    'title': 'Overview',
                    'url': '/',
                    'iconClass': 'fas fa-chart-pie'
                  },
                  {
                    'content': <Sewing />,
                    'title': 'Sewing',
                    'url': '/sewing',
                    'iconClass': 'fas fa-chart-line'
                  },
                  {
                    'content': <Settings />,
                    'title': 'Settings',
                    'url': '/settings',
                    'iconClass': 'fas fa-cog'
                  },
                ]}/>
              </EventSourceContext.Provider>
            </Route>
          </Switch>
        </Router>
      </LoggedInUserContext.Provider>
    )
  }
}

export default App;