import React, { Component } from 'react';
import { Card } from '..';
import styles from "./MetricCard.module.scss";
import { EventSourceContext } from "../../context";
import { makeCancelable } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class MetricCard extends Component {
	static contextType = EventSourceContext

	constructor(props) {
		super(props)
		this.state = {"data": "-"}
	}

	componentDidMount() {
		this.fetchData()
		this.eventSource = this.context
    	this.eventSource.addEventListener("newQcInput", this.fetchData)
	}

	componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.fetchData)
    if (this.netReq) this.netReq.cancel()
	}

	fetchData = () => {
    if (this.netReq) this.netReq.cancel()
		this.netReq = makeCancelable(fetch(`${API_URL}${this.props.uri}`))
		this.netReq.promise.then(res => {
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