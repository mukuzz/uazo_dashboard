import React, { Component } from 'react';
import { Card } from '..';
import styles from "./Filter.module.scss"
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class Filter extends Component {

	constructor(props) {
		super(props)
		this.state = {
			orders: [],
			styles: [],
			lines: [],
		}
	}

	componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
		if (this.ordersNetReq) this.ordersNetReq.cancel()
		if (this.styleNetReq) this.styleNetReq.cancel()
		if (this.lineNetReq) this.lineNetReq.cancel()
  }

  fetchData = () => {
    this.fetchOrders()
		this.fetchStyles()
		this.fetchLines()
  }

	fetchOrders = () => {
		if (this.ordersNetReq) this.ordersNetReq.cancel()
    this.ordersNetReq = makeCancelable(fetch(`${API_URL}/production-order/`, {headers: authHeader()}))
    this.ordersNetReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          const orders = data.map((order) => [order.id, order.order_number])
          this.setState({
            orders: orders,
          })
        }
      },
      (error) => {
        console.error(error)
      }
    )
	}

	fetchStyles = () => {
    if (this.styleNetReq) this.styleNetReq.cancel()
    this.styleNetReq = makeCancelable(fetch(`${API_URL}/style/`, {headers: authHeader()}))
    this.styleNetReq.promise.then(res => {
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

	fetchLines = () => {
    if (this.lineNetReq) this.lineNetReq.cancel()
    this.lineNetReq = makeCancelable(fetch(`${API_URL}/line/`, {headers: authHeader()}))
    this.lineNetReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          const lines = data.map((line) => [line.id, line.number])
          this.setState({
            lines: lines,
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
					<input
						className={styles.input}
						type="date"
						name="filterStartDate"
						onChange={this.props.handleFilterStartDateChange}
						value={this.props.filterStartDate}
					/>
					<span>To</span>
					<input
						className={styles.input}
						type="date"
						name="filterEndDate"
						onChange={this.props.handleFilterEndDateChange}
						value={this.props.filterEndDate}
					/>
					<select
						className={styles.input}
						onChange={this.props.handleFilterOrderChange}
						value={this.props.filterOrder}
						>
						<option value="">Choose Order</option>
						{this.state.orders.map((order) => (
							<option key={order[0]} value={order[0]}>{order[1]}</option>
						))}
					</select>
					<select
						className={styles.input}
						onChange={this.props.handleFilterStyleChange}
						value={this.props.filterStyle}
						>
						<option value="">Choose Style</option>
						{this.state.styles.map((style) => (
							<option key={style[0]} value={style[0]}>{style[1]}</option>
						))}
					</select>
					<select
						className={styles.input}
						onChange={this.props.handleFilterLineChange}
						value={this.props.filterLine}
						>
						<option value="">Choose Line</option>
						{this.state.lines.map((line) => (
							<option key={line[0]} value={line[0]}>{line[1]}</option>
						))}
					</select>
				</Card>
			</div>
		);
	}
}

export default Filter;