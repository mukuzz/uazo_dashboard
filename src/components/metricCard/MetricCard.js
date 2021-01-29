import React, { Component } from 'react';
import { Card } from '..';

import styles from "./MetricCard.module.scss";

class MetricCard extends Component {
    render() {
        return (
            <Card>
                <div className={styles.block}>
                    <div className={styles.icon}>
                        <span className={this.props.iconClass} />
                    </div>
                    <div>
                        <h2 className={styles.h2}>{this.props.metricName}</h2>
                        <h3 className={styles.h3}>{this.props.metricValue}</h3>
                    </div>
                </div>
            </Card>
        );
    }
}
    
export default MetricCard;