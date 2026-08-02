import { useEffect, useState } from "react"
import axios from "axios"

import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

function Profile() {

  const [myTickets, setMyTickets] = useState([])

  const navigate = useNavigate()
 
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

  return (

    <>

      <Navbar />
      <div className="flex justify-end bg-gray-100 p-3">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Inicio
          </button>
      </div>
      <div className="min-h-screen bg-white/60 p-6">

        {/* PERFIL */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">

          <h1 className="text-3xl font-bold">

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

        {/* EMPRESAS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">
<div className="grid grid-cols-4 gap-4 mb-6">

  <div className="bg-white rounded-2xl p-5 shadow-sm">

    <p className="text-gray-500 text-sm">
      🏢Empresas
    </p>

    <p className="text-3xl font-bold mt-2">
      {profile.stats.companies}
    </p>

  </div>

  <div className="bg-white rounded-2xl p-5 shadow-sm">

    <p className="text-gray-500 text-sm">
      🎟️Tickets Abiertos
    </p>

    <p className="text-3xl font-bold text-red-700 mt-2">
      {profile.stats.open_tickets}
    </p>

  </div>

  <div className="bg-white rounded-2xl p-5 shadow-sm">

    <p className="text-gray-500 text-sm">
      ✅Tickets Cerrados
    </p>

    <p className="text-3xl font-bold text-green-600 mt-2">
      {profile.stats.closed_tickets}
    </p>

  </div>

  <div className="bg-white rounded-2xl p-5 shadow-sm">

    <p className="text-gray-500 text-sm">
      🖥️Equipos
    </p>

    <p className="text-3xl font-bold text-blue-600 mt-2">
      {profile.stats.equipments}
    </p>

  </div>

</div>

          <h2 className="text-xl font-bold mb-5">

            Empresas Asignadas

          </h2>
        
          <div className="space-y-3">

            {profile.companies.map(

              (company) => (

                <div

                  key={company.id}

                  className="
                    border
                    rounded-xl
                    p-4
                  "

                >

                  <p className="font-semibold">

                    {company.name}

                  </p>

                  <p className="text-smtext-gray-500">

                    ID: #000{company.id}

                  </p>

                </div>

              )

            )}

          </div>
        
        <div className="bg-white rounded-3xl shadow-sm mt-6">

  <h2 className="text-xl font-bold mb-5">

    Mis Tickets

  </h2>

  {myTickets.length === 0 ? (

    <p className="text-sm text-gray-500">

      No tienes tickets asignados

    </p>

  ) : (

    <div className="space-y-3">

      {myTickets.map((ticket) => (

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
          <div className="text-sm font-bold text-gray-800 mt-2">
            <span>
              Prioridad: {priorityLabels[ticket.priority]}
            </span>
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
        </div>
    </div>
    ))}

</div>

)}

</div>

        </div>

      </div>

    </>

  )

}

export default Profile