import React, { Component } from 'react';
import Chart from "chart.js";
import { Card } from '..';
import styles from './ProductionOrdersProgress.module.scss'
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class ProductionOrdersProgress extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {
      labels: [],
      target: [],
      produced: []
    }
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
    this.netReq = makeCancelable(fetch(`${API_URL}/metric/active-orders/`, {headers: authHeader()}))
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
        maintainAspectRatio: false,
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