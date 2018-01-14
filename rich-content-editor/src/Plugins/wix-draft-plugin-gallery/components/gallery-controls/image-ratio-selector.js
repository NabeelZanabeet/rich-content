import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectionList, SelectionListOption } from 'stylable-components/dist/src/components/selection-list';

import style from './image-ratio-selector.scss';
class ImageRatioSelector extends Component {
  dataSource = [
    { ratioClass: style['_16-9'], name: '16:9' },
    { ratioClass: style['_4-3'], name: '4:3' },
    { ratioClass: style['_1-1'], name: '1:1' },
    { ratioClass: style['_3-4'], name: '3:4' },
    { ratioClass: style['_9-16'], name: '9:16' },
  ];

  dataMapper = ({ name }) => ({ value: name, label: name });

  renderOption = ({ ratioClass }, { value, label }, { id, selected, focused }) => (
    <SelectionListOption id={id} value={value} selected={selected} focused={focused}>
      <div className={style['ratio-tile']}>
        <div className={ratioClass} />
        <div>{label}</div>
      </div>
    </SelectionListOption>
  );

  render() {
    const { value, onChange } = this.props;
    return (
      <div className={style['image-ratio-selector']}>
        <label>Image Ratio:</label>
        <SelectionList
          className={style['ratios-grid']}
          dataSource={this.dataSource}
          dataMapper={this.dataMapper}
          renderItem={this.renderOption}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}

ImageRatioSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

ImageRatioSelector.defaultProps = {
  value: '1:1',
};

export default ImageRatioSelector;