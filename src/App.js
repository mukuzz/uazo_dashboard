import React, { Component } from 'react';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

import { NavLayout } from "./components";
import { Overview, Settings, Detail } from './containers';
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
    return (
      <EventSourceContext.Provider value={this.eventSource}>
        <NavLayout pages={[
          {
            'content': <Overview/>,
            'title': 'Overview',
            'url': '/',
            'iconClass': 'fas fa-chart-pie'
          },
          {
            'content': <Detail />,
            'title': 'Detail',
            'url': '/detail',
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
    )
  }
}

export default App;