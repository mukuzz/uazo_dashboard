import React, { Component } from 'react';
import { Table } from '..';
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class KeyStatsTable extends Component {
  static contextType = EventSourceContext
  constructor(props) {
    super(props)
    this.state = {"headings": [
      "Hour", "Output", "Target", "Variance", "DHU",
      "Efficiency", "Defective", "Rectified" , "Alter", "Style", "Buyer"
    ], data: []}
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refresh()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.refresh)
  }

  componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.refresh)
    // if (this.netReq) this.netReq.cancel()
	}

  refresh = () => {
    // if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(fetch(`${API_URL}/production-session/active/`, {headers: authHeader()}))
    this.netReq.promise.then(res => {
      if (res.status !== 200) return []
      return res.json()
    })
    .then(
      async (data) => {
        const netReq = this.netReq
        await data.every(async prod_sess => {
          let prod_stats
          try {
            // TODO: Is accessing hasCanceled_ OK
            // if (netReq.hasCanceled_) return false // Stop loop
            const res = await fetch(`${API_URL}/production-session/${prod_sess.id}/hourly-stats/`, {headers: authHeader()})
            prod_stats = await res.json()
          } catch (error) {
            console.error(error)
            return
          }
          console.log(prod_stats)
          const data = prod_stats.map((stats) => {
            return [
              this.fmt(stats.hour),
              this.fmt(stats.output),
              this.fmt(stats.target),
              this.fmt(stats.target - stats.output),
              this.fmt(this.fmtFloat(stats.dhu)),
              this.fmt(this.fmtFloat(stats.line_efficiency)),
              this.fmt(stats.defective),
              this.fmt(stats.rectified),
              this.fmt(stats.rejected),
              this.fmt(stats.style_number),
              this.fmt(stats.buyer)
            ]
          })
          this.setState({
            data: data
          })
          return false;
        });
      },
      (error) => {
        console.error(error)
      }
    )
  }

  fmt(str) {
    if (str === 0) str = "0"
    str = str || '-'
    return str.toLocaleString()
  }

  fmtFloat(num) { if (num !== undefined) return parseFloat(num).toFixed(2) }
      
  render() {
    // let tableData = []
    // for (const property in this.state) {
    //   if (property === "headings") continue
    //   tableData.push(this.state[property])
    // }
    // tableData = tableData.sort((a,b) => a[0] - b[0])
    return (
      <Table
        hideConcurrentSameSrNo={true}
        tableName="Key Statistics"
        headings={this.state.headings}
        tableData={this.state.data}
      />
    );
  }
}

export default KeyStatsTable;