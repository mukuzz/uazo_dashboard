import React, { Component } from 'react';
import { Table } from '..';
import styles from './FrequentDefectsTable.module.scss'

const API_URL = process.env.REACT_APP_API_URL

class FrequentDefectsTable extends Component {
  constructor(props){
    super(props)
    this.state = {
      headings: ['Defect', 'Frequency'],
      data: [],
    }
    this.fetchData = this.fetchData.bind(this)
		this.shouldRefresh = true;
  }
  
	componentDidMount() {
    this.fetchData()
  }

  fetchData() {
		if (this.shouldRefresh) {
			this.shouldRefresh = false
			fetch(`${API_URL}/defect/most-frequent/`)
      .then(res => {
        if (res.status !== 200) return null
        return res.json()
      })
      .then(
        (data) => {
          if (data) {
            const tableData = []
            data.data.forEach(def => {
              const def_name = <div className={styles['def-name']}><h3>{def.operation}</h3><p>{def.defect}</p></div>
              tableData.push([def_name, def.count])
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
      .finally(() => {
        this.shouldRefresh = true
      })
    }
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