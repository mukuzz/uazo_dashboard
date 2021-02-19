import React, { Component } from 'react';
import styles from "./TopNav.module.scss"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBars, faUserAlt, faBell } from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logo.svg"

library.add([faBars, faUserAlt, faBell])

class TopNav extends Component {
    render() {
        return (
            <nav className={styles.block}>
                <button className={styles.button} onClick={this.props.handleSideNavOpen} aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="fas fa-bars"></span>
                </button>
                <div class={styles.logo} style={{backgroundImage: `url("${Logo}")`}}></div>
                <div className={styles.notification}>
                    <span className="fas fa-bell"></span>
                </div>
                <div className={styles.profile}>
                    <span className="fas fa-user-alt"></span>
                </div>
            </nav>
        );
    }
}

export default TopNav;