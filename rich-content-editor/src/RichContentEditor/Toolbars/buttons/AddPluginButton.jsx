import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextButton from './TextButton';
import { MODALS, getModalStyles } from 'wix-rich-content-common';
import PlusIcon from '../icons/plus-default.svg';

export default class AddPluginButton extends Component {
  constructor(props) {
    super(props);
    props.pubsub.set('openAddPluginModal', this.openAddPluginModal);
  }

  handleClick = () => this.openAddPluginModal();

  openAddPluginModal = () => {
    const { getEditorState, setEditorState, pluginButtons, pubsub, theme, t } = this.props;
    this.props.openModal({
      modalName: MODALS.MOBILE_ADD_PLUGIN,
      modalStyles: getModalStyles({ fullScreen: false }),
      structure: pluginButtons,
      theme,
      hidePopup: this.props.closeModal,
      getEditorState,
      setEditorState,
      pubsub,
      t,
    });
  }

  render() {
    const { theme } = this.props;
    return (
      <TextButton
        icon={PlusIcon}
        theme={theme}
        dataHook="addPluginButton" onClick={this.handleClick}
      />
    );
  }
}

AddPluginButton.propTypes = {
  pubsub: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  setEditorState: PropTypes.func.isRequired,
  pluginButtons: PropTypes.array,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
};
