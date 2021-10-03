import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        if(selected) {
          setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
          setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.name} size={32} />
                <p className="user-item__name">{user.fullName || user.name}</p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const UserList = ({ setSelectedUsers, channelCategory }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    console.log(channelCategory, '<< category')

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);

            try {
                const responseUsers = await client.queryUsers(
                    { id: { $ne: client.userID } },
                    { id: 1 },
                    { limit: 8 } 
                );
                const response = responseUsers?.users?.filter((user) => user.role !== 'admin');
                if(response.length) {
                    setUsers(response);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true);
            }
            setLoading(false);
        }

        if (client) getUsers();
    }, []);

    useEffect(() => {
        if (channelCategory === 'public') {
            let usersId = [];
            users?.map((user) => {
                usersId.push(user.id);
            });
            setSelectedUsers((prevUsers) => prevUsers.concat(usersId));
        } 
    }, [channelCategory]);

    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                channelCategory === 'private' && users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />  
                ))
            )}
        </ListContainer>
    )
}

export default UserList;