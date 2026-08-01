import {
  FaDesktop,
  FaBell,
  FaHeartbeat,
  FaSignOutAlt,
  FaChartPie,
  FaExclamationTriangle,
  FaNetworkWired,
  FaPowerOff,
  FaHome,
  FaFile,
  FaServer,
  FaChartLine,
  FaBuilding,
  FaCogs,
  FaMap,
  FaLocationArrow,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaCheck,
  FaWindows,
  FaClock,
  FaWifi,
  FaTicketAlt,
  FaExclamation,
  FaExclamationCircle
} from "react-icons/fa"

import { useEffect, useState } from "react"
import axios from "axios"
import logo from "../assets/logo.png"
import { Link } from "react-router-dom"

import {
  jwtDecode
} from "jwt-decode"

import {
  useNavigate
} from "react-router-dom"

import Equipments from "../components/Equipments"

function Dashboard() {
 
  const [companyData, setCompanyData] = useState(null)

  const token = localStorage.getItem("token")

  const [stats, setStats] = useState({
    total_equipments: 0,
    active_equipments: 0,
    inactive_equipments: 0,
    online_equipments: 0,
    offline_equipments: 0,
    availability: 0
  })
  
  useEffect(() => {

  const fetchCompanyData = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await fetch(
        "http://127.0.0.1:8000/company/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      setCompanyData(data)

    } catch (error) {

      console.error(error)

    }

  }

  fetchCompanyData()

}, [])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {

    try {
     
      console.log("LLAMANDO STATS...")
 
      const response = await axios.get(
        "http://127.0.0.1:8000/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data)

      setStats(response.data)

    } catch (error) {

      console.log(error.response)

    }
  }

    const [dashboardData, setDashboardData] =
    useState(null)
  
  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {

  try {

    const token =
      localStorage.getItem("token")

    const response = await axios.get(

      "http://127.0.0.1:8000/company/dashboard",

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )

    setDashboardData(response.data)

  }

  catch (error) {

    console.error(error)

  }

}

  const navigate = useNavigate()

  const decoded = jwtDecode(token)

  const email = decoded.sub

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/login")

  }

