import {Routes, Route} from 'react-router-dom';

import Home from '../pages/user/Home/Home';
// import Pharmacy from '../pages/pharmacy/Dashboard';
// import Admin from '../pages/admin/Dashboard'

export default function AppRoute(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            {/* <Route path='/pharmacy' element={<Pharmacy/>}/>
            <Route path='/admin' element={<Admin/>}/> */}
        </Routes>
    );
}