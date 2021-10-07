import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from '.';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName, setChannelCategory, setSelectedUsers }) => {
  const { client, setActiveChannel } = useChatContext();

  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }

  const changeCategory = (e) => {
    setChannelCategory(e.target.value);
    setSelectedUsers([client.userID]);
  }

  return (
    <>
      <div className="channel-name-input__wrapper">
        <p>Name</p>
        <input value={channelName} onChange={handleChange} placeholder="channel-name" />
        <p>Add Members</p>
      </div>
      <div className="channel-name-input__wrapper">
        <p>Channel Category</p>
        <select onChange={changeCategory}>
          <option selected value="public" disabled>Choose Category</option>
          <option value="private">Private Channel</option>
          <option value="public">Public Channel</option>
        </select>
      </div>
    </>
  );
}

const EditChannel = ({ setIsEditing }) => {

  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [channelCategory, setChannelCategory] = useState('private');

  const updateChannel = async (event) => {
    event.preventDefault();
    const nameChanged = channelName !== (channel.data.name || channel.data.id);
    if (nameChanged) {
      await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`})
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  }

  return (
    <div className="edit-channel__container">
      <div className="edit-channel__header">
        <p>Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput channelName={channelName} setChannelName={setChannelName} setSelectedUsers={setSelectedUsers} setChannelCategory={setChannelCategory} />
      <UserList setSelectedUsers={setSelectedUsers} channelCategory={channelCategory} />
      <div className="edit-channel__button-wrapper" onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
}

export default EditChannel;
