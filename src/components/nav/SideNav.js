import React, { Component } from 'react';
import styles from "./SideNav.module.scss"
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

library.add([faTimes])

class SideNav extends Component {
    render() {
        return (
            <nav id="sidebarMenu" className={styles.block} data-active={`${this.props.sideNavActive}`}>
                <button className={styles.button} onClick={this.props.handleSmallScreenNavClose}>
                    <span className="fas fa-times"></span>
                </button>
                <ul className={styles.list}>
                    {this.props.children}
                </ul>
            </nav>
        )
    }
}

export default SideNav;