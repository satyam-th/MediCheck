import {Routes, Route} from 'react-router-dom';

import Home from '../pages/user/Home/Home';
import About from '../pages/user/About/About';
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
// import Pharmacy from '../pages/pharmacy/Dashboard';
// import Admin from '../pages/admin/Dashboard'

export default function AppRoute(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            {/* <Route path='/pharmacy' element={<Pharmacy/>}/>
            <Route path='/admin' element={<Admin/>}/> */}
        </Routes>
    );
}