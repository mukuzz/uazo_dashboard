import React, { Component } from 'react';
import { Card } from '..';
import styles from './TitledCard.module.scss'

class TitledCard extends Component {
  render() {
    return (
      <Card>
        <div className={styles.block}>
          <div className={styles.header}>
            <h2 className={styles.title}>{this.props.title}</h2>
          </div>
          {this.props.content}
        </div>
      </Card>
    );
  }
}

export default TitledCard;