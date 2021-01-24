import React, { Component } from 'react';
import styles from "./SideNavItem.module.scss"

class SideNavItem extends Component {
    render() {
        return (
            <li className={styles.block + (this.props.active ? " " + styles.active : "")} >
                <a href={this.props.url}>
                    <span><span className={this.props.faIcon}></span></span>
                    <span>{this.props.title}</span>
                </a>
            </li>
        );
    }
}

export default SideNavItem;