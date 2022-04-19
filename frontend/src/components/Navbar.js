import React, {useContext} from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import LogOut from './log/LogOut';

const Navbar = () => {
    const uid = useContext(UidContext);

    const userData = useSelector((state) => state.userReducer);
    return (
        <nav>
            <div className='nav-container'>
                <div className='logo'>
                    <NavLink to='/'>
                    <div className='logo'>
                        <img src='./img/icon.png' alt='icon'/>
                        <h3>Le Miaouu</h3>
                    </div>
                    </NavLink>
                </div>
                {uid ? (
                    <ul>
                        <li></li>
                        <li className='welcome'>
                            <NavLink to='/'>
                                <h5>Bienvenu {userData.pseudo}</h5>
                            </NavLink>
                        </li>
                        <LogOut/>
                    </ul>
                ): (
                    <ul>
                        <li></li>
                        <li>
                            <NavLink to='/profil'>
                                <img src='./img/icons/login.svg' alt='login'/>
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;