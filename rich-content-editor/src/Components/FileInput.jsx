import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { mergeStyles } from '~/Utils';

import styles from '~/Styles/global.scss';

class FileInput extends Component {

  static id = 1;

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = { focused: false };
    this.id = `file_input_${++FileInput.id}`;
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  preventBubblingUp = event => event.preventDefault();

  renderInput() {
    const { onChange, accept, multiple, className, title, children, dataHook } = this.props;
    const hasMultiple = multiple ? { multiple } : {};
    const { styles } = this;
    return (
      <label
        htmlFor={this.id} tabIndex={-1} className={classnames({ [className]: true, [styles.focused]: this.state.focused })}
        style={this.props.style} title={title}
      >
        <input
          className={styles.visuallyHidden}
          id={this.id}
          type={'file'}
          data-hook={dataHook} onChange={onChange}
          accept={accept}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          tabIndex="0"
          {...hasMultiple}
        />
        {children}
      </label>
    );
  }

  renderButton() {
    const { handleFileSelection, multiple, className, title, children, dataHook } = this.props;
    const onClick = () => handleFileSelection(multiple);
    return (
      <label
        className={className}
        htmlFor={this.id}
        style={this.props.style}
        title={title}
      >
        <button
          id={this.id}
          data-hook={dataHook} onClick={onClick}
        >
          {children}
        </button>
      </label>
    );

  }

  render() {
    const { handleFileSelection } = this.props;
    return handleFileSelection ? this.renderButton() : this.renderInput();
  }

}

FileInput.propTypes = {
  accept: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  handleFileSelection: PropTypes.func,
  children: PropTypes.node,
  multiple: PropTypes.bool,
  title: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.object,
  dataHook: PropTypes.string,
};

FileInput.defaultProps = {
  accept: 'image/*',
  multiple: false
};

export default FileInput;
