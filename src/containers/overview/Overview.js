import React, { Component } from 'react';
import { MetricCard, Table } from '../../components';
import styles from './Overview.module.scss';

class Overview extends Component {
  render() {
    return (
      <div className={styles.block}>
        <div className={styles['metric-cards-cont']}>
          <MetricCard
            iconClass="fas fa-chart-line"
            metricName="Production Volume"
            metricValue="98819"
            />
          <MetricCard
            iconClass="fas fa-chart-line"
            metricName="Order Volume"
            metricValue="108819"
          />
          <MetricCard
            iconClass="fas fa-chart-line"
            metricName="Active Lines"
            metricValue="12/19"
          />
          <MetricCard
            iconClass="fas fa-chart-line"
            metricName="Operators / Helpers"
            metricValue="121/99"
          />
        </div>
        <Table
          tableName="Table"
          headings={["Table Heading","Table Heading","Table Heading","Table Heading","Table Heading","Table Heading","Table Heading","Table Heading","Table Heading","Table Heading"]}
          items={[
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
            ["sdfsd","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf","sdfsdf","dsfsd","sdfds","sdfsdf"],
          ]}
        />
      </div>
    );
  }
}

export default Overview;