import React, { Component } from 'react';
import { TitledCard } from '..';
import styles from "./QualityReport.module.scss"
import { EventSourceContext } from "../../context";
import { makeCancelable, authHeader, getUrlParamsStringFromFilter } from "../../utils/utils";

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

const ReportItem = ({title, metric, metricPer, color, hoverText}) => {
  return (
    <div title={hoverText} className={styles['report-item']}>
      <h3 style={{
        color: color,
        borderBottom: hoverText ? "1px dotted black": "none",
      }}>{title}</h3>
      <h4>{metric}</h4>
      <h4>{metricPer}</h4>
    </div>
  )
}

class QualityReport extends Component {
  static contextType = EventSourceContext
  chartRef = React.createRef()

  constructor(props){
    super(props)
    this.state = {
      ftt: 0,
      defective: 0,
      rectified: 0,
      rejected: 0,
      fttPercentage: "0.00%",
      defectivePercentage: "0.00%",
      rectifiedPercentage: "0.00%",
      rejectedPercentage: "0.00%",
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
    if (prevProps !== this.props) {
      this.fetchData()
    }
  }

  fetchData = () => {
    const urlParams = getUrlParamsStringFromFilter(this.props.filter)
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/metric/qc-actions/${urlParams}`,
      {headers: authHeader()})
    )
    this.netReq.promise.then(res => {
      if (res.status !== 200) return null
      return res.json()
    })
    .then(
      (data) => {
        if (data) {
          this.setState({
            ftt: data.ftt,
            defective: data.defective,
            rectified: data.rectified,
            rejected: data.rejected,
            fttPercentage: data.ftt_percentage,
            defectivePercentage: data.defective_percentage,
            rectifiedPercentage: data.rectified_percentage,
            rejectedPercentage: data.rejected_percentage,
          })
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  render() {
    const content = (
      <div className={styles.block}>
        <ReportItem title="Pass" metric={this.state.ftt} metricPer={this.state.fttPercentage} color="#008450" />
        <ReportItem title="Defective" metric={this.state.defective} metricPer={this.state.defectivePercentage} color="#EFB700" />
        <ReportItem title="Rectified" metric={this.state.rectified} metricPer={this.state.rectifiedPercentage} color="#336dc4" hoverText="Percentage of defective rectified" />
        {/* <ReportItem title="Rejected" metric={this.state.rejected} metricPer={this.state.rejectedPercentage} color="#B81D13" /> */}
      </div>
    )
    return (
      <TitledCard title="Quality Report" content={content} />
    );
  }
}

export default QualityReport;