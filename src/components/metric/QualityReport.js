import React, { Component } from 'react';
import { TitledCard } from '..';
import styles from "./QualityReport.module.scss"

const ReportItem = ({title, metric, metricPer, color}) => {
  return (
    <div className={styles['report-item']}>
      <h3 style={{color: color}}>{title}</h3>
      <h4>{metric}</h4>
      <h4>{metricPer}</h4>
    </div>
  )
}

class QualityReport extends Component {
  render() {
    const content = (
      <div className={styles.block}>
        <ReportItem title="FTT" metric="2100" metricPer="91.3%" color="#008450" />
        <ReportItem title="Rejected" metric="10" metricPer="0.43%" color="#B81D13" />
        <ReportItem title="Defective" metric="190" metricPer="8.26%" color="#EFB700" />
        <ReportItem title="Rectified" metric="95" metricPer="4.13%" color="#336dc4" />
      </div>
    )
    return (
      <div>
        <TitledCard title="Quality Report" content={content} />
      </div>
    );
  }
}

export default QualityReport;