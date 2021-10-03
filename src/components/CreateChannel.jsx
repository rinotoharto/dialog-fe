import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
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

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const [channelCategory, setChannelCategory] = useState('private');
  const [channelName, setChannelName] = useState('');
  console.log(selectedUsers, '<< selectedUsers')

  const createChannel = async (event) => {
    event.preventDefault();

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName, members: selectedUsers
      })
      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} setSelectedUsers={setSelectedUsers} setChannelCategory={setChannelCategory} />}
      <UserList setSelectedUsers={setSelectedUsers} channelCategory={channelCategory} />
      <div className="create-channel__button-wrapper" onClick={createChannel}>
        <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
      </div>
    </div>
  );
}

export default CreateChannel;
