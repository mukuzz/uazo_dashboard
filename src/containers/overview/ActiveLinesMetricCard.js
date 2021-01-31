import React, { Component } from 'react';
import { MetricCard } from '../../components';

const API_URL = process.env.REACT_APP_API_URL

class ActiveLinesMetricCard extends Component {
  constructor(props) {
    super(props)
    this.state = {"data": "-"}
    this.refresh = this.refresh.bind(this)
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 10000)   
  }

  refresh() {
    if (this.shouldRefresh) {
      fetch(`${API_URL}/production-line/active/`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data !== null) {
            this.setState({
              "data": data.data
            })
          }
        },
        (error) => {
          console.log(error)
          this.shouldRefresh = true;
        }
      )
    }
  }

  render() {
    return (
      <MetricCard
        iconClass="fas fa-chart-line"
        metricName="Active Lines"
        metricValue={this.state.data}
      />
    );
  }
}

export default ActiveLinesMetricCard;