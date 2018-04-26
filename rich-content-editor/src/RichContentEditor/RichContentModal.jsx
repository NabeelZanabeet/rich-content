import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import ImageSettingsModal from '~/Plugins/wix-draft-plugin-image/toolbar/image-settings';
import GallerySettingsModal from '~/Plugins/wix-draft-plugin-gallery/components/gallery-settings-modal';
import HTMLSettingsModal from '~/Plugins/wix-draft-plugin-html/toolbar/html-settings';
import VideoURLInputModal from '~/Plugins/wix-draft-plugin-video/toolbar/videoURLInputModal';
import MobileAddPluginModal from './Toolbars/AddPluginModal';
import MobileBlockLinkModal from './Toolbars/MobileBlockLinkModal';
import MobileTextLinkModal from './Toolbars/MobileTextLinkModal';

const KEYS = {
  IMAGE_SETTINGS: 'image-settings',
  GALLERY_SETTINGS: 'gallery-settings',
  VIDEO_URL_INPUT: 'video-url-input',
  HTML_SETTINGS: 'html-settings',
  MOBILE_ADD_PLUGIN: 'mobile-add-plugin',
  MOBILE_BLOCK_LINK_MODAL: 'mobile-block-link-modal',
  MOBILE_TEXT_LINK_MODAL: 'mobile-text-link-modal',
};

const Modals = {
  [KEYS.IMAGE_SETTINGS]: ImageSettingsModal,
  [KEYS.GALLERY_SETTINGS]: GallerySettingsModal,
  [KEYS.VIDEO_URL_INPUT]: VideoURLInputModal,
  [KEYS.HTML_SETTINGS]: HTMLSettingsModal,
  [KEYS.MOBILE_ADD_PLUGIN]: MobileAddPluginModal,
  [KEYS.MOBILE_BLOCK_LINK_MODAL]: MobileBlockLinkModal,
  [KEYS.MOBILE_TEXT_LINK_MODAL]: MobileTextLinkModal,
};

const RichContentModal = ({ modalName, modalElement, ...modalProps }) => {
  const ModalElement = Modals[modalName] || modalElement;
  if (!ModalElement) {
    console.error(`Attempted to open unknown external modal '${modalName}'`); //eslint-disable-line no-console
    return null;
  }
  return (
    <FocusTrap>
      <ModalElement {...modalProps} />
    </FocusTrap>);
};

RichContentModal.propTypes = {
  modalName: PropTypes.string,
  modalElement: PropTypes.func,
  modalProps: PropTypes.object,
};

export default RichContentModal;
export { KEYS as MODALS };
