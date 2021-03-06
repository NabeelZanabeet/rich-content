import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer as sortableContainer, SortableElement as sortableElement, arrayMove } from 'react-sortable-hoc';
import classNames from 'classnames';
import findIndex from 'lodash/findIndex';
import { getScaleToFillImageURL } from 'image-client-api/dist/imageClientSDK';

import Styles from './gallery-items-sortable.scss';
import ImageSettings from './gallery-image-settings';
import { mergeStyles, FileInput, ImageLoader } from 'wix-rich-content-common';

import UploadIcon from '../../icons/upload.svg';
import Fab from '../../icons/fab.svg';

//eslint-disable-next-line no-unused-vars
const EMPTY_SMALL_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const SortableItem = sortableElement(props => {
  const {
    item,
    itemIdx,
    clickAction,
    addItemsButton,
    handleFileSelection,
    handleFileChange,
    isMobileSorting,
    theme,
    t,
    isMobile
  } = props;

  const styles = mergeStyles({ styles: Styles, theme });
  const imageSize = (isMobile && window && window.document) ? ((window.document.body.getBoundingClientRect().width - 20) / 3) : 104;
  if (addItemsButton) {
    const uploadMediaLabel = t('GallerySettings_Upload_Media');

    return (
      <FileInput
        className={classNames(styles.itemContainer, styles.filesItem, { [styles.mobile]: isMobile })}
        dataHook="galleryItemsSortableFileInputBottom" onChange={handleFileChange}
        handleFileSelection={handleFileSelection}
        multiple theme={theme}
        title={uploadMediaLabel}
        style={{ width: imageSize + 'px', height: imageSize + 'px' }}
      >
        <UploadIcon/>
      </FileInput>
    );
  } else {
    let prefix = '';
    if (item.url.indexOf('/') < 0) {
      prefix = 'media/';
    }

    let url;
    if (item.metadata.processedByConsumer) {
      url = getScaleToFillImageURL((prefix + item.url), item.metadata.width, item.metadata.height, imageSize, imageSize);
    }

    return (
      <div
        className={classNames(styles.itemContainer, {
          [styles.itemContainerSelected]: item.selected && !isMobile,
          [styles.itemContainerSelectedMobile]: item.selected && isMobile,
          [styles.mobile]: isMobile,
          [styles.sorting]: isMobileSorting
        })}
        data-hook="galleryItemsSortable" onClick={() => clickAction(itemIdx)}
        style={{
          width: imageSize + 'px',
          height: imageSize + 'px',
        }}
      >
        {url ? <img
          className={styles.itemImage}
          src={url}
          style={{
            width: imageSize + 'px',
            height: imageSize + 'px',
          }}
        /> : <ImageLoader theme={theme}/>}
      </div>
    );
  }
}
);

const SortableList = sortableContainer(props => {
  const {
    items,
    clickAction,
    handleFileSelection,
    handleFileChange,
    isMobileSorting,
    theme,
    t,
    isMobile,
  } = props;

  const styles = mergeStyles({ styles: Styles, theme });
  return (
    <div
      className={classNames(styles.sortableContainer, { [styles.mobile]: isMobile })}
    >
      {items.map((item, itemIdx) => (
        <SortableItem
          key={`item-${itemIdx}`}
          itemIdx={itemIdx}
          index={itemIdx} item={item}
          clickAction={clickAction}
          isMobileSorting={isMobileSorting}
          disabled={isMobile && !isMobileSorting}
          theme={theme}
          t={t}
          isMobile={isMobile}
        />
      ))}
      {isMobileSorting ? null : (
        <SortableItem
          key={`item-upload-mock`}
          itemIdx={items.length}
          index={items.length}
          isMobile={isMobile}
          handleFileSelection={handleFileSelection}
          handleFileChange={handleFileChange}
          theme={theme}
          t={t}
          addItemsButton
          disabled
        />
      )
      }
    </div>
  );
});

