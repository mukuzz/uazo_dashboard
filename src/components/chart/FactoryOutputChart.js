import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from "./FactoryOutputChart.module.scss";
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class FactoryOutputChart extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()
  activeChartRequestKey
  activeButton = "1d"
  timeUnit = 'day'

  constructor(props){
    super(props)
    this.state = {
      labels: [1691178732, 1691178733, 1691178734, 1691178735, 1691178736, 1691178737, 1691178738, 1691178739, 1691178740],
      data: [234,34,66,234,112,236,158,234,136],
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
    if (this.netReq) this.netReq.cancel()
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
      this.timeUnit = 'hour'
    } else if (this.activeButton === "1w") {
      start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      this.timeUnit = 'day'
    } else if (this.activeButton === "1m") {
      start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      this.timeUnit = 'day'
    }
    start.setHours(0,0,0,0)
    end = new Date()
    end.setHours(23,59,59,999)
    this.startTime = start
    this.endTime = end
  }

  fetchData = () => {
    const requestChartType = `${this.activeButton}`
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(fetch(`${API_URL}/metric/output-timeseries/?start=${this.startTime.toISOString()}&end=${this.endTime.toISOString()}`, {headers: authHeader()}))
    this.netReq.promise.then(res => {
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
							display: false,
							// labelString: 'Date'
            },
            time: {
              tooltipFormat: 'll HH:mm',
              unit: this.timeUnit
            },
						ticks: {
							major: {
								fontStyle: 'bold',
								fontColor: '#FF0000'
							},
						},
            distribution: 'linear'
					}],
					yAxes: [{
            ticks: {
              beginAtZero: true,
            },
						display: true,
						scaleLabel: {
							display: false,
							// labelString: 'Output'
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
                data-active={this.activeButton === "1d"}
                onClick={() => {
                    this.activeButton = "1d"
                    this.refreshChart()
                  }}>
                  1d
              </button>
              <button
                data-active={this.activeButton === "1w"}
                onClick={() => {
                  this.activeButton = "1w"
                  this.refreshChart()
                }}>
                  1w
              </button>
              <button
                data-active={this.activeButton === "1m"}
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