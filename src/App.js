import React, { Component } from 'react';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

import { NavLayout } from "./components";
import { Overview } from './containers';
import { EventSourceContext } from './context';

library.add([faCog, faChartPie, faChartLine])
dom.watch()

const APP_URL = process.env.REACT_APP_SERVER_URL

class App extends Component {
  constructor(props){
    super(props)
    this.eventSource = new EventSource(`${APP_URL}/sse/event/`)
  }

  componentWillUnmount() {
    this.eventSource.close()
  }

  render() {
    let content = <Overview />
    return (
      <EventSourceContext.Provider value={this.eventSource}>
        <NavLayout content={content}/>
      </EventSourceContext.Provider>
    )
  }
}

export default App;