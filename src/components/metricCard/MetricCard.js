import React, { Component } from 'react';
import { Card } from '..';
import styles from "./MetricCard.module.scss";

const API_URL = process.env.REACT_APP_API_URL
const POLL_INTERVAL = process.env.REACT_APP_POLL_INTERVAL

class MetricCard extends Component {
	constructor(props) {
		super(props)
		this.state = {"data": "-"}
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
			fetch(`${API_URL}${this.props.uri}`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data) {
            this.setState({
              "data": this.props.extractData(data.data)
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
		return (
			<Card>
				<div className={styles.block}>
					<div>
						<h2 className={styles.h2}>{this.props.metricName}</h2>
						<h3 className={styles.h3}>{this.state.data.toLocaleString()}</h3>
					</div>
				</div>
			</Card>
		);
	}
}
    
export default MetricCard;