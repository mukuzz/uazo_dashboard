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
const COOKIE_SECURE = process.env.REACT_APP_COOKIE_SECURE

class Login extends Component {
  static contextType = LoggedInUserContext
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      message: '',
      processing: false,
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
    this.setState({message: '', processing: true})
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
            message: "Wrong Username or Password"
          })
        } else {
          res.json().then(
            (data => {
              if ("token" in data) {
                // TODO: Secure attribute doesn't allow the cookie to be set without https
                Cookies.set('token', data.token, {expires: 365, sameSite: 'Lax', secure: COOKIE_SECURE === 'true'})
                const {setUserLogInState} = this.context
                setUserLogInState(true)
                this.props.history.push('/')
              }
            })
          )
        }
      },
      (error) => {
        this.setState({message: 'Some error occurred'})
      }
    )
    .finally(() => this.setState({processing: false}));
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
                    <svg className="fas fa-envelope"></svg>
                  </span>
                  <input type="text" required value={this.state.username} placeholder="Username" onChange={this.handleUserNameChange} />
                </div>
              </div>
              <div className={styles['form-group']}>
                <label>Your Password</label>
                <div className={styles['input-group']}>
                  <span>
                    <svg className="fas fa-unlock-alt"></svg>
                  </span>
                  <input type="password" required value={this.state.password} placeholder="Password" onChange={this.handlePasswordChange} />
                </div>
              </div>
              <span className={styles.message}>{this.state.message}</span>
              <button className={styles.submit} >
                { this.state.processing ? <svg version="1.0" width="18px" height="18px" viewBox="0 0 128 128"><g><circle cx="16" cy="64" r="16" fill="#000000"/><circle cx="16" cy="64" r="16" fill="#555555" transform="rotate(45,64,64)"/><circle cx="16" cy="64" r="16" fill="#949494" transform="rotate(90,64,64)"/><circle cx="16" cy="64" r="16" fill="#cccccc" transform="rotate(135,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(180,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(225,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(270,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" transform="rotate(315,64,64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg> : '' }
                Login
              </button>
            </form>
          </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);