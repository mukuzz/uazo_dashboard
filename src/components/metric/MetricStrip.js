import React, { Component } from 'react';
import { Card } from '..';
import styles from "./MetricStrip.module.scss"

class MetricStrip extends Component {
  render() {
    return (
      <Card>
        <div className={styles.block}>
          {this.props.items.map((item, index) => {
            return (
              <div key={index+item.title} className={styles.item}>
                <h3>{item.title}</h3>
                <h4>{item.body}</h4>
              </div>
            )
          })}
        </div>
      </Card>
    );
  }
}

export default MetricStrip;