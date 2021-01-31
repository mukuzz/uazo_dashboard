import React, { Component } from 'react';
import { KeyStatsTable } from '..';
import styles from './Overview.module.scss';
import ProdVolumeMetricCard from './ProdVolumeMetricCard';
import OrderVolumeMetricCard from './OrderVolumeMetricCard';
import ActiveLinesMetricCard from './ActiveLinesMetricCard';
import WorkforceMetricCard from './WorkforceMetricCard';

class Overview extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles['metric-cards-cont']}>
          <ProdVolumeMetricCard />
          <OrderVolumeMetricCard />
          <ActiveLinesMetricCard />
          <WorkforceMetricCard />
        </div>
        <KeyStatsTable />
      </div>
    );
  }
}

export default Overview;