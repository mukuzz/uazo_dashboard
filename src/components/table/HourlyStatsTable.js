import React, { Component } from 'react';
import { Table } from '..';
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader, getUrlParamsStringFromFilter } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class HourlyStatsTable extends Component {
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
    if (prevProps !== this.props) {
      this.refresh()
    }
  }

  refresh = () => {
    const urlParams = getUrlParamsStringFromFilter(this.props.filter)
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/metric/hourly-stats/${urlParams}`,
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
            const headings = data.headings.map((heading) => {
              return heading.replaceAll("_", " ").toUpperCase()
            })
            this.setState({
              headings: headings,
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
        tableName="Hourly Statistics"
        headings={this.state.headings}
        tableData={this.state.tableData}
      />
    );
  }
}

export default HourlyStatsTable;