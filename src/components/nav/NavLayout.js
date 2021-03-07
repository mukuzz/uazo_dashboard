import React from "react";
import { TopNav, SideNav, SideNavItem } from "..";
import styles from "./NavLayout.module.scss";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { PrivateRoute } from "../../utils/utils";


class NavLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {sideNavActive: false}
        this.handleNavClose = this.handleNavClose.bind(this)
        this.handleSideNavToggle = this.handleSideNavToggle.bind(this)
    }

    handleNavClose() {
        this.setState({sideNavActive: false})
    }

    handleSideNavToggle() {
        this.setState((state) => ({sideNavActive: !state.sideNavActive}))
    }

    render() {
        return (
            <div className={styles.block}>
                <TopNav handleSideNavToggle={this.handleSideNavToggle} sideNavActive={this.state.sideNavActive}/>
                <SideNav
                    handleNavClose={this.handleNavClose}
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
                                handleNavClose={this.handleNavClose}
                            />
                        )
                    })}
                </SideNav>
                <div className={styles.content} data-active={`${this.state.sideNavActive}`}>
                    <Switch>
                        {this.props.pages.map((page) => {
                            return <PrivateRoute exact key={page.url} path={page.url}>{page.content}</PrivateRoute>
                        })}
                        <Route path="*"><Redirect to="/" /></Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default NavLayout