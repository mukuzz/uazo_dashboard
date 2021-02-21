import React from "react";
import { TopNav, SideNav, SideNavItem } from "..";
import styles from "./NavLayout.module.scss";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

class NavLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {sideNavActive: false}
        this.handleSmallScreenNavClose = this.handleSmallScreenNavClose.bind(this)
        this.handleSideNavToggle = this.handleSideNavToggle.bind(this)
    }

    handleSmallScreenNavClose() {
        if (window.innerWidth < 768)
            this.setState({sideNavActive: false})
    }

    handleSideNavToggle() {
        this.setState((state) => ({sideNavActive: !state.sideNavActive}))
    }

    render() {
        return (
        <Router>
            <div className={styles.block}>
                <SideNav
                    handleSmallScreenNavClose={this.handleSmallScreenNavClose}
                    sideNavActive={this.state.sideNavActive}
                    >
                    {this.props.pages.map((page) => {
                        return (
                            <SideNavItem
                                key={page.url}
                                container={Link}
                                title={page.title}
                                url={page.url}
                                faIcon={page.iconClass}
                                handleSmallScreenNavClose={this.handleSmallScreenNavClose}
                            />
                        )
                    })}
                </SideNav>
                <div className={styles.content}>
                    <TopNav handleSideNavToggle={this.handleSideNavToggle}/>
                    <Switch>
                        {this.props.pages.map((page) => {
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