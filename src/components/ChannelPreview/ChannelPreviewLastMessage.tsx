import React, { useRef } from 'react';

import { AvatarProps, Avatar as DefaultAvatar } from '../Avatar';

import { truncate } from '../../utils';

import type { Channel } from 'stream-chat';

import type { ChatContextValue } from '../../context/ChatContext';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
} from '../../../types/types';

export type ChannelPreviewLastMessageProps<
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = {
  /** Comes from either the `channelRenderFilterFn` or `usePaginatedChannels` call from [ChannelList](https://github.com/GetStream/stream-chat-react/blob/master/src/components/ChannelList/ChannelList.tsx) */
  channel: Channel<At, Ch, Co, Ev, Me, Re, Us>;
  /** If channel of component is active (selected) Channel */
  active?: boolean;
  /** Current selected channel object */
  activeChannel?: Channel<At, Ch, Co, Ev, Me, Re, Us>;
  /**
   * Custom UI component to display user avatar
   *
   * Defaults to and accepts same props as: [Avatar](https://github.com/GetStream/stream-chat-react/blob/master/src/components/Avatar/Avatar.tsx)
   */
  Avatar?: React.ComponentType<AvatarProps>;
  /** Image of Channel to display */
  displayImage?: string;
  /** Title of Channel to display */
  displayTitle?: string;
  /** Latest Message's text */
  latestMessage?: string;
  /** Length of latest Message to truncate at */
  latestMessageLength?: number;
  /** Setter for selected Channel */
  setActiveChannel?: ChatContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['setActiveChannel'];
  /** Number of unread Messages */
  unread?: number;
  /**
   * Object containing watcher parameters
   * @see See [Pagination documentation](https://getstream.io/chat/docs/react/channel_pagination/?language=js) for a list of available fields for sort.
   */
  watchers?: { limit?: number; offset?: number };
};

const UnMemoizedChannelPreviewLastMessage = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: ChannelPreviewLastMessageProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    active,
    Avatar = DefaultAvatar,
    channel,
    displayImage,
    displayTitle,
    latestMessage,
    latestMessageLength = 20,
    setActiveChannel,
    unread,
    watchers,
  } = props;
  const channelPreviewButton = useRef<HTMLButtonElement>(null);
  const onSelectChannel = () => {
    if (setActiveChannel) {
      setActiveChannel(channel, watchers);
    }
    if (channelPreviewButton?.current) {
      channelPreviewButton.current.blur();
    }
  };

  const unreadClass =
    unread && unread >= 1 ? 'str-chat__channel-preview--unread' : '';
  const activeClass = active ? 'str-chat__channel-preview--active' : '';

  return (
    <div className={`str-chat__channel-preview ${unreadClass} ${activeClass}`}>
      <button
        data-testid='channel-preview-button'
        onClick={onSelectChannel}
        ref={channelPreviewButton}
      >
        {unread && unread >= 1 ? (
          <div className='str-chat__channel-preview--dot' />
        ) : null}
        <Avatar image={displayImage} name={displayTitle} />
        <div className='str-chat__channel-preview-info'>
          <span className='str-chat__channel-preview-title'>
            {displayTitle}
          </span>
          <span className='str-chat__channel-preview-last-message'>
            {truncate(latestMessage, latestMessageLength)}
          </span>
          {unread && unread >= 1 ? (
            <span className='str-chat__channel-preview-unread-count'>
              {unread}
            </span>
          ) : null}
        </div>
      </button>
    </div>
  );
};

/**
 * Used as preview component for channel item in [ChannelList](#channellist) component
 * @example ./ChannelPreviewLastMessage.md
 */
export const ChannelPreviewLastMessage = React.memo(
  UnMemoizedChannelPreviewLastMessage,
) as typeof UnMemoizedChannelPreviewLastMessage;