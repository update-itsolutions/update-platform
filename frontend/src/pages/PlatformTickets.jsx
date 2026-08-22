import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function PlatformTickets() {

  const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [assignedFilter, setAssignedFilter] = useState("") 
  const [supportUsers, setSupportUsers] = useState([])

  useEffect(() => {

    fetchTickets()

  }, [])

  const fetchTickets = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        "https://update-platform-api.onrender.com/platform/tickets",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setTickets(response.data)
  
    
    const usersResponse = await axios.get(

  "https://update-platform-api.onrender.com/platform/support-users",

  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

)

setSupportUsers(usersResponse.data)
    
    }
    
    catch (error) {

      console.error(error)

    }

  }
  
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

const filteredTickets = tickets.filter((ticket) => {

  const text = search.toLowerCase()

  const matchesSearch =

    ticket.title?.toLowerCase().includes(text) ||

    ticket.company_name?.toLowerCase().includes(text) ||

    ticket.equipment_name?.toLowerCase().includes(text) ||

    ticket.status?.toLowerCase().includes(text) ||

    ticket.priority?.toLowerCase().includes(text) ||

    ticket.created_by_name?.toLowerCase().includes(text) ||

    ticket.assigned_user?.toLowerCase().includes(text) ||

    String(ticket.id).includes(text)

  const matchesStatus =

    statusFilter === "ALL" ||

    ticket.status === statusFilter

  const matchesPriority =

    priorityFilter === "ALL" ||

    ticket.priority === priorityFilter

  let matchesAssigned = true

  if (assignedFilter === "unassigned") {

    matchesAssigned = !ticket.assigned_to

  }

  else if (assignedFilter !== "") {

    matchesAssigned =

      String(ticket.assigned_to) ===

      assignedFilter

  }

  return (

    matchesSearch &&

    matchesStatus &&

    matchesPriority &&

    matchesAssigned

  )

})

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
      <div className="min-h-screen bg-white/60 p-3">

        <div className="flex justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Tickets Globales
            </h1>

            <p className="text-gray-500 mt-1">
              Todos los tickets de todas las empresas
            </p>

          </div>


        </div>
<div className="flex gap-3 mb-5">

  <input
    type="text"
    placeholder="Buscar por ticket, empresa, equipo, técnico o usuario..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="
      border
      rounded-xl
      px-4
      py-2
      flex-1
    "
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="
      border
      rounded-xl
      px-4
      py-2
    "
  >
    <option value="ALL">Todos</option>
    <option value="OPEN">Abiertos</option>
    <option value="IN_PROGRESS">En Progreso</option>
    <option value="CLOSED">Cerrados</option>
  </select>
  
  <select
    value={priorityFilter}
    onChange={(e) =>
      setPriorityFilter(e.target.value)
    }
    className="
      border
      rounded-xl
      px-4
      py-2
    "
  >
    <option value="ALL">Todas</option>
    <option value="LOW">Baja</option>
    <option value="MEDIUM">Media</option>
    <option value="HIGH">Alta</option>
    <option value="CRITICAL">Crítica</option>
  </select>
  <select

  value={assignedFilter}

  onChange={(e) =>
    setAssignedFilter(e.target.value)
  }

  className="
    border
    rounded-xl
    px-3
    py-2
  "

>

  <option value="">
    Todos los técnicos
  </option>

  <option value="unassigned">
    Sin asignar
  </option>

  {supportUsers.map((user) => (

    <option
      key={user.id}
      value={user.id}
    >
      {user.full_name}
    </option>

  ))}

</select>

</div>
        <div className="bg-white rounded-3xl shadow-sm p-4">

          <table className="w-full text-xs">

            <thead>

              <tr className="border-b text-center">

                <th className="text-sm text-center py-2">
                  Ticket
                </th>

                <th className="text-sm text-center py-2">
                  Empresa
                </th>

                <th className="text-sm text-center py-2">
                  Equipo
                </th>

                <th className="text-sm text-center py-2">
                  Estado
                </th>

                <th className="text-sm text-center py-2">
                  Prioridad
                </th>

                <th className="text-sm text-center py-2">
                  Creado por
                </th>

                <th className="text-sm text-center py-2">
                  Técnico Asignado
                </th>

                <th className="text-sm text-center py-2">
                  Fecha de creación
                </th>

                <th className="text-sm text-center py-2">
                  Última actualización
                </th>

                <th className="text-sm text-center py-2">
                  Modificado por
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTickets.map((ticket) => (

                <tr
                  key={ticket.id}
                  className="border-b"
                >

                  <td className="text-sm text-center py-3">
                    #000{ticket.id}
                  </td>

                  <td className="text-sm text-center py-3">
                    {ticket.company_name}
                  </td>

                  <td className="text-sm text-center py-3">
                    {ticket.equipment_name}
                  </td>

                  <td className="text-sm text-center py-3">

                 <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    ticket.status === "OPEN"
      ? "bg-green-100 text-green-700"
      : ticket.status === "IN_PROGRESS"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {
    ticket.status === "OPEN"
      ? "Abierto"
      : ticket.status === "IN_PROGRESS"
      ? "En Progreso"
      : "Cerrado"
  }
</span>

                  </td>

                  <td className="text-sm text-center py-2">

                    {priorityLabels[ticket.priority]}

                  </td>

                  <td className="text-sm text-center py-2">

                    {ticket.created_by_name}

                  </td>
<td className="px-3 py-1 rounded-full text-xs font-semibold">

  {ticket.assigned_user ? (

    <span
      className="
        bg-sky-100
        text-sky-700
        px-4
        py-1
        rounded-full
        text-xs
        font-semibold
      "
    >
      {ticket.assigned_user}
    </span>

  ) : (

    <span
      className="
        bg-gray-100
        text-gray-500
        px-4
        py-1
        rounded-full
        text-xs
      "
    >
      Sin asignar
    </span>

  )}

</td>
<td className="text-xs py-2 text-center">
  {ticket.created_at ? (
    <>
      <div>
        {new Date(ticket.created_at).toLocaleDateString()}
      </div>
      <div className="text-gray-500">
        {new Date(ticket.created_at).toLocaleTimeString()}
      </div>
    </>
  ) : (
    "-"
  )}
</td>

<td className="text-xs py-2 text-center">
  {ticket.updated_at ? (
    <>
      <div>
        {new Date(ticket.updated_at).toLocaleDateString()}
      </div>
      <div className="text-gray-500">
        {new Date(ticket.updated_at).toLocaleTimeString("es-AR", { hour12: false })}
      </div>
    </>
  ) : (
    "-"
  )}
</td>

                  <td className="text-sm text-center py-2">

                    {ticket.updated_by_name || "-"}

                  </td>

                  <td>

                    <button

                      onClick={() =>
                        navigate(
                          `/company/:companyId/tickets/${ticket.id}`
                        )
                      }

                      className="
                        bg-[#0F3D3E]
                        hover:bg-[#145052]
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "
                    >
                      Ver Ticket
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </>

  )

}

export default PlatformTickets
