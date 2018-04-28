import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { mergeStyles } from '~/Utils';
import CheckIcon from '~/Components/icons/check.svg';
import styles from '~/Styles/checkbox.scss';

export default class Checkbox extends React.Component {

  static propTypes = {
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    dataHook: PropTypes.string,
  };

  static id = 0;

  static defaultProps = {
    checked: false
  };

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = { focused: false };
    this.id = `chk_${++Checkbox.id}`;
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onBlur() {
    this.setState({ focused: false });
  }

  render() {
    const { styles } = this;
    const { onChange, label, checked, dataHook } = this.props;
    const isChecked = checked ? { checked: 'checked' } : {};
    const a11yProps = {
      'aria-label': label,
      'aria-checked': checked,
      role: 'checkbox'
    };

    return (
      <label htmlFor={this.id} className={classnames({ [styles.checkbox]: true, [styles.checkbox_focused]: this.state.focused })}>
        <input
          id={this.id}
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          tabIndex="0"
          {...a11yProps}
          className={styles.checkbox_input} type={'checkbox'} data-hook={dataHook} onChange={onChange} {...isChecked}
        />
        <i className={classnames(styles.checkbox_icon, checked ? styles.checkbox_icon_checked : styles.checkbox_icon_unchecked)}>
          {checked && <CheckIcon className={styles.checkbox_check}/>}
        </i>
        <span className={styles.checkbox_label}>{label}</span>
      </label>
    );
  }
}
