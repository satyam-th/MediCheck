import {Routes, Route} from 'react-router-dom';

import Home from '../pages/user/Home/Home';
import About from '../pages/user/About/About';
import Login from '../pages/auth/login/Login';
import RegisterCustomer from '../pages/auth/register/RegisterCustomer';
import RegisterPharmacy from '../pages/auth/register/RegisterPharmacy';
import SearchResults from '../pages/user/SearchResults/SearchResults';

import PharmacyLayout from '../layout/PharmacyLayout/PharmacyLayout';
import PharmacyDashboard from '../pages/pharmacy/Dashboard/Dashboard';
import PharmacyMedicines from '../pages/pharmacy/Medicines/Medicines';

import AdminLayout from '../layout/AdminLayout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard/Dashboard';
import AdminPharmacy from '../pages/admin/Pharmacy/Pharmacy';
import AdminMedicines from '../pages/admin/Medicines/Medicines';
import AdminCustomer from '../pages/admin/Customer/Customer';
import AdminProfile from '../pages/admin/Profile/Profile';

export default function AppRoute(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register/customer' element={<RegisterCustomer/>}/>
            <Route path='/register/pharmacy' element={<RegisterPharmacy/>}/>
            <Route path='/search' element={<SearchResults />} />

            {/* pharmacy */}
            <Route path='/pharmacy' element={<PharmacyLayout />}>
                <Route index element={<PharmacyDashboard />} />
                <Route path='dashboard' element={<PharmacyDashboard />} />
                <Route path='medicines' element={<PharmacyMedicines />} />
                {/* <Route path='sales' element={<PharmacySales />} />
                <Route path='low-stock' element={<PharmacyLowStock />} />
                <Route path='profile' element={<PharmacyProfile />} /> */}
            </Route>
            
            {/* admin */}
            <Route path='/admin' element={<AdminLayout/>}>
                <Route path='dashboard' element={<AdminDashboard/>} />
                <Route path='pharmacy' element={<AdminPharmacy/>} />
                <Route path='medicines' element={<AdminMedicines/>}/>
                <Route path='customer' element={<AdminCustomer/>}/>
                <Route path='profile' element={<AdminProfile/>}/>
            </Route>
        </Routes>
    );
}
