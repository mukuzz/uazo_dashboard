import React, { Component } from 'react';
import { Circle } from "rc-progress";
import { TitledCard } from '..';
import styles from './EfficiencyChart.module.scss'
import { EventSourceContext } from "../../context";

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class EfficiencyChart extends Component {
  static contextType = EventSourceContext

  constructor(props) {
		super(props)
		this.state = {target: 0, actual: 0, hitRate: 0}
		this.refresh = this.refresh.bind(this)
		this.shouldRefresh = true;
  }
  
  componentDidMount() {
		this.refresh()
    this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", () => this.refresh())
  }
  
	componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.refresh)
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
            let hitRate = 0
            if (data.target === 0 || data.actual === 0)
              hitRate = 0
            else {           
              const per = data.actual / data.target * 100
              if (isNaN(per)) hitRate = 0
              else hitRate = per
            }
            this.setState({
              actual: data.actual,
              target: data.target,
              hitRate: hitRate,
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
              if (this.state.hitRate > 100) return 100
              else return this.state.hitRate
            })()}
          />
          <div className={styles.stat}>
            <h4>{this.state.actual.toFixed(2)}%</h4>
            <p>Target: {this.state.target.toFixed(2)}%</p>
          </div>
        </div>
        
        <div className={styles.footer}><h4>Efficiency Hit Rate: <strong>{this.state.hitRate.toFixed(2)}%</strong></h4></div>
      </div>
    )
    return (
      <TitledCard title="Factory Efficiency" content={content} />
    );
  }
}

export default EfficiencyChart;