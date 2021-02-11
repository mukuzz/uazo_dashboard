import React, { Component } from 'react';
import Chart from "chart.js";
import { TitledCard } from '..';
import styles from "./QualityReportChart.module.scss"

const API_URL = process.env.REACT_APP_API_URL

class QualityReportChart extends Component {
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {ftt: 0, defective: 0, rectified: 0, rejected: 0}
    this.buildChart = this.buildChart.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
    this.buildChart()
  }

  componentDidUpdate() {
    this.buildChart()
  }

  fetchData() {
		fetch(`${API_URL}/metric/active-qc-actions/`)
    .then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        console.log(data)
        if (data) {
          this.setState({
            ftt: data.ftt,
            defective: data.defective,
            rectified: data.rectified,
            rejected: data.rejected,
          })
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  buildChart() {
    const ctx = this.chartRef.current.getContext("2d")

    if (typeof this.chart !== "undefined") this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'doughnut',
			data: {
				datasets: [{
					data: [
            this.state.ftt,
            this.state.defective,
            this.state.rectified,
            this.state.rejected
					],
					backgroundColor: [
						'#008450',
						'#EFB700',
						'#336dc4',
						'#B81D13',
					],
				}],
				labels: [
					'FTT',
					'Defective',
					'Rectified',
					'Rejected'
				]
			},
			options: {
				responsive: true,
        maintainAspectRatio: true,
        aspectRatio: .8,
				legend: {
					position: 'bottom',
				},
				animation: {
					animateScale: true,
					animateRotate: true
        },
        title: {
          display: false
        },
			}
    })
  }

  render() {
    const content = (
      <div className={styles.block}>
        <div className={styles.chart}>
          <canvas id="output-chart" ref={this.chartRef} />
        </div>
      </div>
    )
    return (
      <TitledCard title="Quality Report" content={content} />
    );  
  }
}

export default QualityReportChart;