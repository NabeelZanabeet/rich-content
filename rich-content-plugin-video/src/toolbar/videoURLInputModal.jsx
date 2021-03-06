import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CameraIcon from './icons/video-camera.svg';
import ErrorIcon from './icons/error.svg';
import classNames from 'classnames';
import { mergeStyles, isVideoUrl, Tooltip, SettingsPanelFooter } from 'wix-rich-content-common';
import styles from './video-url-input-modal.scss';

export default class VideoURLInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    const { componentData } = this.props;
    this.state = {
      url: componentData.src || '',
      isValidUrl: props.url ? isVideoUrl(props.url) : true,
    };
  }

  onUrlChange = e => {
    const url = e.target.value;
    this.setState({ url, isValidUrl: true });
  };

  afterOpenModal = () => this.input.focus();

  onConfirm = () => {
    const { url } = this.state;
    if (isVideoUrl(url)) {
      const { componentData, helpers, pubsub, onConfirm } = this.props;
      if (onConfirm) {
        onConfirm({ ...componentData, src: url });
      } else {
        pubsub.update('componentData', { src: url });
      }

      if (helpers && helpers.onVideoSelected) {
        helpers.onVideoSelected(url, data => pubsub.update('componentData', { metadata: { ...data } }));
      }

      this.onCloseRequested();
    } else {
      this.setState({ isValidUrl: false });
    }
  };

  onCloseRequested = () => {
    this.setState({ isOpen: false });
    this.props.helpers.closeModal();
  };

  handleKeyPress = e => {
    if (e.charCode === 13) {
      this.onConfirm();
    }
  };

  render() {
    const { theme, doneLabel, cancelLabel, t } = this.props;
    const { styles } = this;
    const headerText = t('VideoUploadModal_Header');
    const videoInputPlaceholder = t('VideoUploadModal_Input_Placeholder');

    return (
      <div onKeyPress={this.handleKeyPress} className={styles.container} data-hook="videoUploadModal">
        <div className={classNames(styles.header)}>
          <CameraIcon className={classNames(styles.cameraIcon, styles.header_icon)} />
          <h3 className={styles.header_text}>{headerText}</h3>
        </div>
        <div className={styles.textInput}>
          <input
            ref={ref => (this.input = ref)}
            className={classNames(styles.textInput_input, { [styles.textInput_input_invalid]: !this.state.isValidUrl })}
            placeholder={videoInputPlaceholder}
            data-hook="videoUploadModalInput" onChange={this.onUrlChange}
            value={this.state.url}
            onDoubleClick={() =>
              this.setState({
                url: 'https://www.youtube.com/watch?v=_OBlgSz8sSM'
              })
            }
          />
          {this.state.isValidUrl ? null : (
            <Tooltip
              content={'Invalid URL'}
              moveBy={{ x: -23, y: -5 }}
              theme={theme}
            >
              <span><ErrorIcon className={styles.errorIcon} /></span>
            </Tooltip>
          )}
        </div>
        <SettingsPanelFooter
          className={styles.modal_footer}
          save={() => this.onConfirm()}
          cancel={() => this.onCloseRequested()}
          saveLabel={doneLabel}
          cancelLabel={cancelLabel}
          theme={theme}
          t={t}
        />
      </div>
    );
  }
}

VideoURLInputModal.propTypes = {
  onConfirm: PropTypes.func,
  pubsub: PropTypes.object,
  helpers: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  url: PropTypes.string,
  theme: PropTypes.object.isRequired,
  doneLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  t: PropTypes.func,
};

VideoURLInputModal.defaultProps = {
  doneLabel: 'Add Now',
  cancelLabel: 'Cancel',
};
