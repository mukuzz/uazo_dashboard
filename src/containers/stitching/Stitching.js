import React, { Component } from 'react';
import styles from "./Stitching.module.scss"
import { Filter, QualityReport, HourlyStatsTable, FrequentDefectsTable, EfficiencyChart, KeyStatsTable, HourlyProductionTable, ProgressCharts } from "../../components";
import { formatDate } from '../../utils/utils';

class Stitching extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filterDateTime: formatDate(new Date()),
			filterStyle: '',
		}
	}

	handleFilterDateChange = (event) => {
		this.setState({filterDateTime: event.target.value})
	}

	handleFilterStyleChange = (event) => {
		this.setState({filterStyle: event.target.value})
	}

	render() {
		let filterDateTime = new Date(this.state.filterDateTime)
		filterDateTime.setHours(23,59,59,999)
		if (this.state.filterDateTime === formatDate(new Date()))
			filterDateTime = new Date()
		return (
			<div className={styles.block}>
					<Filter
						filterDate={this.state.filterDateTime}
						filterStyle={this.state.filterStyle}
						handleFilterDateChange={this.handleFilterDateChange}
						handleFilterStyleChange={this.handleFilterStyleChange}
					/>
					{/* <div className={styles['metric-strips-cont']}>
						<MetricStrip items={[
							{"title": "Running Style", "body": "#3545"},
							{"title": "Style Category", "body": "Dress"},
							{"title": "Style Color", "body": "Floral Blue"},
							{"title": "Buyer Name", "body": "DIESEL"},
						]} />
						<MetricStrip items={[
							{"title": "Operators", "body": "31"},
							{"title": "Helpers", "body": "12"},
						]} />
						<MetricStrip items={[
							{"title": "Planned Target", "body": "4512"},
							{"title": "RTT", "body": "2318"},
							{"title": "Actual Production", "body": "2300"},
							{"title": "Variance", "body": "18"},
							{"title": "WIP", "body": "2212"},
							{"title": "Predicted Trend", "body": "2190"},
						]} />
					</div> */}
					<div className={styles['detail-cards-cont']}>
						<ProgressCharts filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
						<EfficiencyChart title="Efficiency" filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
						<QualityReport filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
						<FrequentDefectsTable filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
					</div>
					<HourlyProductionTable filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
					<HourlyStatsTable filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
					<KeyStatsTable filterDateTime={filterDateTime} filterStyle={this.state.filterStyle} />
			</div>
		);
	}
}

export default Stitching;