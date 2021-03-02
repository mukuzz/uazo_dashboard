import React, { Component } from 'react';
import { Table } from '..';
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class HourlyProductionTable extends Component {
  static contextType = EventSourceContext
  constructor(props) {
    super(props)
    this.state = {"headings": [], tableData: []}
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refresh()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.refresh)
  }

  componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.refresh)
    if (this.netReq) this.netReq.cancel()
	}
  
  componentDidUpdate(prevProps) {
    if (prevProps.filterDateTime !== this.props.filterDateTime) {
      this.refresh()
    }
  }

  refresh = () => {
    let filterDateTime = this.props.filterDateTime
    if (!filterDateTime) filterDateTime = new Date()
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/metric/hourly-production/?filterDateTime=${filterDateTime.toISOString()}`,
      {headers: authHeader()})
    )
    this.netReq.promise.then(res => {
      if (res.status !== 200) return []
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          if (data.headings && data.tableData) {
            this.setState({
              headings: data.headings,
              tableData: data.tableData
            })
          }
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }
      
  render() {
    return (
      <Table
        hideConcurrentSameSrNo={false}
        tableName="Hourly Production"
        headings={this.state.headings}
        tableData={this.state.tableData}
      />
    );
  }
}

export default HourlyProductionTable;