import React, { Component } from 'react';
import Chart from "chart.js";
import { TitledCard } from '..';
import styles from "./QualityReportChart.module.scss"
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class QualityReportChart extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {ftt: 0, defective: 0, rectified: 0, rejected: 0}
  }

  componentDidMount() {
    this.buildChart()
    this.fetchData()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.fetchData)
  }

	componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.fetchData)
    if (this.netReq) this.netReq.cancel()
	}

  componentDidUpdate() {
    this.buildChart()
  }

  fetchData = () => {
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(fetch(`${API_URL}/metric/qc-actions/`, {headers: authHeader()}))
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
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

  buildChart = () => {
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
					'Pass',
					'Defective',
					'Rectified',
					'Alter'
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