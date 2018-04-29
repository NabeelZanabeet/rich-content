import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AtomicBlockUtils, EditorState, SelectionState } from '@wix/draft-js';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import ToolbarButton from '~/Components/ToolbarButton';
import FileInput from '~/Components/FileInput';
import styles from '~/Styles/toolbar-button.scss';
import { mergeStyles } from '~/Utils/mergeStyles';

export default ({ blockType, button, helpers, pubsub, t }) => {
  class InsertPluginButton extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      const { buttonStyles } = props.theme || {};
      this.styles = mergeStyles({ styles, theme: buttonStyles });
    }

    addBlock = data => {
      const { getEditorState, setEditorState, hidePopup } = this.props;
      const contentState = getEditorState().getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(blockType, 'IMMUTABLE', cloneDeep(data));
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(getEditorState(), entityKey, ' ');
      if (hidePopup) {
        hidePopup();
      }
      const recentlyCreatedKey = newEditorState.getSelection().getAnchorKey();
      //when adding atomic block, there is the atomic itself, and then there is a text block with one space,
      // so get the block before the space
      const newBlock = newEditorState.getCurrentContent().getBlockBefore(recentlyCreatedKey);

      const newSelection = new SelectionState({
        anchorKey: newBlock.getKey(),
        anchorOffset: 0,
        focusKey: newBlock.getKey(),
        focusOffset: 0,
      });
      setEditorState(EditorState.forceSelection(newEditorState, newSelection));
      return newBlock;
    };

    onClick = event => {
      event.preventDefault();
      switch (button.type) {
        case 'file':
          this.toggleFileSelection();
          break;
        case 'modal':
          this.toggleButtonModal();
          break;
        default:
          this.addBlock(button.data || {});
      }
    };

    handleFileChange = event => {
      if (event.target.files.length > 0) {
        const files = Array.from(event.target.files);
        const recentlyCreated = this.addBlock(button.data);
        const state = { userSelectedFiles: { files } };
        pubsub.set('initialState_' + recentlyCreated.getKey(), state);
      }
    };

    handleExternalFileChanged = data => {
      if (data) {
        this.addBlock(button.data || {});
        setTimeout(() => pubsub.get('handleFilesAdded')(data));
      }
    }

    setForm = form => (this.form = form);

    resetForm = () => this.form && this.form.reset();

    preventBubblingUp = event => event.preventDefault();

    renderButton = () => {
      const { styles } = this;
      const { showName } = this.props;
      const { name, Icon, ButtonElement } = button;
      if (ButtonElement) {
        return (
          <div className={styles.button} data-hook={`${name.replace(' ', '_')}_insert_plugin_button`} onClick={this.onClick}>
            <div className={styles.icon}>
              <ButtonElement key="0"/>
            </div>
            {showName && <span key="1" className={styles.label}>{name}</span>}
          </div>
        );
      } else {
        return (
          <button className={styles.button} data-hook={`${name.replace(' ', '_')}_insert_plugin_button`} onClick={this.onClick}>
            <div className={styles.icon}>
              <Icon key="0"/>
            </div>
            {showName && <span key="1" className={styles.label}>{name}</span>}
          </button>
        );
      }
    };

    toggleButtonModal = () => {
      if (helpers && helpers.openModal) {
        helpers.openModal({
          modalName: button.modalName,
          modalStyles: button.modalStyles,
          theme: this.props.theme,
          componentData: button.data,
          onConfirm: this.addBlock,
          pubsub,
          helpers,
          t,
        });
      }
    }

    toggleFileSelection = () => {
      const { handleFileSelection } = helpers || {};
      if (handleFileSelection) {
        const multiple = !!button.multi;
        handleFileSelection(undefined, multiple, this.handleExternalFileChanged);
      }
    }

    renderFileUploadForm = () => {
      if (helpers && helpers.handleFileSelection) {
        return null;
      }

      const { styles } = this;
      return (
        <form ref={this.setForm}>
          <FileInput
            dataHook={`${button.name}_file_input`}
            className={styles.fileInput}
            onChange={this.handleFileChange}
            accept="image/*"
            multiple={button.multi}
            theme={this.props.theme}
          />
        </form>
      );
    };

    render() {
      const { styles } = this;
      const { theme, isMobile } = this.props;
      const { tooltipText } = button;
      const showTooltip = !isMobile && !isEmpty(tooltipText);
      const buttonWrapperClassNames = classNames(
        styles.buttonWrapper, { [styles.mobile]: isMobile });

      const Button = (
        <div className={buttonWrapperClassNames} onMouseDown={this.preventBubblingUp}>
          {this.renderButton()}
          {button.type === 'file' && this.renderFileUploadForm()}
        </div>
      );

      return <ToolbarButton theme={theme} showTooltip={showTooltip} tooltipText={tooltipText} button={Button} />;
    }
  }

  InsertPluginButton.propTypes = {
    getEditorState: PropTypes.func.isRequired,
    setEditorState: PropTypes.func.isRequired,
    theme: PropTypes.object,
    hidePopup: PropTypes.func,
    showName: PropTypes.bool,
    isMobile: PropTypes.bool,
    t: PropTypes.func,
  };

  return InsertPluginButton;
};