//eslint-disable-next-line
const ItemActionsMenu = props => {
  const {
    items,
    setAllItemsValue,
    deleteSelectedItems,
    toggleImageSettings,
    handleFileSelection,
    handleFileChange,
    toggleSorting,
    isMobileSorting,
    theme,
    t,
    isMobile,
  } = props;

  const styles = mergeStyles({ styles: Styles, theme });
  const hasUnselectedItems = items.some(item => !item.selected);
  const hasSelectedItems = items.some(item => item.selected);
  const selectedItems = items.filter(item => item.selected);
  const addMediaLabel = t('GallerySettings_Add_Media');
  const finishSortingLabel = t('GallerySettings_Finish_Sorting');
  const sortItemsLabel = t('GallerySettings_Sort_Items');
  const selectAllLabel = t('GallerySettings_Select_All');
  const deselectLabel = t('GallerySettings_Deselect');
  const deleteLabel = t('GallerySettings_Delete');
  const itemSettingsLabel = t('GallerySettings_Image_Settings');

  //eslint-disable-next-line max-len
  const addItemButton = (
    <FileInput
      className={styles.filesButton}
      dataHook="galleryItemsSortableFileInputTop" onChange={handleFileChange}
      handleFileSelection={handleFileSelection}
      multiple theme={theme}
    >
      {(isMobile ? <Fab className={styles.fab} /> : `+ ${addMediaLabel}`)}
    </FileInput>
  );

  const separator = <span className={styles.seperator}>·</span>;
  const buttons = [];
  const toggleSortingAnchor = (
    <a
      className={styles.topBarLink} data-hook="galleryItemsSortableToggleSorting" onClick={toggleSorting}
    >{isMobileSorting ? finishSortingLabel : sortItemsLabel}
    </a>
  );
  const selectAllAnchor = (
    <a
      className={styles.topBarLink} data-hook="galleryItemsSortableSelectAll" onClick={() => setAllItemsValue('selected', true)}
    >{selectAllLabel}
    </a>
  );
  const deselectAllAnchor = (
    <a
      className={styles.topBarLink} data-hook="galleryItemsSortableDeselectAll" onClick={() => setAllItemsValue('selected', false)}
    >{deselectLabel}
    </a>
  );

  const deleteAnchor = (
    <a
      className={styles.topBarLink} data-hook="galleryItemsSortableDelete" onClick={() => deleteSelectedItems()}
    >{deleteLabel}
    </a>
  );

  const itemSettingsAnchor = (
    <a className={styles.topBarLink} data-hook="galleryItemsSortableItemSettings" onClick={() => toggleImageSettings(true)}>{itemSettingsLabel}
    </a>
  );
  if (isMobile && selectedItems.length === 0) {
    buttons.push(toggleSortingAnchor);
    buttons.push(separator);
  }
  if (!isMobileSorting) {
    if (hasUnselectedItems) {
      buttons.push(selectAllAnchor);
      buttons.push(separator);
    }
    if (hasSelectedItems) {
      buttons.push(deselectAllAnchor);
      buttons.push(separator);
      buttons.push(deleteAnchor);
      buttons.push(separator);
    }
    if (selectedItems.length === 1) {
      buttons.push(itemSettingsAnchor);
      buttons.push(separator);
    }
  }
  buttons.splice(buttons.length - 1, 1);

  return (
    <div className={classNames(styles.topBar, { [styles.mobile]: isMobile })}>
      {buttons}
      {(hasSelectedItems || isMobileSorting) ? null : addItemButton}
    </div>
  );
};

ItemActionsMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  setAllItemsValue: PropTypes.func,
  deleteSelectedItems: PropTypes.func,
  toggleImageSettings: PropTypes.func.isRequired,
  handleFileSelection: PropTypes.func,
  handleFileChange: PropTypes.func,
  toggleSorting: PropTypes.func,
  isMobileSorting: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
  isMobile: PropTypes.bool
};

export class SortableComponent extends Component {

