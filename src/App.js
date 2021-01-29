import React, { Component } from 'react';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie, faChartLine } from "@fortawesome/free-solid-svg-icons";

import { NavLayout, Overview } from './containers';

library.add([faCog, faChartPie, faChartLine])
dom.watch()

class App extends Component {
  render() {
    let content = <Overview />
    return (
      <NavLayout content={content}/>
    )
  }
}

export default App;