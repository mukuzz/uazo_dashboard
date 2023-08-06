import React, { Component } from 'react';
import styles from './Overview.module.scss';
import { MetricCard, FactoryOutputChart, FrequentDefectsTable, KeyStatsTable, EfficiencyChart, HourlyProductionTable, HourlyStatsTable, QualityReport, ProgressCharts } from '../../components';

class Overview extends Component {
  render() {
    const startDate = new Date()
    startDate.setHours(0,0,0,0)
    const filter = {
			filterStartDate: startDate,
			filterEndDate: new Date(),
    }
    const progressChartOptions = [
      {
        uri: "/metric/orders-progress/",
        name: "Orders",
        affectMetricsByTime: false,
      },
      {
        uri: "/metric/styles-progress/",
        name: "Styles",
        affectMetricsByTime: false,
      },
    ]
    return (
      <div className={styles.block}>
        <FactoryOutputChart />
        <div className={styles['metric-cards-cont']}>
          <MetricCard
            metricName="Production Orders"
            uri="/metric/orders-progress/"
            extractData={(data) => data.length}
            value={20}
          />
          <MetricCard
            metricName="Production Output"
            uri="/metric/orders-progress/"
            extractData={(data) => data.map((d) => d.produced).reduce((prev, curr) => prev + curr)}
            value={130}
          />
          <MetricCard
            metricName="Order Quantity"
            uri="/metric/orders-progress/"
            extractData={(data) => data.map((d) => d.target).reduce((prev, curr) => prev + curr)}
            value={150}
          />
          <MetricCard
            metricName="Active Lines"
            uri="/metric/active-lines/"
            extractData={(data) => data.length}
            value={2}
          />
          <MetricCard
            metricName="Operators"
            uri="/metric/active-operators/"
            extractData={(data) => data}
            value={6}
          />
          <MetricCard
            metricName="Helpers"
            uri="/metric/active-helpers/"
            extractData={(data) => data}
            value={2}
          />
        </div>
        <div className={styles['detail-cards-cont']}>
          <ProgressCharts filter={filter} chartOptions={progressChartOptions} />
          <EfficiencyChart filter={filter} title="Factory Efficiency" />
          {/* <QualityReportChart /> */}
          <QualityReport filter={filter} />
          <FrequentDefectsTable filter={filter} />
        </div>
        <HourlyProductionTable filter={filter} />
        <HourlyStatsTable filter={filter} />
        <KeyStatsTable filter={filter} />
      </div>
    );
  }
}

export default Overview;