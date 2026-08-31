import { useEffect, useState } from "react"
import axios from "axios"

import Navbar from "../components/Navbar"
import {
  FaBuilding,
  FaStore,
  FaDesktop,
  FaCheckCircle,
  FaTimesCircle,
  FaTicketAlt,
  FaFolderOpen,
  FaSpinner,
  FaCheckDouble,
  FaChartLine
} from "react-icons/fa"

import { useNavigate } from "react-router-dom"

function Profile() {

  const [myTickets, setMyTickets] = useState([])

  const navigate = useNavigate()

  const [showAllCompanies, setShowAllCompanies] = useState(false)
  const [showAllTickets, setShowAllTickets] = useState(false)
  
  const [companySearch, setCompanySearch] = useState("")
  const [ticketSearch, setTicketSearch] = useState("")
  const [ticketFilter, setTicketFilter] = useState("ALL")

  const [profile, setProfile] = useState(null)
  const statusLabels = {

  OPEN: "Abierto",

  IN_PROGRESS: "En progreso",

  CLOSED: "Cerrado"

  }

  const priorityLabels = {

  LOW: "Baja",

  MEDIUM: "Media",

  HIGH: "Alta",

  CRITICAL: "Crítica"

  }

  const getStatusOrder = (status) => {

    switch (status) {

      case "OPEN":
        return 1

      case "IN_PROGRESS":
        return 2

      case "CLOSED":
        return 3

      default:
        return 4

    }

  }

  const sortedTickets = [...myTickets].sort((a, b) => {

    const statusDiff =
      getStatusOrder(a.status) -
      getStatusOrder(b.status)

    if (statusDiff !== 0)
      return statusDiff

    return (
      new Date(b.created_at) -
      new Date(a.created_at)
    )

  })

  const filteredTickets = sortedTickets.filter(

    (ticket) =>

      ticket.title
        .toLowerCase()
        .includes(ticketSearch.toLowerCase())

      ||

      ticket.company_name
        .toLowerCase()
        .includes(ticketSearch.toLowerCase())

      ||

      ticket.id
        .toString()
        .includes(ticketSearch)

  )

  const filteredByStatus = filteredTickets.filter(
    (ticket) => {

      if (ticketFilter === "ALL")
        return true

      return ticket.status === ticketFilter

    }
  )
  
    const displayedTickets =
      showAllTickets
        ? filteredByStatus
        : filteredByStatus.slice(0, 10)
  
  const effectiveness =
    profile?.stats?.total_tickets > 0
      ? Math.round(
          (
            profile.stats.closed_tickets /
            profile.stats.total_tickets
          ) * 100
        )
      : 0

  const getStatusColor = (status) => {

  switch(status){

    case "OPEN":
      return "bg-green-100 text-green-700"

    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700"

    case "CLOSED":
      return "bg-red-100 text-red-700"

    default:
      return "bg-gray-100 text-gray-700"

  }

  }

  useEffect(() => {

    fetchProfile()

  }, [])

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("token")

      const response = await axios.get(

        "https://update-platform-api.onrender.com/platform/profile",

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      )

      setProfile(response.data)
    
    const ticketsResponse = await axios.get(

  "https://update-platform-api.onrender.com/platform/my-tickets",

  {

    headers: {

      Authorization: `Bearer ${token}`

    }

  }

)

setMyTickets(
  ticketsResponse.data
)
    }
    
    catch (error) {

      console.error(error)

    }

  }
  
  if (!profile) {

    return (

      <div className="p-10">

        Cargando...

      </div>

    )

  }

    const filteredCompanies = profile.companies.filter(

    (company) =>

      company.name
        .toLowerCase()
        .includes(
          companySearch.toLowerCase()
        )

  )

  return (

    <>

      <Navbar />
      <div className="flex justify-end bg-white/60 p-3">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Inicio
          </button>
      </div>
            <div className="flex justify-left text-2xl text-xl font-bold bg-white/60 p-4">

            Bienvenido, {profile.first_name}!

      </div>
      <div className="min-h-screen bg-white/60 p-3">

        {/* PERFIL */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">

          <h1 className="text-2xl font-semibold">

            {profile.full_name}

          </h1>

          <p className="text-gray-500 mt-1">

            {profile.email}

          </p>

          <div className="flex gap-2 mt-4">

            <span className="
              px-3 py-1
              rounded-full
              text-xs
              font-semibold
              bg-blue-100
              text-blue-700
            ">

              {profile.role.toUpperCase()}

            </span>

            <span className="
              px-3 py-1
              rounded-full
              text-xs
              font-semibold
              bg-green-100
              text-green-700
            ">

              ACTIVO

            </span>

          </div>

        </div>

{/* KPI DASHBOARD */}

<div className="space-y-6 mb-8">

  {/* FILA SUPERIOR */}

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaBuilding className="text-blue-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Total de Empresas Asignadas
          </p>

          <p className="text-2xl font-bold">
            {profile.stats.companies}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaStore className="text-purple-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Total de Sucursales
          </p>

          <p className="text-2xl font-bold">
            {profile.stats.branches}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaDesktop className="text-cyan-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Total de Equipos
          </p>

          <p className="text-2xl font-bold">
            {profile.stats.equipments}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaCheckCircle className="text-green-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Equipos Activos
          </p>

          <p className="text-2xl font-bold text-green-600">
            {profile.stats.active_equipments}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaTimesCircle className="text-red-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Equipos Inactivos
          </p>

          <p className="text-2xl font-bold text-red-600">
            {profile.stats.inactive_equipments}
          </p>

        </div>

      </div>

    </div>

  </div>

  {/* FILA INFERIOR */}

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaTicketAlt className="text-slate-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Total de Tickets Asignados
          </p>

          <p className="text-2xl font-bold">
            {profile.stats.total_tickets}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaFolderOpen className="text-green-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Tickets Abiertos
          </p>

          <p className="text-2xl font-bold text-green-600">
            {profile.stats.open_tickets}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaSpinner className="text-yellow-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Tickets en Progreso
          </p>

          <p className="text-2xl font-bold text-yellow-600">
            {profile.stats.in_progress_tickets}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaCheckDouble className="text-red-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Tickets Cerrados
          </p>

          <p className="text-2xl font-bold text-red-600">
            {profile.stats.closed_tickets}
          </p>

        </div>

      </div>

    </div>

    <div className="bg-white rounded-2xl p-4 shadow-sm border">

      <div className="flex items-center gap-3">

        <FaChartLine className="text-indigo-600 text-2xl" />

        <div>

          <p className="text-xs text-gray-500">
            Efectividad
          </p>

          <p className="text-2xl font-bold text-indigo-600">
            {effectiveness}%
          </p>

        </div>

      </div>

    </div>

</div>

          <h2 className="text-xl font-bold mb-1">

            Empresas Asignadas

          </h2>
        <input

  type="text"

  placeholder="Buscar empresa..."

  value={companySearch}

  onChange={(e) =>
    setCompanySearch(
      e.target.value
    )
  }

  className="
    w-full
    border
    rounded-xl
    px-4
    py-3
    mb-5
  "

/>
          <div className="bg-white rounded-2xl">

{filteredCompanies
  .slice(
    0,
    showAllCompanies
      ? filteredCompanies.length
      : 10
  )
  .map((company) => (

  <div

    key={company.id}

    className="
      border
      rounded-xl
      p-4
      hover:bg-gray-50
      transition
    "

  >

    <div className="flex justify-between items-start">

      <div>

        <p className="font-semibold text-lg">

          {company.name}

        </p>

        <p className="text-sm text-gray-500">

          ID: #000{company.id}

        </p>

        <div className="mt-5 gap-7 grid grid-cols-4 text-xs text-gray-700">

          <p>
            🏢 Sucursales: {company.branches}
          </p>

          <p>
            🖥️ Equipos: {company.equipments}
          </p>

          <p>
            ✅ Activos: {company.active_equipments}
          </p>

          <p>
            ❌ Inactivos: {company.inactive_equipments}
          </p>

        </div>

      </div>

      <button

        onClick={() =>
          navigate(`/platform/company/${company.id}`)
        }

  className="
    bg-gray-600
    hover:bg-gray-800
    text-white
    px-4
    py-2
    rounded-xl
    text-sm
  "

      >

        Ver Empresa

      </button>

    </div>

  </div>

))}
{filteredCompanies.length > 10 && (

  <div className="mt-4 text-center">

    <button

      onClick={() =>
        setShowAllCompanies(
          !showAllCompanies
        )
      }

      className="
        bg-gray-500
        hover:bg-gray-700
        text-white
        px-5
        py-2
        rounded-xl
        font-semibold
      "

    >

      {showAllCompanies
        ? "Ver menos"
        : `Ver más (${filteredCompanies.length - 10})`
      }

    </button>

  </div>

)}

          </div>
        
        <div className="rounded-3xl shadow-sm mt-3">

  <h2 className="text-xl font-bold mt-5 mb-7">

    Mis Tickets

  </h2>

<div className="flex flex-col md:flex-row gap-3 mb-5">

  <input

    type="text"

    placeholder="Buscar ticket, empresa o número..."

    value={ticketSearch}

    onChange={(e) =>
      setTicketSearch(
        e.target.value
      )
    }

    className="
      flex-1
      border
      rounded-xl
      px-4
      py-3
    "

  />

  <select

    value={ticketFilter}

    onChange={(e) =>
      setTicketFilter(
        e.target.value
      )
    }

    className="
      border
      rounded-xl
      px-4
      py-3
      md:w-56
    "

  >

    <option value="ALL">
      Todos
    </option>

    <option value="OPEN">
      Abiertos
    </option>

    <option value="IN_PROGRESS">
      En progreso
    </option>

    <option value="CLOSED">
      Cerrados
    </option>

  </select>

</div>

  {filteredByStatus.length === 0 ? (

    <p className="text-sm text-gray-500">

      No tienes tickets asignados

    </p>

  ) : (

    <div className="bg-white rounded-xl space-y-3">

      {displayedTickets.map((ticket) => (

        <div

          key={ticket.id}

          className="
            border
            rounded-xl
            p-4
            hover:bg-gray-50
          "

        >

          <div className="flex justify-between">

            <strong>

              #000{ticket.id} - {ticket.title}

            </strong>

<button

  onClick={() =>
    navigate(`/company/:companyId/tickets/${ticket.id}`)
  }

  className="
    bg-[#0f3d3e]
    hover:bg-[#145052]
    text-white
    px-4
    py-2
    rounded-xl
    text-sm
  "

>

  Administrar

</button>
          </div>

          <div className="text-m text-gray-500 mt-1">

            {ticket.company_name}

          </div>

          <div className="text-sm font-semibold mt-2">
              Prioridad: {priorityLabels[ticket.priority]}
          </div>

          <div className="text-sm mt-2">
                Estado:       
        <span
            className={`
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                ${getStatusColor(ticket.status)}
            `}
            > 
            {statusLabels[ticket.status]}
            </span>
            
            <div className="text-sm mt-2">
            <span>
              Fecha de creación: {
                new Date(ticket.created_at)
                .toLocaleString("es-AR", { hour12: false })
              }
            </span>
          </div>
        </div>
    </div>
    ))}
{filteredByStatus.length > 10 && (

  <div className="mt-4 text-center">

    <button

      onClick={() =>
        setShowAllTickets(
          !showAllTickets
        )
      }

      className="
        bg-gray-500
        hover:bg-gray-700
        text-white
        px-5
        py-2
        rounded-xl
        font-semibold
      "

    >

      {showAllTickets
        ? "Ver menos"
        : `Ver más (${filteredByStatus.length - 10})`
      }

    </button>

  </div>

)}
</div>

)}

</div>

        </div>

      </div>

    </>

  )

}

export default Profile