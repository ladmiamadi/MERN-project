import React, { useContext } from 'react';
import Log from '../components/log/Log';
import { UidContext } from '../components/AppContext';
import UpdateProfile from '../components/profile/UpdateProfile';

const Profile = () => {
    const uid = useContext(UidContext);

    return (
        <div className='profil-page'>
        {uid ? (
            <UpdateProfile />
        ): (
            <div className='log-container'>
                <Log signin= {false} signup={true} />
                <div className='img-container'>
                    <img src='./img/log.png' alt='log'/>
                </div>
            </div>
            )}
        </div>
    );
};

export default Profile;