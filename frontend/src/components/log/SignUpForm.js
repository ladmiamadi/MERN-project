import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';

const SignUpForm = () => {
    const [formSubmit, setFormSubmit] = useState(false);

    const [pseudo, setPseudo]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [passwordConfirm, setPasswordConfirm]= useState('');

    const handleRegister = async (e) =>{
        e.preventDefault();

        const terms = document.getElementById('terms');
        const emailError = document.querySelector('.email.error');
        const pseudoError = document.querySelector('.pseudo.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');
        const termsError = document.querySelector('.terms.error');

        passwordConfirmError.innerHTML ='';
        termsError.innerHTML = '';

        if(password !== passwordConfirm || !terms.checked) {
            if(password !== passwordConfirm) {
                passwordConfirmError.innerHTML ='Les deux mots de passe ne sont pas identiques';
            };
            
            if(!terms.checked) {
                termsError.innerHTML = 'Veuillez valider les conditions générales';
            }
        } else {
            await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                withCredentials: true,
                data: {
                    email,
                    pseudo,
                    password
                }
            })
            .then((res) =>{
                if(res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                } else{
                    setFormSubmit(true);
                }
            })
            .catch((err) => console.log(err));
        }
    }
    
    return ( 
        <>
        { formSubmit ? (
            <>
                <SignInForm/>
                <span></span>
                <h4 className='success'>Félicitation vous avez bien crée votre compte, Merci de vous connecter</h4>
            </>
        ): (
            <form action='' onSubmit={handleRegister} id='sign-up-form'>
            <label htmlFor='pseudo'>Email</label>
                <br/>
                <input
                    type='text'
                    name='email'
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <div className='email error'></div>
                <br/>
                <label htmlFor='pseudo'>Pseudo</label>
                <br/>
                <input
                    type='text'
                    name='pseudo'
                    id='pseudo'
                    onChange={(e) => setPseudo(e.target.value)}
                    value={pseudo}
                />
                <div className='pseudo error'></div>
                <br/>
                <label htmlFor='password'>Password</label>
                <br/>
                <input
                    type='password'
                    name='password'
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <div className='password error'></div>
                <br/>
                <label htmlFor='pseudo'>Confirmation password</label>
                <br/>
                <input
                    type='password'
                    name='password-confirm'
                    id='password-confirm'
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    value={passwordConfirm}
                />
                <div className='password-confirm error'></div>
                <br/>
                <input type='checkbox' id='terms' name='terms'/>
                <label htmlFor='terms'>J'accepte les <a href='/' target='blank'
                            rel='noopener noreferrer'>conditions générales</a></label>
                <div className='terms error'></div>
                <br/>
                <br/>
                <input type='submit' value='Valider votre inscription'/>
            </form>
            )}
        </>
    );
};

export default SignUpForm;