return (

  <div className="flex bg-white/60 min-h-screen">

    {/* SIDEBAR */}

    <div className="w-64 bg-[#0f3d3e] text-white flex flex-col justify-between shadow-2xl">

      <div>

        {/* LOGO */}

        <div className="flex flex-col items-center pt-6">

          <div className="bg-white rounded-2xl p-1 shadow-xl">

            <img
              src={logo}
              alt="Logo"
              className="w-20 object-contain"
            />

          </div>

          <h1 className="text-2xl font-bold text-white mt-4">
            UPdate
          </h1>

          <p className="text-l text-gray-300 text-center px-4 mt-1">
            Soporte IT Gestionado
            <br />
            para Empresas
          </p>

        </div>
        {/* MENU */}

        <div className="mt-3 px-4 space-y-1">

          <Link
            to="/company/home"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaHome size={22} />

            <span>
              Home
            </span>

          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaChartPie size={22} />

            <span>
              Dashboard
            </span>

          </Link>
          <Link
            to="/alerts"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaBell size={20} />

            <span>
              Alertas
            </span>

          </Link>
          <Link
            to="/company/equipments"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaDesktop size={20} />

            <span>
              Equipos
            </span>

          </Link>

                    <Link
            to="/company/tickets"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaTicketAlt size={20} />

            <span>
              Tickets
            </span>

          </Link>
                    <Link
            to="/reports"
            className="flex items-center gap-3 bg-[#0b2b33] hover:bg-[#1f5c5d] p-4 rounded-xl cursor-pointer transition-all duration-300"
          >

            <FaFile size={20} />

            <span>
              Reportes
            </span>

          </Link>
          
        </div>

      </div>

{/* USER */}

<div className="p-4 border-t border-gray-700">

  <div className="flex items-start gap-3">

    <div className="w-10 h-10 rounded-full bg-[#1f5c5d] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
      {companyData?.user_name?.charAt(0)}
    </div>

    <div className="flex-1">

      <p className="font-semibold text-m text-white leading-tight break-words">
        {companyData?.company_name}
      </p>

      <p className="text-sm font-light text-gray-400 mt-1 break-words leading-tight">
        {companyData?.user_name}
      </p>

      <p className="text-xs text-gray-400 mt-1 break-words leading-tight">
        {companyData?.user_email}
      </p>

      <span className="inline-block mt-2 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
        {companyData?.role}
      </span>

    </div>

    <button
      onClick={handleLogout}
      className="text-red-400 hover:text-red-500 transition shrink-0 mt-1"
    >
      <FaSignOutAlt size={16} />
    </button>

  </div>

</div>

</div>

    {/* CONTENIDO */}

    <div className="flex-1 p-4">
      {/* HEADER */}

      <div className="mb-5">
      
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          Plataforma de Control de {companyData?.company_name} 
           <FaCogs className="text-[#0b2b33]" /> 
        </h1>

        <p className="text-gray-500 mt-3 text-l">
          Aquí tienes el resumen de tu infraestructura.
        </p>

      </div>
      
      {/* CARDS */}

<div className="grid grid-cols-5 gap-5 mb-10">

  {/* TOTAL */}

<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-white border-l-4 border-violet-500">

  <div className="flex justify-between items-start">

    <div>

      <p className="uppercase tracking-wider text-xs text-gray-500 font-semibold">
        Equipos Totales
      </p>

      <h2 className="text-5xl font-extrabold mt-4 text-gray-800">
        {dashboardData?.total_equipments || 0}
      </h2>

    </div>

    <div className="bg-violet-100 p-4 rounded-2xl">

      <FaDesktop
        size={30}
        className="text-violet-600"
      />

    </div>

  </div>

  <p className="text-sm text-gray-400 mt-6">
    Infraestructura Registrada
  </p>

</div>

    {/* ACTIVOS */}

<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-white border-l-4 border-green-600">

  <div className="flex justify-between items-start">

    <div>

      <p className="uppercase tracking-wider text-xs text-gray-500 font-semibold">
        Equipos Activos
      </p>

      <h2 className="text-5xl font-extrabold mt-4 text-green-700">
        {dashboardData?.active_equipments || 0}
      </h2>

    </div>

    <div className="bg-green-100 p-4 rounded-2xl">

      <FaCheckCircle
        size={30}
        className="text-green-600"
      />

    </div>

  </div>

  <p className="text-sm text-gray-400 mt-6">
    Equipos en Uso
  </p>

</div>

    {/* INACTIVOS */}

<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-white border-l-4 border-gray-600">

  <div className="flex justify-between items-start">

    <div>

      <p className="uppercase tracking-wider text-xs text-gray-500 font-semibold">
        Equipos Inactivos
      </p>

      <h2 className="text-5xl font-extrabold mt-4 text-gray-700">
        {dashboardData?.inactive_equipments || 0}
      </h2>

    </div>

    <div className="bg-gray-100 p-4 rounded-2xl">

      <FaPowerOff
        size={30}
        className="text-gray-600"
      />

    </div>

  </div>

  <p className="text-sm text-gray-400 mt-6">
    Equipos sin Uso
  </p>

</div>

  {/* ONLINE */}

<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-white border-l-4 border-emerald-500">

  <div className="flex justify-between items-start">

    <div>

      <p className="uppercase tracking-wider text-xs text-gray-500 font-semibold">
        Equipos Online
      </p>

      <h2 className="text-5xl font-extrabold mt-4 text-emerald-600">
        {dashboardData?.online_equipments || 0}
      </h2>

    </div>

    <div className="bg-emerald-100 p-4 rounded-2xl">

      <FaHeartbeat
        size={30}
        className="text-emerald-600"
      />

    </div>

  </div>

  <p className="text-sm text-gray-400 mt-6">
    Operando Correctamente
  </p>

</div>

  {/* OFFLINE */}

<div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-white border-l-4 border-red-500">

  <div className="flex justify-between items-start">

    <div>

      <p className="uppercase tracking-wider text-xs text-gray-500 font-semibold">
        Equipos Offline
      </p>

      <h2 className="text-5xl font-extrabold mt-4 text-red-600">
        {dashboardData?.offline_equipments || 0}
      </h2>

    </div>

    <div className="bg-red-100 p-4 rounded-2xl">

      <FaExclamationTriangle
        size={30}
        className="text-red-500"
      />

    </div>

  </div>

  <p className="text-sm text-gray-400 mt-6">
    Requieren Verificación
  </p>

</div>

{/* RESUMEN DE TICKETS */}

<div className="col-span-5 bg-white/90 backdrop-blur-sm rounded-3xl p-5 shadow-md border border-slate-200">

  <div className="flex items-center justify-between mb-4">

    <h3 className="text-lg font-bold text-slate-800">
      Resumen de Tickets
    </h3>

    <FaTicketAlt
      className="text-slate-400"
      size={20}
    />

  </div>

  <div className="grid grid-cols-5 gap-4">

    {/* TOTAL */}

    <div className="border-r border-slate-200 pr-4">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
        Totales
      </p>

      <h2 className="text-3xl font-bold text-slate-800 mt-2">
        {dashboardData?.tickets || 0}
      </h2>

    </div>

    {/* ABIERTOS */}

    <div className="border-r border-slate-200 px-4">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
        Abiertos
      </p>

      <h2 className="text-3xl font-bold text-slate-600 mt-2">
        {dashboardData?.open_tickets || 0}
      </h2>

    </div>

    {/* EN PROGRESO */}

    <div className="border-r border-slate-200 px-4">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
        En Progreso
      </p>

      <h2 className="text-3xl font-bold text-slate-600 mt-2">
        {dashboardData?.in_progress_tickets || 0}
      </h2>

    </div>

    {/* CERRADOS */}

    <div className="border-r border-slate-200 px-4">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
        Cerrados
      </p>

      <h2 className="text-3xl font-bold text-slate-600 mt-2">
        {dashboardData?.closed_tickets || 0}
      </h2>

    </div>

    {/* ALERTAS */}

    <div className="pl-4">

      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
        Alertas
      </p>

      <h2 className="text-3xl font-bold text-slate-600 mt-2">
        {dashboardData?.alerts || 0}
      </h2>

    </div>

  </div>
</div>
</div>

{/* DASHBOARD WIDGETS */}

<div className="grid grid-cols-2 gap-6">

  {/* EQUIPOS POR SUCURSAL */}

  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1f5c5d]">

    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-5">
          Equipos por Sucursal
           <FaMapMarkedAlt className="text-[#0b2b33]" /> 
        </h2>

    <div className="space-y-2">

      {dashboardData?.branches_stats?.map((branch, index) => (

        <div key={index}>

          <div className="flex justify-between mb-1">

            <span className="text-sm font-medium">
              {branch.branch_name}
            </span>

            <span className="text-sm text-gray-500">
              {branch.equipments}
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-[#0F3D3E] h-3 rounded-full"
              style={{
                width: `${Math.max(
                  branch.equipments * 20,
                  5
                )}%`
              }}
            />

          </div>

        </div>

      ))}

    </div>

  </div>

  {/* DISPONIBILIDAD */}

  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1f5c5d]">

    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
          Disponibilidad General
           <FaCheck className="text-[#0b2b33]" /> 
        </h2>

    <div className="flex flex-col items-center justify-center h-full">

      <div className="text-7xl font-bold text-green-600">
      <span className="text-4x1 font-bold">
        {stats.availability ?? 0}%
      </span>
      </div>

      <p className="text-gray-500">
        Equipos Disponibles

      </p>

    </div>

  </div>

  {/* SISTEMAS OPERATIVOS */}

  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1f5c5d]">

    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-5">
          Sistemas Operativos
           <FaWindows className="text-[#0b2b33]" /> 
        </h2>

    <div className="space-y-3">

      {dashboardData?.os_stats &&
        Object.entries(
          dashboardData.os_stats
        ).map(([os, count]) => (

          <div
            key={os}
            className="flex justify-between border-b pb-2"
          >

            <span>{os}</span>

            <span className="font-semibold">
              {count}
            </span>

          </div>

        ))}

    </div>

  </div>

  {/* ÚLTIMOS EQUIPOS */}

  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#1f5c5d]">

    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-5">
          Últimos Equipos Conectados
           <FaClock className="text-[#0b2b33]" /> 
        </h2>

    <div className="space-y-3">

      {dashboardData?.latest_equipments?.map(
        (eq, index) => (

          <div
            key={index}
            className="border rounded-xl p-3"
          >

            <p className="font-semibold">
              💻{eq.hostname}
            </p>

            <p className="text-sm text-gray-500">
              {eq.branch}
            </p>

            <p className="text-xs text-gray-400 mt-1">

              {eq.last_seen
                ? new Date(
                    eq.last_seen
                  ).toLocaleString()
                : "Nunca conectado"}

            </p>

          </div>

        )
      )}

    </div>

  </div>

</div>

{/* ALERTAS FUTURAS */}

<div className="bg-white rounded-3xl p-6 mt-6 shadow-sm border border-[#1f5c5d]">

    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-5">
          Alertas Recientes
           <FaExclamation className="text-[#0b2b33]" /> 
        </h2>

  <div className="text-center py-10 text-gray-400">

    Próximamente disponible

  </div>

</div>

    </div>

  </div>

)

}

export default Dashboard
