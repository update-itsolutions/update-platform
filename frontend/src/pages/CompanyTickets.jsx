import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
function CompanyTickets() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [tickets, setTickets] = useState([])
  useEffect(() => {
    fetchTickets()
  }, [])
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        "https://update-platform-api.onrender.com/company/tickets",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setTickets(response.data)
    }
    catch (error) {
      console.error(error)
    }
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

    ticket.equipment_name?.toLowerCase().includes(text) ||

    String(ticket.id).includes(text)

  const matchesStatus =

    statusFilter === "ALL" ||

    ticket.status === statusFilter

  const matchesPriority =

    priorityFilter === "ALL" ||

    ticket.priority === priorityFilter

  return (

    matchesSearch &&

    matchesStatus &&

    matchesPriority

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
                  Volver al Dashboard
                </button>
            </div>
      <div className="min-h-screen bg-white/60 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Tickets
          </h1>
          <p className="text-gray-500 mt-1">
            Gestión de tickets de la empresa
          </p>
        </div>
        <div className="flex gap-3 mb-5">

  <input
    type="text"
    placeholder="Buscar por Nº de ticket, equipo o problema relacionado..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-xl px-4 py-2 flex-1"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-xl px-4 py-2"
  >
    <option value="ALL">Todos</option>
    <option value="OPEN">Abiertos</option>
    <option value="IN_PROGRESS">En Progreso</option>
    <option value="CLOSED">Cerrados</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
    className="border rounded-xl px-4 py-2"
  >
    <option value="ALL">Todas</option>
    <option value="LOW">Baja</option>
    <option value="MEDIUM">Media</option>
    <option value="HIGH">Alta</option>
    <option value="CRITICAL">Crítica</option>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b text-center"
                >
                  <td className="text-sm text-center py-3">
                    #000{ticket.id}
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
                          `/company/tickets/${ticket.id}`
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
export default CompanyTickets