import React, { Component } from 'react';
import styles from "./LogoutButton.module.scss";
import Cookies from "js-cookie";
import { LoggedInUserContext } from '../../context';

class LogoutButton extends Component {
  static contextType = LoggedInUserContext
  render() {
    return (
      <button className={styles.block} onClick={() => {
        Cookies.remove('token')
        const {setLoggedInUser} = this.context
        setLoggedInUser(null)
      }}>Logout</button>
    );
  }
}

export default LogoutButton;