import React, { Component } from 'react';
import styles from "./ProfileSmall.module.scss"
import { LoggedInUserContext } from "../../context";
import { Link } from "react-router-dom";

class ProfileSmall extends Component {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef()
  }

  render() {
    return (
      <LoggedInUserContext.Consumer>
        {({user}) => (
          user
          ? <div className={styles.block}>
              <Link to="/settings">
                <div className={styles.content}>
                  <div className={styles.img}>
                    {
                    user.image
                    // eslint-disable-next-line jsx-a11y/alt-text
                    ? <img ref={this.imgRef} src={user.image} draggable="false" onError={() => this.imgRef.current.style.display="none"} />
                    : <span className="fas fa-user-alt"></span>
                    }
                  </div>
                  {user.name ? <span className={styles.name}>{user.name}</span> : ''}
                </div>
              </Link>
            </div>
          : ''
        )}
      </LoggedInUserContext.Consumer>
    );
  }
}

export default ProfileSmall;