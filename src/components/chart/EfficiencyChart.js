import React, { Component } from 'react';
import { Circle } from "rc-progress";
import { TitledCard } from '..';
import styles from './EfficiencyChart.module.scss'

const API_URL = process.env.REACT_APP_API_URL
const POLL_INTERVAL = process.env.REACT_APP_POLL_INTERVAL

class EfficiencyChart extends Component {
  constructor(props) {
		super(props)
		this.state = {target: 0, actual: 0}
		this.refresh = this.refresh.bind(this)
		this.shouldRefresh = true;
  }
  
  componentDidMount() {
		this.refresh()
		setInterval(this.refresh, POLL_INTERVAL)
  }

	refresh() {
		if (this.shouldRefresh) {
			this.shouldRefresh = false
			fetch(`${API_URL}/metric/factory-efficiency/`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data) {
            this.setState({
              "actual": data.actual.toFixed(2),
              "target": data.target.toFixed(2),
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
              if (this.state.target === 0) return 0
              const per = this.state.actual/this.state.target*100
              if (per > 100) return 100
              else if (per === undefined) return 0 
              else return per
            })()}
          />
        </div>
        <div className={styles.stat}>
          <h4>{this.state.actual}%</h4>
          <p>Target: {this.state.target}%</p>
        </div>
      </div>
    )
    return (
      <TitledCard title="Factory Efficiency" content={content} />
    );
  }
}

export default EfficiencyChart;