import React, { Component } from 'react';
import styles from "./Card.module.scss";

class RoundedCard extends Component {
    render() {
        return (
            <div className={styles.block}>
                {this.props.children}
            </div>
        );
    }
}

export default RoundedCard;