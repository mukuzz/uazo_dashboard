import React, { Component } from 'react';
import { Table } from '..';
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class KeyStatsTable extends Component {
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
      fetch(`${API_URL}/metric/key-stats/?filterDateTime=${filterDateTime.toISOString()}`,
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
        hideConcurrentSameSrNo={true}
        tableName="Key Statistics"
        headings={this.state.headings}
        tableData={this.state.tableData}
      />
    );
  }
}

export default KeyStatsTable;

// fmt(str) {
//   if (str === 0) str = "0"
//   str = str || '-'
//   return str.toLocaleString()
// }

// fmtFloat(num) { if (num !== undefined) return parseFloat(num).toFixed(2) }