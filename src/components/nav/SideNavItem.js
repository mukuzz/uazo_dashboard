import React, { Component } from 'react';
import styles from "./SideNavItem.module.scss"

class SideNavItem extends Component {
    render() {
        return (
            <li className={styles.block} >
                <a href={this.props.url} className={styles.link + (this.props.active ? " " + styles.active : "")}>
                    <span className={styles.text}>
                        <span className={styles.icon + " " + this.props.faIcon}></span>
                    </span>
                    <span className={styles.text}>{this.props.title}</span>
                </a>
            </li>
        );
    }
}

export default SideNavItem;