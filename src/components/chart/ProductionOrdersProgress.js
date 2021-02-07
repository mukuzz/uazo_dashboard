import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from './ProductionOrdersProgress.module.scss'

Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.tension = 0;

const API_URL = process.env.REACT_APP_API_URL

class ProductionOrdersProgress extends Component {
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {
      labels: [],
      target: [],
      produced: []
    }
    this.fetchChartData = this.fetchChartData.bind(this)
		this.shouldRefresh = true;
  }
  
	componentDidMount() {
    this.fetchChartData()
    this.buildChart()
  }
  
  componentDidUpdate() {
    this.buildChart()
  }

  fetchChartData() {
		if (this.shouldRefresh) {
			this.shouldRefresh = false
			fetch(`${API_URL}/metric/active-orders/`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data) {
            const labels = []
            const target = []
            const produced = []
            data.data.forEach(po => {
              labels.push(po.buyer)
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
      .finally(() => {
        this.shouldRefresh = true
      })
    }
  }

  buildChart() {
    const {labels, target, produced} = this.state
    const ctx = this.chartRef.current.getContext("2d")

    if (typeof this.chart !== "undefined") this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: labels.length === target.length ? labels : new Array(target.length).fill("PO"),
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
        maintainAspectRatio: true,
      }
    })
  }

  render() {
    return (
      <Card>
        <div className={styles.block}>
          <div className={styles.header}>
            <h2 className={styles.title}>Production Orders Progress</h2>
          </div>
          <div className={styles.chart}>
            <canvas id="po-progress-chart" ref={this.chartRef} />
          </div>
        </div>
      </Card>
    );
  }
}

export default ProductionOrdersProgress;