import React, { Component } from 'react';
import styles from "./Card.module.scss";

class RoundedCard extends Component {
    render() {
        let cardStyle = styles.block
        if (this.props.className !== undefined)
            cardStyle += ' ' + this.props.className
        return (
            <div className={cardStyle}>
                {this.props.children}
            </div>
        );
    }
}

export default RoundedCard;