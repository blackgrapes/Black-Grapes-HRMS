import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Profile from './Components/Profile';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import Payroll from './Components/Payroll';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import LeaveManagement from './Components/LeaveManagement';
import SuperAdminLogin from './Components/SuperAdminLogin';
import SuperAdminDashboard from './Components/SuperAdminDashboard'; // Import SuperAdminDashboard
import Report from './Components/Report';
import Leave from './Components/Leave';
import SignupEmployee from './Components/SignupEmployee';
import ManageEmployee from './Components/ManageEmployee';
import Attendance from './Components/Attendance';
import SignupHR from './Components/SignupHR';
import Hradd from './Components/Hradd';
import SuperAddEmployee from './Components/SuperAddEmployee';
import SuperSignupEmployee from './Components/SuperSignupEmployee';
import SuperAdminReport from './Components/SuperAdminReport';
import SuperAdminSignup from './Components/SuperAdminSignup';
import ShowAttendance from './Components/ShowAttendance';
import Employeeforgot from './Components/Employeeforgot';
import Adminforgot from './Components/Adminforgot';
import Superadminforgot from './Components/Superadminforgot';
import Superpayroll from './Components/Superpayroll';
import Superleavemanagement from './Components/Superleavemanagement';
import Superattendance from './Components/Superattendance';
import SuperShowAttendance from './Components/SuperShowAttendance';
import HrLeave from'./Components/HrLeave';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />
        <Route path="/employee/edit_employee/" element={<EditEmployee />} />
        <Route path="/employee/Leave" element={<Leave />} />
        <Route path="/employee/Employeeforgot" element={<Employeeforgot />} />

        {/* SuperAdmin Routes */}
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
        <Route path="/superadmin_dashboard" element={<SuperAdminDashboard />} />
        <Route path="/manage_employees" element={<ManageEmployee />} />
        <Route path="/SignupHR" element={<SignupHR />} />
        <Route path="/add_HR" element={<Hradd />} />
        <Route path="/SuperAddEmployee" element={<SuperAddEmployee />} />
        <Route path="/SuperSignupEmployee" element={<SuperSignupEmployee />} />
        <Route path="/SuperAdminReport" element={<SuperAdminReport />} />
        <Route path="/SuperAdminSignup" element={<SuperAdminSignup />} />
        <Route path="/Superadminforgot" element={<Superadminforgot />} /> 
        <Route path="/Superpayroll" element={<Superpayroll/>} /> 
        <Route path="/Superleavemanagement" element={<Superleavemanagement/>} /> 
        <Route path="/Superattendance" element={<Superattendance/>} /> 
        <Route path="/SuperShowAttendance" element={<SuperShowAttendance/>} /> 

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path="" element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          {/* <Route path="/dashboard/add_category" element={<AddCategory />} /> */}
          <Route path="/dashboard/add_employee" element={<AddEmployee />} />
          <Route path="/dashboard/payroll" element={<Payroll />} />
          <Route path="/dashboard/LeaveManagement" element={<LeaveManagement />} />
          {/* <Route path="/dashboard/Category" element={<Category />} /> */}
          <Route path="/dashboard/Report" element={<Report />} />
          <Route path="/dashboard/signup_employee" element={<SignupEmployee />} />
          <Route path="/dashboard/Attendance" element={<Attendance />} />
          <Route path="/dashboard/ShowAttendance" element={<ShowAttendance />} />
          <Route path="/dashboard/HrLeave" element={<HrLeave />} />
          
        </Route>
        <Route path="/adminforgot" element={<Adminforgot />} /></Routes>
    </BrowserRouter>
  );
}

export default App;
