import React, { Component } from 'react';

import SideNavItem from './components/sidenav/SideNavItem';
import SideNav from './components/sidenav/SideNav';
import TopNav from './components/topnav/TopNav';

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faCog, faChartPie } from "@fortawesome/free-solid-svg-icons";

library.add([faCog, faChartPie])
dom.watch()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {sideNavActive: true}
    this.handleSideNavClose = this.handleSideNavClose.bind(this)
    this.handleSideNavOpen = this.handleSideNavOpen.bind(this)
  }

  handleSideNavClose() {
    console.log("sasa")
    this.setState({sideNavActive: false})
  }

  handleSideNavOpen() {
    this.setState({sideNavActive: true})
}

  render() {
    return (
      <div>
        <TopNav handleSideNavOpen={this.handleSideNavOpen}/>
        <SideNav handleSideNavClose={this.handleSideNavClose} sideNavActive={this.state.sideNavActive}>
          <SideNavItem title="Overview" url="#" faIcon="fas fa-chart-pie" active={true} />
          <SideNavItem title="Settings" url="#" faIcon="fas fa-cog" active={false} />
        </SideNav>
      </div>
    );
  }
}

export default App;