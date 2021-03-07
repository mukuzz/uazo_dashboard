import React, { Component } from 'react';

class PassPropsToChildren extends Component {
  render() {
    const childrenWithProps = React.Children.map(this.props.children, child => {
			if (React.isValidElement(child)) {
        return React.cloneElement(child, { passedProps: this.props.passedProps });
      }
      return child;
		})
    return (
      <div className={this.props.className}>
        {childrenWithProps}
      </div>
    );
  }
}

export default PassPropsToChildren;