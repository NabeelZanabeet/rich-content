import { BUTTONS, getModalStyles } from 'wix-rich-content-common';
import VideoURLInputModal from './videoURLInputModal';
import MediaReplaceIcon from './icons/media-replace.svg';

export default({ t }) => {
  return [
    { keyName: 'sizeSmallCenter', type: BUTTONS.SIZE_SMALL_CENTER, mobile: false },
    { keyName: 'sizeContent', type: BUTTONS.SIZE_CONTENT, mobile: false },
    { keyName: 'sizeFullWidth', type: BUTTONS.SIZE_FULL_WIDTH, mobile: false },
    { keyName: 'separator1', type: BUTTONS.SEPARATOR, mobile: false },
    { keyName: 'sizeSmallLeft', type: BUTTONS.SIZE_SMALL_LEFT, mobile: false },
    { keyName: 'sizeSimallRight', type: BUTTONS.SIZE_SMALL_RIGHT, mobile: false },
    { keyName: 'separator2', type: BUTTONS.SEPARATOR, mobile: false },
    {
      keyName: 'replace',
      type: BUTTONS.EXTERNAL_MODAL,
      icon: MediaReplaceIcon,
      modalElement: VideoURLInputModal,
      modalStyles: getModalStyles({ fullScreen: false }),
      mobile: true,
      tooltipTextKey: 'ReplaceVideoButton_Tooltip',
      t,
    },
    { keyName: 'delete', type: BUTTONS.DELETE, mobile: true },
  ];
};
