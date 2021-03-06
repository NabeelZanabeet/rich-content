/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import Separator from '../Components/Separator';
import BaseToolbarButton from './baseToolbarButton';
import {
  BUTTONS,
  SizeOriginalButton,
  SizeSmallCenterButton,
  SizeSmallLeftButton,
  SizeSmallRightButton,
  SizeContentButton,
  SizeFullWidthButton,
  BlockLinkButton,
  DeleteButton,
} from './buttons';
import toolbarStyles from '../Styles/plugin-toolbar.scss';
import buttonStyles from '../Styles/plugin-toolbar-button.scss';

const toolbarOffset = 12;

const getInitialState = () => (
  {
    position: { transform: 'translate(-50%) scale(0)' },
    showLeftArrow: false,
    showRightArrow: false,
    componentData: {},
    componentState: {},
    overrideContent: undefined,
    extendContent: undefined,
  }
);

const getStructure = (buttons, isMobile) => {
  const { all, hidden } = buttons;
  let structure = all;
  if (!isEmpty(hidden)) {
    structure = structure.filter(button => !includes(hidden, button.keyName));
  }
  if (isMobile) {
    structure = structure.filter(button => button.mobile);
  }
  return structure;
};

export default function createToolbar({ buttons, theme, pubsub, helpers, isMobile, anchorTarget, relValue, t, name }) {
  class BaseToolbar extends Component {
    constructor(props) {
      super(props);
      this.structure = getStructure(buttons, isMobile);
      this.state = getInitialState();
    }

    componentDidMount() {
      pubsub.subscribe('visibleBlock', this.onVisibilityChanged);
      pubsub.subscribe('componentState', this.onComponentStateChanged);
      pubsub.subscribe('componentData', this.onComponentDataChanged);
      pubsub.subscribe('componentAlignment', this.onComponentAlignmentChange);
      pubsub.subscribe('componentSize', this.onComponentSizeChange);
      pubsub.subscribe('componentLink', this.onComponentLinkChange);
      this.handleToolbarScroll();
    }


    componentWillUnmount() {
      pubsub.unsubscribe('visibleBlock', this.onVisibilityChanged);
      pubsub.unsubscribe('componentState', this.onComponentStateChanged);
      pubsub.unsubscribe('componentData', this.onComponentDataChanged);
      pubsub.unsubscribe('componentAlignment', this.onComponentAlignmentChange);
      pubsub.unsubscribe('componentSize', this.onComponentSizeChange);
      pubsub.unsubscribe('componentLink', this.onComponentLinkChange);
      this.buttons && this.buttons.removeEventListener('scroll', this.handleToolbarScroll);
      window && window.removeEventListener('resize', this.handleToolbarScroll);
      window && window.removeEventListener('orientationchange', this.handleToolbarScroll);
    }

    onOverrideContent = overrideContent => {
      this.setState({ overrideContent }, () => {
        this.handleToolbarScroll();
      });
    }

    onExtendContent = extendContent => this.setState({ extendContent });

    onComponentStateChanged = contentState => {
      this.setState({ contentState });
    };

    onComponentDataChanged = componentData => {
      this.setState({ componentData });
    };

    onComponentLinkChange = link => {
      pubsub.update('componentData', { config: { link } });
    };

    setAlignment = alignment => {
      pubsub.set('componentAlignment', alignment);
    };

    setAlignmentAndSize = (componentAlignment, componentSize) => {
      pubsub.set({ componentAlignment, componentSize });
    };

    onComponentAlignmentChange = alignment => {
      this.setState({ alignment }, () => {
        this.onVisibilityChanged(pubsub.get('visibleBlock'));
      });
    };

    setSize = size => {
      pubsub.set('componentSize', size);
    };

    onComponentSizeChange = size => {
      this.setState({ size });
    };

    onVisibilityChanged = visibleBlock => {
      if (visibleBlock) {
        this.showToolbar();
      } else {
        this.hideToolbar();
      }
    };

    hideToolbar = () => {
      this.setState(getInitialState());
    };

    showToolbar = () => {
      const toolbarNode = findDOMNode(this);
      const toolbarHeight = toolbarNode.offsetHeight;
      const offsetParentRect = toolbarNode.offsetParent.getBoundingClientRect();
      const offsetParentTop = offsetParentRect.top;
      const offsetParentLeft = offsetParentRect.left;

      const boundingRect = pubsub.get('boundingRect');
      const position = {
        top: boundingRect.top - toolbarHeight - toolbarOffset - offsetParentTop,
        left: boundingRect.left + boundingRect.width / 2 - offsetParentLeft,
        transform: 'translate(-50%) scale(1)',
        transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
      };
      const componentData = pubsub.get('componentData') || {};
      const componentState = pubsub.get('componentState') || {};
      this.setState({
        position,
        componentData,
        componentState,
      });
    };

    handleButtonsRef = node => {
      this.buttons = node;
      if (this.buttons) {
        this.buttons.addEventListener('scroll', this.handleToolbarScroll);
        window && window.addEventListener('resize', this.handleToolbarScroll);
        window && window.addEventListener('orientationchange', this.handleToolbarScroll);
        this.handleToolbarScroll();
      }
    };

    scrollToolbar(event, direction) {
      event.preventDefault();
      switch (direction) {
        case 'right':
          this.buttons.scrollLeft += 200;
          break;
        case 'left':
          this.buttons.scrollLeft -= 200;
          break;
        default:
          break;
      }
    }

    handleToolbarScroll = () => {
      if (this.state.overrideContent) {
        this.setState({
          showLeftArrow: false,
          showRightArrow: false
        });
        return;
      }

      if (this.buttons) {
        const spaceLeft = this.buttons.scrollLeft;
        const eleWidth = this.buttons.clientWidth;
        const fullWidth = this.buttons.scrollWidth;

        const spaceRight = fullWidth - eleWidth - spaceLeft;

        this.setState({
          showLeftArrow: (spaceLeft > 2),
          showRightArrow: (spaceRight > 26)
        });
      }
    }

    renderButton = (button, key, themedStyle, separatorClassNames) => {
      const { alignment, size } = this.state;
      switch (button.type) {
        case BUTTONS.SIZE_ORIGINAL:
          return (
            <SizeOriginalButton
              size={size}
              alignment={alignment}
              setAlignmentAndSize={this.setAlignmentAndSize}
              theme={themedStyle}
              key={key}
              t={t}
            />
          );
        case BUTTONS.SIZE_SMALL_CENTER:
          return (
            <SizeSmallCenterButton
              size={size} alignment={alignment} setAlignmentAndSize={this.setAlignmentAndSize} theme={themedStyle} key={key} t={t}
            />
          );
        case BUTTONS.SIZE_SMALL_LEFT:
          return (
            <SizeSmallLeftButton
              size={size} alignment={alignment} setAlignmentAndSize={this.setAlignmentAndSize} theme={themedStyle} key={key} t={t}
            />
          );
        case BUTTONS.SIZE_SMALL_RIGHT:
          return (
            <SizeSmallRightButton
              size={size} alignment={alignment} setAlignmentAndSize={this.setAlignmentAndSize} theme={themedStyle} key={key} t={t}
            />
          );
        case BUTTONS.SIZE_CONTENT:
          return (
            <SizeContentButton size={size} alignment={alignment} setAlignmentAndSize={this.setAlignmentAndSize} theme={themedStyle} key={key} t={t} />
          );
        case BUTTONS.SIZE_FULL_WIDTH:
          return (
            <SizeFullWidthButton
              size={size} alignment={alignment} setAlignmentAndSize={this.setAlignmentAndSize} theme={themedStyle} key={key} t={t}
            />
          );
        case BUTTONS.SEPARATOR:
          return <Separator className={separatorClassNames} key={key} />;
        case BUTTONS.HORIZONTAL_SEPARATOR:
          return <Separator className={separatorClassNames} horizontal key={key} />;
        case BUTTONS.LINK:
          return (<BlockLinkButton
            pubsub={pubsub}
            onExtendContent={this.onExtendContent}
            onOverrideContent={this.onOverrideContent}
            theme={themedStyle}
            key={key}
            helpers={helpers}
            isMobile={isMobile}
            componentState={this.state.componentState}
            closeModal={helpers.closeModal}
            anchorTarget={anchorTarget}
            relValue={relValue}
            t={t}
          />);
        case BUTTONS.DELETE:
          return <DeleteButton onClick={pubsub.get('deleteBlock')} theme={themedStyle} key={key} t={t} />;
        default:
          return (
            <BaseToolbarButton
              theme={themedStyle}
              componentData={this.state.componentData}
              componentState={this.state.componentState}
              pubsub={pubsub}
              helpers={helpers}
              key={key}
              t={t}
              isMobile={isMobile}
              {...button}
            />
          );
      }
    };

    render = () => {
      const { showLeftArrow, showRightArrow, overrideContent: OverrideContent, extendContent: ExtendContent } = this.state;
      const hasArrow = showLeftArrow || showRightArrow;
      const { toolbarStyles: toolbarTheme } = theme || {};
      const { buttonStyles: buttonTheme, separatorStyles: separatorTheme } = theme || {};
      const containerClassNames = classNames(toolbarStyles.pluginToolbar, toolbarTheme && toolbarTheme.pluginToolbar);
      const buttonContainerClassnames = classNames(toolbarStyles.pluginToolbar_buttons, toolbarTheme && toolbarTheme.pluginToolbar_buttons, {
        [toolbarStyles.pluginToolbar_overrideContent]: !!OverrideContent,
        [toolbarTheme.pluginToolbar_overrideContent]: !!OverrideContent,
      });
      const themedButtonStyle = {
        buttonWrapper: classNames(buttonStyles.pluginToolbarButton_wrapper, buttonTheme && buttonTheme.pluginToolbarButton_wrapper),
        button: classNames(buttonStyles.pluginToolbarButton, buttonTheme && buttonTheme.pluginToolbarButton),
        icon: classNames(buttonStyles.pluginToolbarButton_icon, buttonTheme && buttonTheme.pluginToolbarButton_icon),
        active: classNames(buttonStyles.pluginToolbarButton_active, buttonTheme && buttonTheme.pluginToolbarButton_active),
        ...theme
      };
      const separatorClassNames = classNames(toolbarStyles.pluginToolbarSeparator, separatorTheme && separatorTheme.pluginToolbarSeparator);
      const overrideProps = { onOverrideContent: this.onOverrideContent };
      const extendProps = { onExtendContent: this.onExtendContent };

      return (
        <div style={this.state.position} className={containerClassNames} data-hook={name ? `${name}PluginToolbar` : null}>
          <div
            className={buttonContainerClassnames}
            ref={this.handleButtonsRef}
          >
            {
              showLeftArrow &&
              <div
                className={classNames(toolbarStyles.pluginToolbar_responsiveArrow, toolbarStyles.pluginToolbar_responsiveArrowLeft,
                  toolbarTheme.pluginToolbar_responsiveArrow, toolbarTheme.pluginToolbar_responsiveArrowLeft)}
                data-hook="baseToolbarLeftArrow" onMouseDown={e => this.scrollToolbar(e, 'left')}
              >
                <i />
              </div>
            }
            {OverrideContent ?
              <OverrideContent {...overrideProps} /> :
              this.structure.map((button, index) => (
                this.renderButton(button, index, themedButtonStyle, separatorClassNames)
              ))
            }
            {hasArrow && <div className={toolbarStyles.pluginToolbar_responsiveSpacer} />}
            {
              showRightArrow &&
              <div
                className={classNames(toolbarStyles.pluginToolbar_responsiveArrow, toolbarStyles.pluginToolbar_responsiveArrowRight,
                  toolbarTheme.pluginToolbar_responsiveArrow, toolbarTheme.pluginToolbar_responsiveArrowRight)}
                data-hook="baseToolbarRightArrow" onMouseDown={e => this.scrollToolbar(e, 'right')}
              >
                <i />
              </div>
            }
          </div>
          {ExtendContent && (
            <div className={classNames(toolbarStyles.pluginToolbar_extend, toolbarTheme.pluginToolbar_extend)}>
              <ExtendContent {...extendProps} />
            </div>
          )}
        </div>
      );
    };
  }
  return BaseToolbar;
}
