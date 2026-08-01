import {

  BrowserRouter,
  Routes,
  Route

} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Equipments from "./pages/Equipments"
import Alerts from "./pages/Alerts"
import Reports from "./pages/Reports"
import Login from "./pages/Login"
import Platform from "./pages/Platform"
import PlatformCompany from "./pages/PlatformCompany"
import CompanyDetail from "./pages/CompanyDetail"
import CreateCompany from "./pages/CreateCompany"
import CreatePlatformUser from "./pages/CreatePlatformUser"
import CreateCompanyUser from "./pages/CreateCompanyUser"
import CreateBranch from "./pages/CreateBranch"
import CompanyHome from "./pages/CompanyHome"
import EditCompanyUser from "./pages/EditCompanyUser"
import EditUserPassword from "./pages/EditUserPassword"
import CreateEquipment from "./pages/CreateEquipment"
import EditCompany from "./pages/EditCompany"
import EditBranch from "./pages/EditBranch"
import EquipmentDetail from "./pages/EquipmentDetail"
import CreateTicket from "./pages/CreateTicket"
import TicketDetail from "./pages/TicketDetail"
import CompanyTickets from "./pages/CompanyTickets"
import PlatformTickets from "./pages/PlatformTickets"
import ManagePlatformUsers from "./pages/ManagePlatformUsers"
import PlatformUserDetail from "./pages/PlatformUserDetail"
import Profile from "./pages/Profile"
import CompanyEquipments from "./pages/CompanyEquipments"
import EquipmentEdit from "./pages/EquipmentEdit"

function App() {

  return (

      <Routes>

  <Route
    path="/platform/company/create"
    element={<CreateCompany />}
  />

    <Route
    path="/platform/users/create"
    element={<CreatePlatformUser />}
  />

  <Route
    path="/platform/company/:companyId"
    element={<CompanyDetail />}
  />

  <Route
    path="/platform"
    element={<Platform />}
  />

  <Route
    path="/company/home"
    element={<CompanyHome />}
  />

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/dashboard"
    element={<Dashboard />}
  />

  <Route
    path="/company/equipments"
    element={<CompanyEquipments />}
  />

  <Route
    path="/alerts"
    element={<Alerts />}
  />

  <Route
    path="/reports"
    element={<Reports />}
  />

  <Route
    path="/company/:companyId/users/create"
    element={<CreateCompanyUser />}
  />

  <Route
    path="/platform/company/:companyId/edit"
    element={<EditCompany />}
  />

  <Route
    path="/company/:companyId/branch/create"
    element={<CreateBranch />}
  />

  <Route
    path="/company/:companyId/branch/:branchId/edit"
    element={<EditBranch />}
  />

  <Route
    path="/company/users/:userId/edit"
    element={<EditCompanyUser />}
  />

  <Route
    path="/company/users/:userId/password"
    element={<EditUserPassword />}
  />

  <Route
    path="/company/:companyId/equipments/create"
    element={<CreateEquipment />}
  />
  
  <Route
  path="/company/:companyId/equipment/:equipmentId"
  element={<EquipmentDetail />}
  />

  <Route
  path="/company/:companyId/equipments"
  element={<Equipments />}
  />

  <Route
  path="/company/:companyId/equipment/:equipmentId/edit"
  element={<EquipmentEdit />}
  />
  
  <Route
  path="/company/:companyId/equipment/:equipmentId/ticket/create"
  element={<CreateTicket />}
  />

  <Route
  path="/company/:companyId/tickets/:ticketId"
  element={<TicketDetail />}
  />

  <Route
  path="/company/:companyId/tickets"
  element={<CompanyTickets />}
  />

  <Route
  path="/company/tickets/:ticketId"
  element={<TicketDetail />}
  />

  <Route
  path="/platform/tickets"
  element={<PlatformTickets />}
  />

  <Route
  path="/platform/users"
  element={<ManagePlatformUsers />}
  />

  <Route
  path="/platform/users/:userId"
  element={<PlatformUserDetail />}
  />

  <Route
  path="/platform/profile"
  element={<Profile />}
  />

  <Route
  path="/company/tickets"
  element={<CompanyTickets />}
  />

</Routes>

  )

}

export default App
