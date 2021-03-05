import React, { Component } from 'react';
import styles from "./ProfileSmall.module.scss"
import { LoggedInUserContext } from "../../context";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { makeCancelable, authHeader } from '../../utils/utils';

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class ProfileSmall extends Component {
  static contextType = LoggedInUserContext
  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
    this.imgRef = React.createRef()
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillUnmount() {
    if (this.netReq) this.netReq.cancel()
	}

  fetchData = () => {
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(
      fetch(`${API_URL}/user/`,
      {headers: authHeader()})
    )
    this.netReq.promise.then(res => {
      if (res.status === 200) return res.json()
      else if (res.status === 401) {
        Cookies.remove('token')
        const {setUserLogInState} = this.context
        setUserLogInState(false)
        return null
      }
      else return null
    })
    .then(
      (data) => {
        if (data && data.username) {
          this.setState({
            user: data,
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
      <LoggedInUserContext.Consumer>
        { ({loggedIn}) => {
          const user = this.state.user
          return (
            <div className={styles.block}>
              <Link to="/settings">
                <div className={styles.content}>
                  <div className={styles.img}>
                    { loggedIn && user && user.image
                    ? // eslint-disable-next-line jsx-a11y/alt-text
                      <img ref={this.imgRef} src={user.image} draggable="false" onError={() => this.imgRef.current.style.display="none"} />
                    : <span className="fas fa-user-alt"></span> }
                  </div>
                  { loggedIn && user && user.username ? <span className={styles.name}>{user.username}</span> : '' }
                </div>
              </Link>
            </div>
          )
        }}
      </LoggedInUserContext.Consumer>
    );
  }
}

export default ProfileSmall;