import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"

import axios from "axios"

import {
  FaBuilding,
  FaUsers,
  FaDesktop,
  FaCogs,
  FaTicketAlt,
  FaCheckCircle,
  FaCheck,
  FaExclamationTriangle,
  FaMapMarkerAlt
} from "react-icons/fa"

function Platform() {

  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    equipments: 0,
    branches: 0,

    ticktes: 0,
    tickets_open: 0,
    tickets_closed: 0,
    alerts: 0
  })

  const [companies, setCompanies] = useState([])

  const [userRole, setUserRole] = useState("")

  useEffect(() => {

    fetchData()

    const role = localStorage.getItem("role")
    setUserRole(role)

  }, [])

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token")

      // STATS
      const statsResponse = await axios.get(
        "http://127.0.0.1:8000/platform/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setStats(statsResponse.data)

      // COMPANIES
      const companiesResponse = await axios.get(
        "http://127.0.0.1:8000/platform/companies",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setCompanies(companiesResponse.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  return (

    <>

      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Plataforma de Control Global 
            <FaCogs className="text-[#0b2b33]" /> 
          </h1>

          <p className="text-gray-500 mt-2">
            Panel principal de administración de Empresas
          </p>

        </div>

        {/* CARDS */}

        <div className="grid grid-cols-4 gap-6 mb-8">

          {/* EMPRESAS */}

<div
  className="
    bg-gradient-to-br
    from-blue-500
    to-indigo-700
    rounded-3xl
    p-6
    shadow-lg
    text-white
    relative
    overflow-hidden
  "
>

  {/* Icono decorativo de fondo */}

  <FaBuilding
    size={90}
    className="
      absolute
      right-4
      top-4
      text-white/10
    "
  />

  {/* Icono principal */}

  <div
    className="
      bg-white/20
      backdrop-blur-sm
      p-3
      rounded-2xl
      w-fit
    "
  >

    <FaBuilding size={28} />

  </div>

  {/* Título */}

  <h3
    className="
      mt-5
      text-white/80
      font-medium
      text-sm
      uppercase
      tracking-wide
    "
  >
    Total de Empresas
  </h3>

  {/* Número */}

  <p
    className="
      text-5xl
      font-bold
      mt-3
    "
  >
    {stats.companies}
  </p>

  {/* Información secundaria */}

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Empresas registradas en la plataforma
  </p>

</div>

          {/* BRANCHES */}
          
<div
  className="
    bg-gradient-to-br
    from-orange-400
    to-amber-600
    rounded-3xl
    p-6
    shadow-lg
    text-white
    relative
    overflow-hidden
  "
>

  <FaMapMarkerAlt
    size={90}
    className="
      absolute
      right-4
      top-4
      text-white/10
    "
  />

  <div
    className="
      bg-white/20
      backdrop-blur-sm
      p-3
      rounded-2xl
      w-fit
    "
  >

    <FaMapMarkerAlt size={28} />

  </div>

  <h3
    className="
      mt-5
      text-white/80
      font-medium
      text-sm
      uppercase
      tracking-wide
    "
  >
    Total de Sucursales
  </h3>

  <p
    className="
      text-5xl
      font-bold
      mt-3
    "
  >
    {stats.branches}
  </p>

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Sucursales registradas
  </p>

</div>

          {/* USERS */}

<div
  className="
    bg-gradient-to-br
    from-green-500
    to-emerald-700
    rounded-3xl
    p-6
    shadow-lg
    text-white
    relative
    overflow-hidden
  "
>

  <FaUsers
    size={90}
    className="
      absolute
      right-4
      top-4
      text-white/10
    "
  />

  <div
    className="
      bg-white/20
      backdrop-blur-sm
      p-3
      rounded-2xl
      w-fit
    "
  >

    <FaUsers size={28} />

  </div>

  <h3
    className="
      mt-5
      text-white/80
      font-medium
      text-sm
      uppercase
      tracking-wide
    "
  >
    Total de Usuarios
  </h3>

  <p
    className="
      text-5xl
      font-bold
      mt-3
    "
  >
    {stats.users}
  </p>

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Usuarios registrados
  </p>

</div>

          {/* EQUIPMENTS */}

<div
  className="
    bg-gradient-to-br
    from-violet-500
    to-fuchsia-700
    rounded-3xl
    p-6
    shadow-lg
    text-white
    relative
    overflow-hidden
  "
>

  <FaDesktop
    size={90}
    className="
      absolute
      right-4
      top-4
      text-white/10
    "
  />

  <div
    className="
      bg-white/20
      backdrop-blur-sm
      p-3
      rounded-2xl
      w-fit
    "
  >

    <FaDesktop size={28} />

  </div>

  <h3
    className="
      mt-5
      text-white/80
      font-medium
      text-sm
      uppercase
      tracking-wide
    "
  >
    Total de Equipos
  </h3>

  <p
    className="
      text-5xl
      font-bold
      mt-3
    "
  >
    {stats.equipments}
  </p>

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Equipos monitoreados
  </p>

</div>

        {/* TICKETS */}
<div
  className="
    bg-white
    rounded-3xl
    p-6
    shadow-md
    border-t-4
    border-gray-600
  "
>

  <div className="flex justify-between items-center">

    <div>

      <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wide">
        Total de Tickets
      </h3>

      <p className="text-4xl font-bold mt-3">
        {stats.tickets}
      </p>

    </div>

    <FaTicketAlt
      size={42}
      className="text-gray-600"
    />

  </div>

</div>
        {/* TICKETS ABIERTOS */}
<div
  className="
    bg-white
    rounded-3xl
    p-6
    shadow-md
    border-t-4
    border-green-500
    hover:shadow-lg
    transition
  "
>

  <div className="flex justify-between items-center">

    <div>

      <h3
        className="
          text-gray-500
          text-sm
          uppercase
          tracking-wide
          font-semibold
        "
      >
        Tickets Abiertos
      </h3>

      <p
        className="
          text-4xl
          font-bold
          mt-3
        "
      >
        {stats.tickets_open}
      </p>

    </div>

    <FaCheckCircle
      size={42}
      className="text-green-500"
    />

  </div>

</div>
        {/* TICKETS CERRADOS */}
<div
  className="
    bg-white
    rounded-3xl
    p-6
    shadow-md
    border-t-4
    border-red-500
    hover:shadow-lg
    transition
  "
>

  <div className="flex justify-between items-center">

    <div>

      <h3
        className="
          text-gray-500
          text-sm
          uppercase
          tracking-wide
          font-semibold
        "
      >
        Tickets Cerrados
      </h3>

      <p
        className="
          text-4xl
          font-bold
          mt-3
        "
      >
        {stats.tickets_closed}
      </p>

    </div>

    <FaCheck
      size={42}
      className="text-red-500"
    />

  </div>

</div>
        {/* ALERTAS */}
<div
  className="
    bg-white
    rounded-3xl
    p-6
    shadow-md
    border-t-4
    border-yellow-500
    hover:shadow-lg
    transition
  "
>

  <div className="flex justify-between items-center">

    <div>

      <h3
        className="
          text-gray-600
          text-sm
          uppercase
          tracking-wide
          font-semibold
        "
      >
        Alertas
      </h3>

      <p
        className="
          text-4xl
          font-bold
          mt-3
        "
      >
        {stats.alerts}
      </p>

      <p
        className="
          text-xs
          text-gray-500
          mt-2
        "
      >
        Equipos requieren atención
      </p>

    </div>

    <FaExclamationTriangle
      size={42}
      className="text-yellow-500"
    />

  </div>

</div>

        </div>
        

{/* ACTIONS */}

<div className="flex gap-4 mb-6">

  {userRole === "sysadmin" && (

    <>
      {/* NUEVA EMPRESA */}

      <button
        onClick={() => navigate("/platform/company/create")}
        className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
      >

        <div className="relative">

          <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🏢
          </div>

          <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow">
            +
          </div>

        </div>

        <div className="text-left">

          <p className="font-semibold text-gray-800">
            Nueva Empresa
          </p>

          <p className="text-sm text-gray-500">
            Registrar empresa cliente
          </p>

        </div>

      </button>

      {/* NUEVO FUNCIONARIO */}

      <button
        onClick={() => navigate("/platform/users/create")}
        className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
      >

        <div className="relative">

          <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            👤
          </div>

          <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow">
            +
          </div>

        </div>

        <div className="text-left">

          <p className="font-semibold text-gray-800">
            Nuevo Funcionario
          </p>

          <p className="text-sm text-gray-500">
            Funcionario de la plataforma
          </p>

        </div>

      </button>

    {/* GESTIONAR FUNCIONARIOS */}
<button
  onClick={() => navigate("/platform/users")}
  className="
    bg-white
    hover:bg-gray-50
    border
    border-gray-200
    rounded-2xl
    px-5
    py-4
    shadow-sm
    flex
    items-center
    gap-4
    transition
  "
>

  <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
    👥
  </div>

  <div className="text-left">

    <p className="font-semibold text-gray-800">
      Gestionar Funcionarios
    </p>

    <p className="text-sm text-gray-500">
      Administrar funcionarios de la plataforma
    </p>

  </div>

</button>
    </>

  )}

  {/* TICKETS GLOBALES */}

  <button
    onClick={() => navigate("/platform/tickets")}
    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
  >

    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
      🎫
    </div>

    <div className="text-left">

      <p className="font-semibold text-gray-800">
        Tickets Globales
      </p>

      <p className="text-sm text-gray-500">
        Ver todos los tickets
      </p>

    </div>

  </button>
  
  {/* MI PERFIL DE SUPPORT */}
{userRole === "support" && (

  <button
    onClick={() => navigate("/platform/profile")}
    className="
      bg-white
      hover:bg-gray-50
      border
      border-gray-200
      rounded-2xl
      px-5
      py-4
      shadow-sm
      flex
      items-center
      gap-4
      transition
    "
  >

    <div className="
      bg-white
      w-12
      h-12
      rounded-2xl
      flex
      items-center
      justify-center
      text-2xl
    ">
      👨‍💻
    </div>

    <div className="text-left">

      <p className="font-semibold text-gray-800">
        Mi Perfil
      </p>

      <p className="text-sm text-gray-500">
        Empresas asignadas
      </p>

    </div>

  </button>

)}

</div>

        {/* EMPRESAS */}

        <div className="bg-white rounded-3xl p-3 shadow-sm">

        <input
          type="text"
          placeholder="Buscar Empresa por ID o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full mb-4"
        />
          <h1 className="text-2xl font-bold mb-4">
            Empresas Registradas
          </h1>

          <div className="space-y-4">

            {companies
            .filter((company) => {
              return (
                company.company_id.toString().includes(search) ||
                company.company_name.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((company) => (

<div
  key={company.company_id}
  className="border border-gray-200 rounded-2xl p-5 grid grid-cols-[1fr_120px_120px_120px_auto] items-center gap-6"
>
  {/* EMPRESA */}
  <div className="min-w-0">
    <h2 className="font-bold text-lg truncate">
      #000{company.company_id} - {company.company_name}
    </h2>
  </div>

  {/* SUCURSALES */}
  <div className="text-center">
    <p className="text-gray-400 text-sm">
      Sucursales
    </p>
    <p className="font-bold text-lg">
      {company.total_branches}
    </p>
  </div>

  {/* EQUIPOS */}
  <div className="text-center">
    <p className="text-gray-400 text-sm">
      Equipos
    </p>
    <p className="font-bold text-lg">
      {company.total_equipments}
    </p>
  </div>

  {/* USUARIOS */}
  <div className="text-center">
    <p className="text-gray-400 text-sm">
      Usuarios
    </p>
    <p className="font-bold text-lg">
      {company.total_users}
    </p>
  </div>

  {/* BUTTON */}
  <button
    onClick={() =>
      navigate(`/platform/company/${company.company_id}`)
    }
    className="bg-[#0f3d3e] hover:bg-[#145052] text-white px-5 py-3 rounded-xl transition font-semibold whitespace-nowrap"
  >
    Administrar
  </button>
</div>

            ))}

          </div>

        </div>

      </div>

    </>

  )

}

export default Platform
