import React, { useContext } from 'react';
import Log from '../components/log/Log';
import { UidContext } from '../components/AppContext';

const Profile = () => {
    const uid = useContext(UidContext);
    
    return (
        <div className='profil-page'>
        {uid ? (
            <h1>UPDATE PAGE</h1>
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