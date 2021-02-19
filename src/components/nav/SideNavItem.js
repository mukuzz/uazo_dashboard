import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import styles from "./SideNavItem.module.scss"

class SideNavItem extends Component {
    render() {
        const Container = this.props.container
        return (
            <li className={styles.block} >
                <Container to={this.props.url}>
                    <div href={this.props.url} className={styles.link + (this.props.url === this.props.location.pathname ? " " + styles.active : "")}>
                        <span className={styles.text}>
                            <span className={styles.icon + " " + this.props.faIcon}></span>
                        </span>
                        <span className={styles.text}>{this.props.title}</span>
                    </div>
                </Container>
            </li>
        );
    }
}

export default withRouter(SideNavItem);