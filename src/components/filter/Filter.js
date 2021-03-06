import React, { Component } from 'react';
import { Card } from '..';
import styles from "./Filter.module.scss"
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class Filter extends Component {

	constructor(props) {
		super(props)
		this.state = {
			styles: [],
		}
	}

	componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    if (this.netReq) this.netReq.cancel()
  }

  fetchData = () => {
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(fetch(`${API_URL}/style/`, {headers: authHeader()}))
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          const styles = data.map((style) => [style.id, style.number])
          this.setState({
            styles: styles,
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
			<div className={styles.block}>
				<Card className={styles.card}>
					{/* <select className={styles.input}>
						<option value="#">Choose Line</option>
					</select> */}
					{/* <input className={styles.input} type="date" id="startDate" name="startDate" />
					<span>To</span> */}
					<label>Filter</label>
					<input
						className={styles.input}
						type="date"
						id="filterDate"
						name="filterDate"
						onChange={this.props.handleFilterDateChange}
						value={this.props.filterDate}
					/>
					{/* <select
						className={styles.input}
						onChange={this.props.handleFilterStyleChange}
						value={this.props.filterStyle}
						>
						<option value=''>
							Choose Style
						</option>
						{this.state.styles.map((style) => (
							<option key={style[0]} value={style.id}>{style[1]}</option>
						))}
					</select> */}
				</Card>
			</div>
		);
	}
}

export default Filter;