import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from './ProgressCharts.module.scss'
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class ProgressCharts extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {
      labels: [],
      target: [],
      produced: []
    }
    this.chartOptions= {
      orders: "/metric/active-orders-progress/",
      styles: "/metric/active-styles-progress/",
      lines: "/metric/lines-progress/",
    }
    this.activeChart = 'orders'
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

  componentDidUpdate(prevProps) {
    if (prevProps.filterDateTime !== this.props.filterDateTime) {
      this.fetchData()
    } else this.buildChart()
  }

  fetchData = () => {
    let filterDateTime = this.props.filterDateTime
    if (!filterDateTime) filterDateTime = new Date()
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}${this.chartOptions[this.activeChart]}?filterDateTime=${filterDateTime.toISOString()}`,
      {headers: authHeader()},
    ))
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          const labels = []
          const target = []
          const produced = []
          // TODO: trim label if too big
          data.data.forEach(po => {
            labels.push(po.label)
            target.push(po.target)
            produced.push(po.produced)
          });
          this.setState({
            labels: labels,
            target: target,
            produced: produced
          })
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  buildChart() {
    const {labels, target, produced} = this.state
    const ctx = this.chartRef.current.getContext("2d")

    if (typeof this.chart !== "undefined") this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: labels.length === target.length ? labels : new Array(target.length).fill("-"),
        datasets: [{
            label: "Target",
            data: target,
            backgroundColor: "#8d7aeb",
        },{
          label: "Produced",
          backgroundColor: "#42f581",
          data: produced,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
					xAxes: [{
            ticks: {
              beginAtZero: true,
            },
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
            <h2 className={styles.title}>Progress</h2>
            <div className={styles.filter}>
              <button
                data-active={this.activeChart === "orders"}
                onClick={() => {
                  this.activeChart = "orders"
                  this.fetchData()
                }}>
                  Orders
              </button>
              <button
                data-active={this.activeChart === "styles"}
                onClick={() => {
                  this.activeChart = "styles"
                  this.fetchData()
                }}>
                  Styles
              </button>
              <button
                data-active={this.activeChart === "lines"}
                onClick={() => {
                  this.activeChart = "lines"
                  this.fetchData()
                }}>
                  Lines
              </button>
            </div>
          </div>
          <div className={styles.chart}>
            <canvas id="po-progress-chart" ref={this.chartRef} />
          </div>
        </div>
      </Card>
    );
  }
}

export default ProgressCharts;