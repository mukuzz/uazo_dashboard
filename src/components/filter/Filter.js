import React, { Component } from 'react';
import { Card } from '..';
import styles from "./Filter.module.scss"

class Filter extends Component {
	render() {
		return (
			<div className={styles.block}>
				<Card className={styles.card}>
					<select className={styles.input}>
						<option value="#">Choose Line</option>
					</select>
					<select className={styles.input}>
						<option value="#">Choose Style</option>
					</select>
					<input className={styles.input} type="date" id="startDate" name="startDate" />
					<span>To</span>
					<input className={styles.input} type="date" id="endDate" name="endDate" />
				</Card>
			</div>
		);
	}
}

export default Filter;