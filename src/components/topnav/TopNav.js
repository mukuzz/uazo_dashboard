import React, { Component } from 'react';
import styles from "./TopNav.module.scss"

class TopNav extends Component {
    render() {
        return (
            <nav className={styles.block}>
                    <button className={styles.button} onClick={this.props.handleSideNavOpen} aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className={styles["navbar-toggler-icon"]}></span>
                    </button>
            </nav>
        );
    }
}

export default TopNav;