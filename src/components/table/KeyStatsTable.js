import React, { Component } from 'react';
import { Table } from '..';
import { EventSourceContext } from "../../context";

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class KeyStatsTable extends Component {
  static contextType = EventSourceContext
  constructor(props) {
    super(props)
    this.state = {"headings": [
      "line", "Shift", "Target", "Production", "RTT", "Variance", "Projected", "DHU",
      "Efficiency", "Defective", "Rectified" , "Rejected" ,"Operators", "Helpers", "Style", "Buyer"
    ]}
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refresh()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.refresh)
  }

  componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.refresh)
	}

  refresh = () => {
    if (this.shouldRefresh) {
      this.shouldRefresh = false;
      fetch(`${API_URL}/production-session/active/`)
      .then(res => {
        if (res.status !== 200) return []
        return res.json()
      })
      .then(
        async (data) => {
          await data.forEach(async prod_sess => {
            let prod_stats
            try {
              const res = await fetch(`${API_URL}/production-session/${prod_sess.id}/stats/`)
              prod_stats = await res.json()
            } catch (error) {
              console.error(error)
              return
            }
            this.setState({
              [prod_sess.id]: [
                this.fmt(prod_sess.line_number), this.fmt(prod_stats.shift),
                this.fmt(prod_sess.target), this.fmt(prod_stats.output),
                this.fmt(prod_stats.rtt), this.fmt(prod_stats.rtt - prod_stats.output),
                this.fmt(prod_stats.projected_output), this.fmt(this.fmtFloat(prod_stats.dhu)),
                this.fmt(this.fmtFloat(prod_stats.line_efficiency)), this.fmt(prod_stats.defective),
                this.fmt(prod_stats.rectified), this.fmt(prod_stats.rejected), this.fmt(prod_sess.operators),
                this.fmt(prod_sess.helpers), this.fmt(prod_stats.style_number), this.fmt(prod_stats.buyer)
              ]
            })
          });
        },
        (error) => {
          console.error(error)
        }
      )
      .finally(() => {
        this.shouldRefresh = true
      })
    }
  }

  fmt(str) {
    if (str === 0) str = "0"
    str = str || '-'
    return str.toLocaleString()
  }

  fmtFloat(num) { if (num !== undefined) return parseFloat(num).toFixed(2) }
      
  render() {
    let tableData = []
    for (const property in this.state) {
      if (property === "headings") continue
      tableData.push(this.state[property])
    }
    tableData = tableData.sort((a,b) => a[0] - b[0])
    return (
      <Table
        hideConcurrentSameSrNo={true}
        tableName="Key Statistics"
        headings={this.state.headings}
        tableData={tableData}
      />
    );
  }
}

export default KeyStatsTable;