  state = this.propsToState(this.props);

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    }, () => {
      this.props.onItemsChange(this.state.items);
    });
  };

  clickAction = itemIdx => {
    if (this.state.isMobileSorting) {
      return;
    }
    if (this.clickedOnce) {
      this.toggleImageSettings(true, itemIdx);
      this.clickedOnce = false;
      clearInterval(this.doubleClickTimer);
    } else {
      this.clickedOnce = true;
      this.doubleClickTimer = setTimeout(() => {
        if (this.clickedOnce) {
          this.selectItem(itemIdx);
        }
        this.clickedOnce = false;
      }, 200);
    }
  }

  selectItem = itemIdx => {
    const { items } = this.state;
    const item = items[itemIdx];
    item.selected = !item.selected;
    const selectedItems = items.filter(i => i.selected);
    this.setState({
      items,
      editedImage: selectedItems.length ? selectedItems[0] : null
    });
  }

  setAllItemsValue(field, val) {
    const { items } = this.state;
    items.map(item => {
      item[field] = val;
      return item;
    });
    this.setState({
      items
    });
  }

  toggleImageSettings = (imageSettingsVisible, itemIdx) => {
    const { items } = this.state;
    let editedImage;

    if (itemIdx >= 0) {
      items.map((item, idx) => {
        item.selected = (idx === itemIdx);
        return item;
      });
      editedImage = this.state.items[itemIdx];
    } else {
      editedImage = this.state.editedImage;
    }

    this.setState({
      items,
      imageSettingsVisible,
      editedImage
    });
  }

  toggleSorting = () => {
    this.setState({ isMobileSorting: !this.state.isMobileSorting });
  }

  deleteSelectedItems() {
    const { items } = this.state;
    this.setState({
      items: items.filter(item => !item.selected)
    }, () => {
      this.props.onItemsChange(this.state.items);
    });
  }

  propsToState(props) {
    return {
      items: props.items
    };
  }

  componentDidMount() {
    const newState = this.propsToState(this.props);
    if (newState.items.length > 0) {
      newState.items.forEach(i => i.selected = false);
    }
    this.setState(newState);
  }

  componentWillReceiveProps(props) {
    this.setState(this.propsToState(props));
  }

  saveImageSettings(items) {
    this.props.onItemsChange(items);
    this.toggleImageSettings(false);
  }

  handleFileSelection = multiple => {
    const { items, editedImage } = this.state;
    const { handleFileSelection, handleFilesAdded, deleteBlock } = this.props;
    const index = editedImage ? findIndex(items, i => editedImage.url === i.url) : undefined;
    handleFileSelection(index, multiple, handleFilesAdded, deleteBlock);
  }

  render() {
    const { handleFileSelection: shouldHandleFileSelection, theme, t } = this.props;
    return !!this.state.items && (
      !this.state.imageSettingsVisible ? (
        <div>
          <ItemActionsMenu
            items={this.state.items}
            setAllItemsValue={this.setAllItemsValue.bind(this)}
            deleteSelectedItems={this.deleteSelectedItems.bind(this)}
            toggleImageSettings={() => this.toggleImageSettings(true)}
            handleFileSelection={shouldHandleFileSelection ? this.handleFileSelection : null}
            handleFileChange={this.props.handleFileChange}
            toggleSorting={this.toggleSorting}
            isMobileSorting={this.state.isMobileSorting}
            theme={theme}
            t={t}
            isMobile={this.props.isMobile}
          />
          <SortableList
            items={this.state.items}
            onSortEnd={this.onSortEnd}
            clickAction={this.clickAction}
            hideSortableGhost={false}
            axis="xy"
            helperClass="sortableHelper"
            transitionDuration={50}
            handleFileSelection={shouldHandleFileSelection ? this.handleFileSelection : null}
            handleFileChange={this.props.handleFileChange}
            isMobileSorting={this.state.isMobileSorting}
            theme={theme}
            t={t}
            isMobile={this.props.isMobile}
          />
        </div>
      ) : (
        <div>
          <ImageSettings
            theme={theme}
            images={this.state.items}
            selectedImage={this.state.editedImage}
            onCancel={items => this.saveImageSettings(items)}
            onSave={items => this.saveImageSettings(items)}
            handleFileSelection={shouldHandleFileSelection ? this.handleFileSelection : null}
            handleFileChange={this.props.handleFileChange}
            t={t}
            isMobile={this.props.isMobile}
          />
        </div>
      )
    );
  }
}

SortableComponent.propTypes = {
  onItemsChange: PropTypes.func.isRequired,
  addItems: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleFileChange: PropTypes.func,
  handleFileSelection: PropTypes.func,
  handleFilesAdded: PropTypes.func,
  deleteBlock: PropTypes.func,
  isMobile: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func,
};
