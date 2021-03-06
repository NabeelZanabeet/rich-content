import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { mergeStyles, SelectionList } from 'wix-rich-content-common';
import styles from './gallery-settings-mobile-header.scss';
import MoreIcon from '../../icons/more.svg';

class GallerySettingsMobileHeader extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = {
      showMenu: false
    };
  }
  render() {
    const { save, cancel, saveName, cancelName, switchTab, otherTab, theme, t } = this.props;
    const cancelLabel = cancelName || t('GallerySettings_MobileHeader_Cancel');
    const saveLabel = saveName || t('GallerySettings_MobileHeader_Save');

    return (
      <div>
        <div className={this.styles.gallerySettingsMobileHeader_headerPlaceholder} />
        <div className={this.styles.gallerySettingsMobileHeader_header}>
          <a
            data-hook="gallerySettingsMobileHeaderCanel" onClick={() => cancel()}
            className={classNames(this.styles.gallerySettingsMobileHeader_button,
              this.styles.gallerySettingsMobileHeader_cancel)}
          >{cancelLabel}
          </a>
          {otherTab ?
            <a
              data-hook="gallerySettingsMobileHeaderMore" onClick={() => this.setState({ showMenu: !this.state.showMenu })}
              className={classNames(this.styles.gallerySettingsMobileHeader_button, this.styles.gallerySettingsMobileHeader_menuIcon)}
            ><MoreIcon/>
            </a> : null}
          <a
            data-hook="gallerySettingsMobileHeaderDone" onClick={() => save()} className={classNames(this.styles.gallerySettingsMobileHeader_button,
              this.styles.gallerySettingsMobileHeader_done)}
          >{saveLabel}
          </a>
        </div>
        {this.state.showMenu ? (
          <div className={this.styles.gallerySettingsMobileHeader_menu}>
            <SelectionList
              theme={theme}
              dataSource={[
                otherTab,
              ]}
              value={''}
              onChange={() => {
                this.setState({ showMenu: false });
                switchTab();
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

GallerySettingsMobileHeader.propTypes = {
  hide: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  cancel: PropTypes.func.isRequired,
  switchTab: PropTypes.func,
  otherTab: PropTypes.string,
  saveName: PropTypes.string,
  cancelName: PropTypes.string,
  t: PropTypes.func,
};

export default GallerySettingsMobileHeader;
