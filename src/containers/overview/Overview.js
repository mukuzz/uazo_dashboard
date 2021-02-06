import React, { Component } from 'react';
import { KeyStatsTable } from '..';
import styles from './Overview.module.scss';
import { MetricCard } from '../../components';

class Overview extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles['metric-cards-cont']}>
          <MetricCard metricName="Production Volume" uri="/metric/active-order-progress/" />
          <MetricCard metricName="Order Volume" uri="/metric/active-order-volume/" />
          <MetricCard metricName="Active Lines" uri="/metric/active-lines/" />
          <MetricCard metricName="Operators" uri="/metric/active-operators/" />
          <MetricCard metricName="Helpers" uri="/metric/active-helpers/" />
        </div>
        <KeyStatsTable />
      </div>
    );
  }
}

export default Overview;