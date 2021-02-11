import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from "./FactoryOutputChart.module.scss";

const API_URL = process.env.REACT_APP_API_URL

class FactoryOutputChart extends Component {
  chartRef = React.createRef()
  activeChartRequestKey
  activeButton

  constructor(props){
    super(props)
    this.state = {
      labels: [],
      data: []
    }
    this.fetchData = this.fetchData.bind(this)
    this.get1dChart = this.get1dChart.bind(this)
    this.get1wChart = this.get1wChart.bind(this)
    this.get1mChart = this.get1mChart.bind(this)
  }
  
	componentDidMount() {
    this.get1wChart()
    this.buildChart()
  }
  
  componentDidUpdate() {
    this.buildChart()
  }

  get1dChart() {
    this.activeButton = "1d"
    const start = new Date()
    start.setHours(0,0,0,0)
    const end = new Date()
    end.setHours(23,59,59,999)
    this.fetchData(start, end)
  }
  
  get1wChart() {
    this.activeButton = "1w"
    const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    start.setHours(0,0,0,0)
    const end = new Date()
    end.setHours(23,59,59,999)
    this.fetchData(start, end)
  }

  get1mChart() {
    this.activeButton = "1m"
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    start.setHours(0,0,0,0)
    const end = new Date()
    end.setHours(23,59,59,999)
    this.fetchData(start, end)
  }

  fetchData(start, end) {
    const tempActiveChartRequestKey = `${start.getTime()}${end.getTime()}`
    start = start.toISOString()
    end = end.toISOString()
		if (this.activeChartRequestKey !== tempActiveChartRequestKey) {
      this.activeChartRequestKey = tempActiveChartRequestKey
			fetch(`${API_URL}/metric/output-timeseries/?start=${start}&end=${end}`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data) {
            if (this.activeChartRequestKey === tempActiveChartRequestKey) {
              this.setState({
                labels: data.labels,
                data: data.data
              })
            }
          }
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }

  buildChart() {
    const {labels, data} = this.state
    const ctx = this.chartRef.current.getContext("2d")

    if (typeof this.chart !== "undefined") this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.length === data.length ? labels : new Array(data.length).fill("Date"),
        datasets: [
          {
            label: "Output",
            data: data,
            borderColor: "#98B9AB",
            fill: true,
          }
        ]
      },
      options: {
        elements: {
          line: {
              tension: 0
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "nearest",
          intersect: false,
          axis: 'x',
        },
        scales: {
					xAxes: [{
						type: 'time',
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
            },
            time: {
              tooltipFormat: 'll HH:mm',
            },
						ticks: {
							major: {
								fontStyle: 'bold',
								fontColor: '#FF0000'
							}
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Output'
						}
					}]
				}
      }
    })
  }

  render() {
    return (
      <Card>
        <div className={styles.block}>
          <div className={styles.header}>
            <h2 className={styles.title}>Factory Output</h2>
            <div className={styles.filter}>
              <button
              className={styles.button + (this.activeButton === '1d' ? ' '+styles['btn-dark'] : '')}
              onClick={this.get1dChart}>1d</button>
              <button
              className={styles.button + (this.activeButton === '1w' ? ' '+styles['btn-dark'] : '')}
              onClick={this.get1wChart}>1w</button>
              <button
              className={styles.button + (this.activeButton === '1m' ? ' '+styles['btn-dark'] : '')}
              onClick={this.get1mChart}>1m</button>
            </div>
          </div>
          <div className={styles.chart}>
            <canvas id="output-chart" ref={this.chartRef} />
          </div>
        </div>
      </Card>
    );
  }
}

export default FactoryOutputChart;