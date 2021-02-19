import React from "react";
import { TopNav, SideNav, SideNavItem } from "..";
import styles from "./NavLayout.module.scss";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class NavLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {sideNavActive: false}
        this.handleSideNavClose = this.handleSideNavClose.bind(this)
        this.handleSideNavOpen = this.handleSideNavOpen.bind(this)
    }

    handleSideNavClose() {
        this.setState({sideNavActive: false})
    }

    handleSideNavOpen() {
        this.setState({sideNavActive: true})
    }

    render() {
        return (
        <Router>
            <TopNav handleSideNavOpen={this.handleSideNavOpen}/>
            <div className={styles.block}>
                <SideNav handleSideNavClose={this.handleSideNavClose} sideNavActive={this.state.sideNavActive}>
                    {this.props.pages.map((page) => {
                        return <SideNavItem key={page.url} container={Link} title={page.title} url={page.url} faIcon={page.iconClass} />
                    })}
                </SideNav>
                <div className={styles.content}>
                    <Switch>
                        {this.props.pages.map((page) => {
                            console.log(page.content)
                            return <Route exact key={page.url} path={page.url}>{page.content}</Route>
                        })}
                        <Route path="*"><Redirect to="/" /></Route>
                    </Switch>
                </div>
            </div>
        </Router>
        );
    }
}

export default NavLayout