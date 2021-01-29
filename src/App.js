import React, { Component } from 'react';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie } from "@fortawesome/free-solid-svg-icons";

import { Nav } from './containers';

library.add([faCog, faChartPie])
dom.watch()

class App extends Component {
  render() {
    return (
      <div>
        <Nav/>
      </div>
    )
  }
}

export default App;