import React from 'react';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import Home from '../../pages/Home';
import Profile from '../../pages/Profile';
import Trending from '../../pages/Trending';

const index = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<Home />}/>
                <Route path="/trending" element = {<Trending />}/>
                <Route path="/profil" element = { <Profile />}/>
                <Route path="/*" element = {<Home />}/>
            </Routes>
        </BrowserRouter>
    );
};

export default index;