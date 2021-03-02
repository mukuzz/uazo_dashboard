import React, { Component } from 'react';
import { Card } from '..';
import styles from "./Filter.module.scss"

class Filter extends Component {
	render() {
		return (
			<div className={styles.block}>
				<Card className={styles.card}>
					{/* <select className={styles.input}>
						<option value="#">Choose Line</option>
					</select>
					<select className={styles.input}>
						<option value="#">Choose Style</option>
					</select> */}
					{/* <input className={styles.input} type="date" id="startDate" name="startDate" />
					<span>To</span> */}
					<label>Filter By Date</label>
					<input
						className={styles.input}
						type="date"
						id="filterDate"
						name="filterDate"
						onChange={this.props.handleFilterDateChange}
						value={this.props.filterDate}
					/>
				</Card>
			</div>
		);
	}
}

export default Filter;