import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { mergeStyles } from '../Utils/mergeStyles';
import styles from '~/Styles/selection-list.scss';

function defaultDataMapper(item) {
  switch (typeof item) {
    case 'number':
      return { value: item, label: item.toString() };
    case 'string':
      return { value: item, label: item };
    case 'object':
      return item;
    default:
      return {};
  }
}

function defaultRenderItem({ option, selected }) {
  return option && option.value && (
    <SelectionListOption selected={selected} value={option.value} theme={{}} data-hook={option.value} onChange={() => {}}>
      {option.value}
    </SelectionListOption>);
}

class SelectionList extends Component {

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    dataMapper: PropTypes.func,
    renderItem: PropTypes.func,
    theme: PropTypes.object.isRequired,
    className: PropTypes.string,
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    optionClassName: PropTypes.string,
  };

  static defaultProps = {
    dataMapper: defaultDataMapper,
    renderItem: defaultRenderItem
  };

  mapItemToOptionData(item) {
    const option = this.props.dataMapper(item);
    return {
      item,
      option,
      selected: option.value === this.props.value
    };
  }

  render() {
    const { dataSource, className, onChange, renderItem, theme, optionClassName } = this.props;
    return (
      <div role="listbox" className={classnames(styles.selectionList, className)}>
        {dataSource.map(item => this.mapItemToOptionData(item))
          .map(({ item, option, selected }, i) => (
            <SelectionListOption
              selected={selected}
              dataHook={item.dataHook} onChange={onChange} key={i} theme={theme} value={option.value} optionClassName={optionClassName}
            >
              {renderItem({ item, option, selected })}
            </SelectionListOption>)
          )}
      </div>);
  }
}

class SelectionListOption extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    value: PropTypes.any.isRequired,
    optionClassName: PropTypes.string,
    dataHook: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
  }

  render() {
    const { selected, onChange, children, value, optionClassName, dataHook } = this.props;
    return (
      <div
        tabIndex={0}
        role="option"
        className={classnames(this.styles.selectionListOption,
          { [this.styles.selectionListOption_selected]: selected }, optionClassName)}
        data-hook={dataHook} onClick={() => onChange(value)}
      >
        {children}
      </div>);
  }
}

export default SelectionList;
