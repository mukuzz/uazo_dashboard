import React, { Component } from 'react';
import styles from "./Settings.module.scss";
import { LogoutButton } from '..';

class Settings extends Component {
    render() {
        return (
            <div className={styles.block}>
                <div className={styles['account-options']}>
                    <h1>Account Settings</h1>
                    <LogoutButton />
                </div>
            </div>
        );
    }
}

export default Settings;