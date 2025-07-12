import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllApointments from './pages/Admin/AllApointments';
import AddLawyer from './pages/Admin/AddLawyer';
import LawyersList from './pages/Admin/LawyersList';
import GISdashboard from './pages/Admin/GISdashboard';
import { LawyerContext } from './context/LawyerContext';
import LawyerDashboard from './pages/Lawyer/LawyerDashboard';
import LawyerAppointment from './pages/Lawyer/LawyerAppointment';
import LawyerProfile from './pages/Lawyer/LawyerProfile';
const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(LawyerContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/*  Admin Route  */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/gis-dashboard' element={<GISdashboard />} />
          <Route path='/all-appointments' element={<AllApointments />} />
          <Route path='/add-lawyer' element={<AddLawyer />} />
          <Route path='/lawyer-list' element={<LawyersList />} />

          {/*  Lawyer Route  */}
          <Route path='/lawyer-dashboard' element={<LawyerDashboard />} />
          <Route path='/lawyer-appointments' element={<LawyerAppointment />} />
          <Route path='/lawyer-profile' element={<LawyerProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
