import React, { Component } from 'react';
import { MetricCard } from '../../components';

const API_URL = process.env.REACT_APP_API_URL

class WorkforceMetricCard extends Component {
  constructor(props) {
    super(props)
    this.state = {"operators": "-", "helpers": "-"}
    this.refresh = this.refresh.bind(this)
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refresh()
    setInterval(this.refresh, 10000)   
  }

  refresh() {
    if (this.shouldRefresh) {
      fetch(`${API_URL}/production-session/active/`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data !== null) {
            const workforce = {}
            for (let i = 0; i < data.length; i++) {
              const prodSession = data[i];
              const operators = prodSession.operators
              const helpers = prodSession.helpers
              if (workforce[prodSession.line_number] == null) {
                workforce[prodSession.line_number] = {
                  'operators': 0,
                  'helpers': 0
                }
              }
              workforce[prodSession.line_number]['operators'] = Math.max(workforce[prodSession.line_number]['operators'], operators)
              workforce[prodSession.line_number]['helpers'] = Math.max(workforce[prodSession.line_number]['helpers'], helpers)
            }
            let operators = 0, helpers = 0
            for (const key in workforce) {
              if (Object.hasOwnProperty.call(workforce, key)) {
                const element = workforce[key];
                operators += element.operators
                helpers += element.helpers
              }
            }
            this.setState({
              "operators": operators,
              "helpers": helpers
            })
          }
        },
        (error) => {
          console.error(error)
          this.shouldRefresh = true;
        }
      )
    }
  }

  render() {
    return (
      <MetricCard
        iconClass="fas fa-chart-line"
        metricName="Operators / Helpers"
        metricValue={`${this.state.operators} / ${this.state.helpers}`}
      />
    );
  }
}

export default WorkforceMetricCard;