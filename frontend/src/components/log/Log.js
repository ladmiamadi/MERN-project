import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Log = (props) => {
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInMOdal] = useState(props.signin);

    const handleModal = (e) => {
        if(e.target.id === "register") {
            setSignInMOdal(false);
            setSignUpModal(true);
        } else if(e.target.id === "login") {
            setSignInMOdal(true);
            setSignUpModal(false);
        }
    }

    return (
        <div className='connection-form'>
            <div className='form-container'>
                <ul>
                    <li onClick={handleModal} id="register" className={signUpModal ? "active-btn": null}>S'inscrire</li>
                    <li onClick={handleModal} id="login" className={signInModal ? "active-btn": null}>Se Connecter</li>
                </ul>         
                {signUpModal && <SignUpForm/> }
                {signInModal && <SignInForm/> }
            </div>
        </div>
    );
};

export default Log;