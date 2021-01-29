import React, { Component } from 'react';
import styles from './Table.module.scss';
import { Card } from "..";

class Table extends Component {
	render() {
		return (
				<Card>
					<div className={styles['title-cont']}>
						<h2 className={styles.title}>{this.props.tableName}</h2>
					</div>
					<div className={styles['table-cont']}>
						<table className={styles.table}>
							{
								this.props.headings !== undefined
								? <thead className={styles.heading}>
										<tr>{this.props.headings.map((heading, index) => {
											return <th key={index}>{heading}</th> })}</tr>
									</thead>
								: false
							}
							<tbody>
								{this.props.items.map((row, index) => {
									return (
										<tr key={index} className={styles.row}>
											{row.map((item, index) => {
												return <td key={index}>{item}</td>
											})}
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</Card>
			);
		}
	}
	
	export default Table;