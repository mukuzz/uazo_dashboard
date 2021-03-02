import React, { Component } from 'react';
import { Table } from '..';
import styles from './FrequentDefectsTable.module.scss'
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class FrequentDefectsTable extends Component {
  static contextType = EventSourceContext
  constructor(props){
    super(props)
    this.state = {
      headings: ['Defect', 'Frequency'],
      data: [],
    }
  }
  
	componentDidMount() {
    this.fetchData()
		this.eventSource = this.context
    this.eventSource.addEventListener("newQcInput", this.fetchData)
  }

  componentWillUnmount() {
		this.eventSource.removeEventListener("newQcInput", this.fetchData)
    if (this.netReq) this.netReq.cancel()
	}

  componentDidUpdate(prevProps) {
    if (prevProps.filterDateTime !== this.props.filterDateTime) {
      this.fetchData()
    }
  }

  fetchData = () => {
    let filterDateTime = this.props.filterDateTime
    if (!filterDateTime) filterDateTime = new Date()
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/metric/frequent-defects/?filterDateTime=${filterDateTime.toISOString()}`,
      {headers: authHeader()})
    )
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          const tableData = []
          data.data.forEach(def => {
            const def_name = <div className={styles['def-name']}><h3>{def.operation}</h3><p>{def.defect}</p></div>
            tableData.push([def_name, def.freq])
          });
          this.setState({
            data: tableData,
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
      <Table
        hideConcurrentSameSrNo={false}
        tableName="Frequent Defects"
        headings={this.state.headings}
        tableData={this.state.data}
      />
    );
  }
}

export default FrequentDefectsTable;