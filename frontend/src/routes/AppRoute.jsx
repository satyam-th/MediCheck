import {Routes, Route} from 'react-router-dom';

import Home from '../pages/user/Home/Home';
import Login from '../pages/auth/login/Login';
import RegisterCustomer from '../pages/auth/register/RegisterCustomer';
import RegisterPharmacy from '../pages/auth/register/RegisterPharmacy';

import PharmacyDashboard from '../pages/pharmacy/Dashboard/Dashboard'
// import Admin from '../pages/admin/Dashboard'

export default function AppRoute(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register/customer' element={<RegisterCustomer/>}/>
            <Route path='/register/pharmacy' element={<RegisterPharmacy/>}/>

            <Route path='/pharmacy/dashboard' element={<PharmacyDashboard/>}/>
            {/* <Route path='/admin' element={<Admin/>}/> */}
        </Routes>
    );
}