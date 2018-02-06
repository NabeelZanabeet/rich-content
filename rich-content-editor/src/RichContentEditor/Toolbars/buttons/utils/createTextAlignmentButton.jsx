import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextButton from '../TextButton';

export default ({ alignment, Icon }) =>
  class TextAlignmentButton extends Component {
    static propTypes = {
      alignment: PropTypes.string,
      onClick: PropTypes.func,
      theme: PropTypes.object,
    };

    isActive = () => this.props.alignment === alignment;

    handleClick = () => this.props.onClick && this.props.onClick(alignment);

    render() {
      const { theme } = this.props;
      return (
        <TextButton
          icon={Icon}
          theme={theme}
          isActive={this.isActive}
          onClick={this.handleClick}
        />
      );
    }
  };
