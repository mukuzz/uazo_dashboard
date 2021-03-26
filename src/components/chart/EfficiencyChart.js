import React, { Component } from 'react';
import { Circle } from "rc-progress";
import { TitledCard } from '..';
import styles from './EfficiencyChart.module.scss'
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader, getUrlParamsStringFromFilter } from "../../utils/utils";

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class EfficiencyChart extends Component {
  static contextType = EventSourceContext

  constructor(props) {
		super(props)
		this.state = {target: "0.00%", actual: "0.00%", efficiencyRealized: 0}
  }
  
  componentDidMount() {
		this.fetchData()
    this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", () => this.fetchData())
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.fetchData()
    }
  }
  
	componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.fetchData)
    if (this.netReq) this.netReq.cancel()
	}

	fetchData = () => {
    const urlParams = getUrlParamsStringFromFilter(this.props.filter)
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/metric/efficiency/${urlParams}`,
      {headers: authHeader()}),
    )
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          let efficiencyRealized = 0
          if (data.target === 0 || data.actual === 0)
            efficiencyRealized = 0
          else {
            const per = parseFloat(data.actual) / parseFloat(data.target) * 100
            if (isNaN(per)) efficiencyRealized = 0
            else efficiencyRealized = per
          }
          this.setState({
            actual: data.actual,
            target: data.target,
            efficiencyRealized: efficiencyRealized,
          })
        }
      },
      (error) => {
        console.error(error)
      }
    )
	}


  render() {
    const content = (
      <div className={styles.block}>
        <div className={styles.chart}>
          <Circle
            gapDegree={40}
            gapPosition="top"
            strokeWidth={6}
            trailWidth={6}
            strokeLinecap="round"
            percent={(() => {
              if (this.state.efficiencyRealized > 100) return 100
              else return this.state.efficiencyRealized
            })()}
          />
          <div className={styles.stat}>
            <h4>{this.state.actual}</h4>
            <p>Target: {this.state.target}</p>
          </div>
        </div>
        
        <div className={styles.footer}><h4>Efficiency Realized (Pct): <strong>{this.state.efficiencyRealized.toFixed(2)}%</strong></h4></div>
      </div>
    )
    return (
      <TitledCard title={this.props.title} content={content} />
    );
  }
}

export default EfficiencyChart;