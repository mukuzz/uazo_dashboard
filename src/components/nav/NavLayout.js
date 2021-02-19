import React from "react";
import { TopNav, SideNav, SideNavItem } from "..";
import styles from "./NavLayout.module.scss";

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
        <div>
            <TopNav handleSideNavOpen={this.handleSideNavOpen}/>
            <div className={styles.block}>
                <SideNav handleSideNavClose={this.handleSideNavClose} sideNavActive={this.state.sideNavActive}>
                    <SideNavItem title="Overview" url="#" faIcon="fas fa-chart-pie" active={true} />
                    <SideNavItem title="Settings" url="#" faIcon="fas fa-cog" active={false} />
                </SideNav>
                <div className={styles.content}>{this.props.content}</div>
            </div>
        </div>
        );
    }
}

export default NavLayout