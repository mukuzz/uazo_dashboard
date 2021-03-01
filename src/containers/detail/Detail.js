import React, { Component } from 'react';
import styles from "./Detail.module.scss"
import { Filter, MetricStrip, QualityReport, HourlyStatsTable } from "../../components";

class Detail extends Component {
	render() {
		return (
			<div className={styles.block}>
					<Filter />
					<MetricStrip items={[
						{"title": "Running Style", "body": "#3545"},
						{"title": "Production Order", "body": "#112"},
						{"title": "Buyer Name", "body": "DIESEL"},
						{"title": "Style Color", "body": "Floral Blue"},
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
					<QualityReport />
					<HourlyStatsTable />
			</div>
		);
	}
}

export default Detail;