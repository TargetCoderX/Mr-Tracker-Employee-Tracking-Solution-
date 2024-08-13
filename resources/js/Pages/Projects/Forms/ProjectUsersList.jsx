import React, { useEffect, useState } from 'react';

function ProjectUsersList({ users, all_users, action_handler }) {
    const [searchText, setsearchText] = useState("");
    const [userState, setuserState] = useState([]);
    const [searchUserState, setSearchUserState] = useState([]);
    useEffect(() => {
        if (searchText != '') {
            const searchLowerCase = searchText.trim().toLowerCase();
            const getSerahcUsers = [...userState].filter((user) => {
                const firstName = user.first_name?.toLowerCase() || '';
                const lastName = user.last_name?.toLowerCase() || '';
                const roleName = user.role_relation?.role_name?.toLowerCase() || '';
                return (
                    firstName.includes(searchLowerCase) ||
                    lastName.includes(searchLowerCase) ||
                    roleName.includes(searchLowerCase)
                );
            })
            setSearchUserState(getSerahcUsers);
        } else {
            setSearchUserState(userState);

        }
    }, [searchText]);

    useEffect(() => {
        const getNewUsers = [...all_users].filter((user) =>
            !users.some(existingUser => existingUser.id == user.id) && user.role != 0
        ).map(user => ({ ...user, __is_new__: true }));
        setuserState([...users, ...getNewUsers]);
        setSearchUserState([...users, ...getNewUsers]);
    }, [users, all_users]);

    return (
        <div>
            <input type="text" value={searchText} onChange={(e) => setsearchText(e.target.value)} placeholder='Search Users / Type name to add users' className="form-control mb-2" />
            <ul className="list-group" style={{ height: "300px", overflow: 'auto' }}>
                {searchUserState && searchUserState.map((user, index) => (
                    <li className="list-group-item d-flex justify-content-between" key={index}>
                        <span className="d-flex align-items-center">
                            <span>{user.first_name} {user.last_name}</span>
                            {user.__is_new__ ? (<i className="fa fa-plus-circle ms-2 text-success" onClick={(e) => { action_handler(user.id, 'add'), setsearchText("") }}></i>) : (<i className="fa fa-minus-circle ms-2 text-danger" onClick={(e) => { action_handler(user.id, 'remove'), setsearchText("") }}></i>)}
                        </span>
                        <span className="badge bg-warning" style={{ width: '150px' }}>{user.role_relation?.role_name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProjectUsersList;
