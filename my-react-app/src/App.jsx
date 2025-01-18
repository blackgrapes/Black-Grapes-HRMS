import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import Payroll from './Components/Payroll';
import CustomCalendar from './Components/CustomCalendar';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import LeaveManagement from './Components/LeaveManagement';
import SuperAdminLogin from './Components/SuperAdminLogin';
import SuperAdminDashboard from './Components/SuperAdminDashboard'; // Import SuperAdminDashboard
import Report from './Components/Report';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />

        {/* SuperAdmin Routes */}
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
        <Route path="/superadmin_dashboard" element={<SuperAdminDashboard />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path="" element={<Home />} />
          <Route path="/dashboard/employee" element={<Employee />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/add_category" element={<AddCategory />} />
          <Route path="/dashboard/add_employee" element={<AddEmployee />} />
          <Route path="/dashboard/edit_employee/:id" element={<EditEmployee />} />
          <Route path="/dashboard/payroll" element={<Payroll />} />
          <Route path="/dashboard/LeaveManagement" element={<LeaveManagement />} />
          <Route path="/dashboard/calendar" element={<CustomCalendar />} />
          <Route path="/dashboard/calendar" element={<CustomCalendar />} />
          <Route path="/dashboard/Report" element={<Report />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
