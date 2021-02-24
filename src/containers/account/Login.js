import React, { Component } from 'react';
import { makeCancelable } from '../../utils/utils';
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { LoggedInUserContext } from '../../context';
import styles from "./Login.module.scss";
import { Card } from '../../components';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUnlockAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

library.add([faUnlockAlt, faEnvelope])

const API_URL = process.env.REACT_APP_SERVER_URL + '/api'

class Login extends Component {
  static contextType = LoggedInUserContext
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  componentWillUnmount() {
    if (this.netReq) this.netReq.cancel()
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }
  
  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.netReq) this.netReq.cancel()
    this.netReq = makeCancelable(fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': this.state.username,
        'password': this.state.password,
      })
    }))
    this.netReq.promise
    .then(
      (res) => {
        if (res.status !== 200) {
          this.setState({
            message: "Wrong username or password"
          })
        } else {
          res.json().then(
            (data => {
              if ("token" in data) {
                // TODO: Secure attribute doesn't allow the cookie to be set
                Cookies.set('token', data.token, {sameSite: true})}
                const {setLoggedInUser} = this.context
                // TODO
                setLoggedInUser({'name':'Mukul'})
                this.props.history.push('/')
            })
          )
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  render() {
    return (
      <div className={styles.block}>
        <div className={styles.content}>
          <Card className={styles.card}>
            <div className={styles.title}>
              <h3>Login to Uazo</h3>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className={styles['form-group']}>
                <label>Your Username</label>
                <div className={styles['input-group']}>
                  <span>
                    <svg class="fas fa-envelope"></svg>
                  </span>
                  <input type="text" value={this.state.username} placeholder="Username" onChange={this.handleUserNameChange} />
                </div>
              </div>
              <div className={styles['form-group']}>
                <label>Your Password</label>
                <div className={styles['input-group']}>
                  <span>
                    <svg class="fas fa-unlock-alt"></svg>
                  </span>
                  <input type="password" value={this.state.password} placeholder="Password" onChange={this.handlePasswordChange} />
                </div>
              </div>
              <span className={styles.message}>{this.state.message}</span>
              <button className={styles.submit} >Login</button>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);