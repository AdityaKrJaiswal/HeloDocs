import React, { useContext } from 'react'
import Login from './pages/Login';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctors from './pages/Admin/AddDoctors';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppoinmtent from './pages/Doctor/DoctorAppoinmtent';

const App = ()=>{
  const {atoken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext)
  // console.log(atoken);
  return (
    <>
      {atoken || dToken ? (
        <div className="bg-[#F8F9FD]">
          <ToastContainer />
          <Navbar/>
          <div className="flex items-start">
            <Sidebar/>
            <Routes>
            {/* Admin Routes */}
              <Route path='/' element={<></>}></Route>
              <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
              <Route path='/all-appointments' element={<AllAppointments/>}></Route>
              <Route path='/add-doctor' element={<AddDoctors/>}></Route>
              <Route path='/doctor-list' element={<DoctorsList/>}></Route>
            {/* Doctor Routes */}
              <Route path='/' element={<></>}></Route>
              <Route path='/doctor-dashboard' element={<DoctorDashboard/>}></Route>
              <Route path='/doctor-appointments' element={<DoctorAppoinmtent/>}></Route>
              <Route path='/doctor-profile' element={<DoctorProfile/>}></Route>
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <Login />
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default App;