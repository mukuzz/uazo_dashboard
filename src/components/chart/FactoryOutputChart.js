import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from "./FactoryOutputChart.module.scss";
import { EventSourceContext } from "../../context";

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class FactoryOutputChart extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()
  activeChartRequestKey
  activeButton = "1w"

  constructor(props){
    super(props)
    this.state = {
      labels: [],
      data: [],
    }
    this.startTime = ''
    this.endTime = ''
  }
  
	componentDidMount() {
    this.buildChart()
    this.refreshChart()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.refreshChart)
  }

  componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.refreshChart)
	}

  componentDidUpdate() {
    this.buildChart()
  }

  refreshChart = () => {
    this.getChartDateRange()
    this.fetchData()
  }

  getChartDateRange = () => {
    let start, end
    if (this.activeButton === "1d") {
      start = new Date()
    } else if (this.activeButton === "1w") {
      start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    } else if (this.activeButton === "1m") {
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
    start.setHours(0,0,0,0)
    end = new Date()
    end.setHours(23,59,59,999)
    this.startTime = start
    this.endTime = end
  }

  fetchData = () => {
    const requestChartType = `${this.activeButton}`
    fetch(`${API_URL}/metric/output-timeseries/?start=${this.startTime.toISOString()}&end=${this.endTime.toISOString()}`)
    .then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          if (this.activeButton === requestChartType) {
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

  buildChart = () => {
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
                className={styles.button + (this.activeButton === "1d" ? ' '+styles['btn-dark'] : '')}
                onClick={() => {
                    this.activeButton = "1d"
                    this.refreshChart()
                  }}>
                  1d
              </button>
              <button
                className={styles.button + (this.activeButton === "1w" ? ' '+styles['btn-dark'] : '')}
                onClick={() => {
                  this.activeButton = "1w"
                  this.refreshChart()
                }}>
                  1w
              </button>
              <button
                className={styles.button + (this.activeButton === "1m" ? ' '+styles['btn-dark'] : '')}
                onClick={() => {
                  this.activeButton = "1m"
                  this.refreshChart()
                }}>
                  1m
              </button>
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