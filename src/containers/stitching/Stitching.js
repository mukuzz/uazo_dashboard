import React, { Component } from 'react';
import styles from "./Stitching.module.scss"
import { Filter, QualityReport, HourlyStatsTable, FrequentDefectsTable, EfficiencyChart, KeyStatsTable, HourlyProductionTable, ProgressCharts } from "../../components";
import { formatDate } from '../../utils/utils';

class Stitching extends Component {
	constructor(props) {
		super(props)
		this.state = {
			filterStartDate: formatDate(new Date()),
			filterEndDate: formatDate(new Date()),
			filterOrder: '',
			filterStyle: '',
			filterLine: '',
		}
	}

	handleFilterStartDateChange = (event) => {
		let filterStartDate = event.target.value
		let filterEndDate = this.state.filterEndDate
		if ((new Date(filterStartDate) > (new Date(filterEndDate))))
			filterEndDate = filterStartDate
		this.setState({
			filterStartDate: filterStartDate,
			filterEndDate: filterEndDate
		})
	}

	handleFilterEndDateChange = (event) => {
		let filterStartDate = this.state.filterStartDate
		let filterEndDate = event.target.value
		if ((new Date(filterEndDate) < (new Date(filterStartDate))))
			filterStartDate = filterEndDate
		this.setState({
			filterStartDate: filterStartDate,
			filterEndDate: filterEndDate
		})
	}

	handleFilterOrderChange = (event) => {
		this.setState({filterOrder: event.target.value})
	}

	handleFilterStyleChange = (event) => {
		this.setState({filterStyle: event.target.value})
	}

	handleFilterLineChange = (event) => {
		this.setState({filterLine: event.target.value})
	}

	render() {
		const progressChartOptions = [
      {
        uri: "/metric/orders-progress/",
        name: "Orders",
        affectMetricsByTime: true,
      },
      {
        uri: "/metric/styles-progress/",
        name: "Styles",
        affectMetricsByTime: true,
      },
      {
        uri: "/metric/lines-progress/",
        name: "Lines",
        affectMetricsByTime: true,
      },
    ]
		return (
			<div className={styles.block}>
					<Filter
						filterStartDate={this.state.filterStartDate}
						filterEndDate={this.state.filterEndDate}
						filterOrder={this.state.filterOrder}
						filterStyle={this.state.filterStyle}
						filterLine={this.state.filterLine}
						handleFilterStartDateChange={this.handleFilterStartDateChange}
						handleFilterEndDateChange={this.handleFilterEndDateChange}
						handleFilterOrderChange={this.handleFilterOrderChange}
						handleFilterStyleChange={this.handleFilterStyleChange}
						handleFilterLineChange={this.handleFilterLineChange}
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
						<ProgressCharts chartOptions={progressChartOptions} filter={this.state} />
						<EfficiencyChart title="Efficiency" filter={this.state} />
						<QualityReport filter={this.state} />
						<FrequentDefectsTable filter={this.state} />
					</div>
					{this.state.filterStartDate === this.state.filterEndDate ? <HourlyProductionTable filter={this.state} /> : ''}
					{this.state.filterStartDate === this.state.filterEndDate ? <HourlyStatsTable filter={this.state} /> : ''}
					<KeyStatsTable filter={this.state} />
			</div>
		);
	}
}

export default Stitching;