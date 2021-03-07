import React, { Component } from 'react';
import styles from "./TopNav.module.scss"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faUserAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg"
import { ProfileSmall } from '..';

library.add([faBars, faUserAlt, faBell])

class TopNav extends Component {
    render() {
        return (
            <nav className={styles.block} data-active={`${this.props.sideNavActive}`}>
                <div className={styles.content}>
                    <button className={styles.button} onClick={this.props.handleSideNavToggle}>
                        <span className="fas fa-bars"></span>
                    </button>
                    <div className={styles.logo} style={{backgroundImage: `url("${Logo}")`}}>
                        <Link to="/"></Link>
                    </div>
                    {/* <div className={styles.notification}>
                        <span className="fas fa-bell"></span>
                    </div> */}
                    <ProfileSmall />
                </div>
            </nav>
        );
    }
}

export default TopNav;