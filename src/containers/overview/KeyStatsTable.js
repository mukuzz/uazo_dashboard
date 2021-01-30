import React, { Component } from 'react';
import { Table } from '../../components';

const API_URL = "http://localhost:8000/api"

class KeyStatsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {"headings": [
      "line", "Shift", "Production", "Target", "Variance", "DHU", "FTT",
      "Efficiency", "RTT", "Operators", "Helpers", "Style", "Buyer"
    ]}
    this.refreshStats = this.refreshStats.bind(this)
    this.shouldRefresh = true;
  }

  componentDidMount() {
    this.refreshStats()
    setInterval(this.refreshStats, 1000)   
  }

  refreshStats() {
    if (this.shouldRefresh) {
      this.shouldRefresh = false;
      fetch(`${API_URL}/production-session/active/`)
      .then(res => res.json())
      .then(
        async (data) => {
          await data.forEach(async prod_sess => {
            let prod_stats
            try {
              const res = await fetch(`${API_URL}/production-session/${prod_sess.id}/stats`)
              prod_stats = await res.json()
            } catch (error) {
              console.error(error)
              return
            }
            this.setState({
              [prod_sess.id]: [
                prod_sess.line_number || '-', prod_stats.shift || '-',
                prod_stats.output || '-', prod_sess.target || '-',
                this.fmtFloat(prod_stats.variance) || '-', this.fmtFloat(prod_stats.dhu) || '-',
                this.fmtFloat(prod_stats.ftt_rate) || '-', this.fmtFloat(prod_stats.line_efficiency) || '-',
                this.fmtFloat(prod_stats.rtt) || '-',
                prod_sess.operators || '-', prod_sess.helpers || '-',
                prod_stats.style_number || '-', prod_stats.buyer || '-'
              ]
            })
          });
          this.shouldRefresh = true;
        },
        (error) => {
          console.log(error)
          this.shouldRefresh = true;
        }
      )
    }
  }

  fmtFloat(num) { if (num !== undefined) return parseFloat(num).toFixed(2) }
      
  render() {
    let tableData = []
    let last_line_number = ''
    for (const property in this.state) {
      if (property === "headings") continue
      const row = this.state[property]
      if (last_line_number === row[0]) row[0] = ''
      tableData.push(row)
      last_line_number = row[0]
    }
    tableData.sort((a,b) => a.line_number - b.line_number)
    return (
      <Table
        tableName="Key Statistics"
        headings={this.state.headings}
        items={tableData}
      />
    );
  }
}

export default KeyStatsTable;