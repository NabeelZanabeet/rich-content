import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { mergeStyles } from 'wix-rich-content-common';
import styles from './default-video-styles.scss';

const DEFAULTS = {
  config: {
    size: 'content',
    alignment: 'center'
  },
};

const MAX_WAIT_TIME = 5000;

class VideoComponent extends React.Component {
  constructor(props) {
    super(props);
    const isPlayable = !props.blockProps || props.blockProps.readOnly === true;
    this.state = {
      isLoading: false,
      isLoaded: false,
      isPlayable,
    };
    this.styles = mergeStyles({ styles, theme: this.props.theme });
  }

  setPlayer = player => {
    this.player = player;
  };

  handlePlay = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ isLoading: true });
    setTimeout(() => this.handleReady(), MAX_WAIT_TIME);
  };

  handleVideoStart = player => {
    if (this.player !== player) {
      this.setState({
        isLoading: false,
        isLoaded: false,
      });
    }
  };

  handleReady = () => {
    if (!this.state.isLoaded) {
      this.setState({ isLoaded: true });
    }
  };

  renderOverlay = (styles, t) => {
    const { isLoaded } = this.state;
    const overlayText = t('VideoComponent_Overlay');
    return (
      <div className={classNames(styles.video_overlay)}>
        {isLoaded && <span className={styles.video_overlay_message}>{overlayText}</span>}
      </div>);
  };

  renderPlayer = styles => {
    const { componentData } = this.props;
    return (
      <ReactPlayer
        ref={this.setPlayer}
        className={classNames(styles.video_player)}
        width="100%"
        height="100%"
        url={componentData.src}
        onReady={this.handleReady}
        onStart={this.handleStart}
        controls
      />
    );
  };

  render() {
    const { styles } = this;
    const { className, onClick, t } = this.props;
    const { isPlayable } = this.state;
    const containerClassNames = classNames(styles.video_container, className || '');
    return (
      <div data-hook="videoPlayer" onClick={onClick} className={containerClassNames}>
        {!isPlayable && this.renderOverlay(styles, t)}
        {this.renderPlayer(styles)}
      </div>
    );
  }
}

VideoComponent.propTypes = {
  componentData: PropTypes.object.isRequired,
  componentState: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  blockProps: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
};

export { VideoComponent as Component, DEFAULTS };
