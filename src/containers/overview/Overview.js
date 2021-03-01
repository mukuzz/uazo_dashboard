import React, { Component } from 'react';
import styles from './Overview.module.scss';
import { MetricCard, FactoryOutputChart, ProductionOrdersProgress, FrequentDefectsTable, KeyStatsTable, EfficiencyChart, QualityReportChart, HourlyProductionTable, HourlyStatsTable, QualityReport } from '../../components';

class Overview extends Component {
  render() {
    return (
      <div className={styles.block}>
        <FactoryOutputChart />
        <div className={styles['metric-cards-cont']}>
          <MetricCard
            metricName="Production Orders"
            uri="/metric/active-orders-status/"
            extractData={(data) => data.length}
          />
          <MetricCard
            metricName="Production Output"
            uri="/metric/active-orders-status/"
            extractData={(data) => data.map((d) => d.produced).reduce((prev, curr) => prev + curr)}
          />
          <MetricCard
            metricName="Order Quantity"
            uri="/metric/active-orders-status/"
            extractData={(data) => data.map((d) => d.target).reduce((prev, curr) => prev + curr)}
          />
          <MetricCard
            metricName="Active Lines"
            uri="/metric/active-lines/"
            extractData={(data) => data.length}
          />
          <MetricCard
            metricName="Operators"
            uri="/metric/active-operators/"
            extractData={(data) => data}
          />
          <MetricCard
            metricName="Helpers"
            uri="/metric/active-helpers/"
            extractData={(data) => data}
          />
        </div>
        <div className={styles['detail-cards-cont']}>
          <ProductionOrdersProgress />
          <EfficiencyChart />
          {/* <QualityReportChart /> */}
          <QualityReport />
          <FrequentDefectsTable />
        </div>
        <HourlyProductionTable />
        <HourlyStatsTable />
        <KeyStatsTable />
      </div>
    );
  }
}

export default Overview;