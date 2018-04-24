import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from '~/Styles/tabs.scss';
import { mergeStyles } from '~/Utils/mergeStyles';

const tabPropTypes = {
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export class Tab extends Component {
  static propTypes = {
    ...tabPropTypes,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  render = () => this.props.selected &&
    <div
      role="tabPanel"
      key={this.props.value}
      className={this.styles.tabs_panel}
    >{this.props.children}
    </div>;
}

export class Tabs extends Component {
  static propTypes = tabPropTypes;

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = { activeTab: props.value };
  }

  getTabHeaders = tabs => React.Children.map(tabs, tab => ({ label: tab.props.label, value: tab.props.value }));

  renderTabs = () => React.Children.map(this.props.children, tab => React.cloneElement(tab, {
    selected: this.state.activeTab === tab.props.value,
  }));

  render() {
    const { styles, props } = this;
    const headers = this.getTabHeaders(props.children);

    return (
      <div role="tablist" className={styles.tabs}>
        <div className={styles.tabs_headers}>
          {headers.map(({ label, value }) => {
            return (
              <a
                role="tab"
                tabIndex={0}
                name={`tabs`}
                key={value}
                className={classnames(styles.tabs_headers_option, value === this.state.activeTab ? styles.tabs_headers_option_selected : '')}
                data-hook={`${value}_Tab`} onClick={() => {
                  this.setState({ activeTab: value });
                  this.renderTabs();
                }}
              >
                <span className={this.styles.tabs_headers_option_label}>{label}</span>
              </a>);
          })}
        </div>
        {this.renderTabs()}
      </div>
    );
  }
}
