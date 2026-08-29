import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

function TicketDetail() {
  
  const navigate = useNavigate()

  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [updating, setUpdating] = useState(false)
  const [supportUsers, setSupportUsers] = useState([])
  const [assignedUser, setAssignedUser] = useState("")
  const userRole = localStorage.getItem("role")

  useEffect(() => {

    fetchTicket()

  }, [ticketId])

  const changeStatus = async (newStatus) => {

    try {

      setUpdating(true)

      const token = localStorage.getItem("token")

      await axios.patch(

        `https://update-platform-api.onrender.com/tickets/${ticket.id}/status`,

        {
          status: newStatus
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      fetchTicket()

    }

    catch (error) {

      console.error(error)

    }

    finally {

      setUpdating(false)

    }

  }

  const addComment = async () => {

    if (!newComment.trim()) return

    try {

      const token = localStorage.getItem("token")

      await axios.post(

        `https://update-platform-api.onrender.com/tickets/${ticketId}/comments`,

        {
          comment: newComment
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setNewComment("")

      fetchTicket()

    }

    catch (error) {

      console.error(error)

    }

  }
  
  const assignTicket = async () => {

  try {

    const token = localStorage.getItem("token")

    await axios.patch(

      `https://update-platform-api.onrender.com/tickets/${ticketId}/assign`,

      {

        user_id: parseInt(assignedUser)

      },

      {

        headers: {

          Authorization: `Bearer ${token}`

        }

      }

    )

    alert(
      "Técnico asignado correctamente"
    )

    fetchTicket()

  }

  catch (error) {

    console.error(error)

  }

}
  const fetchTicket = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `https://update-platform-api.onrender.com/tickets/${ticketId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setTicket(response.data)
      
  if (
    userRole === "sysadmin"
  ) {
      const usersResponse = await axios.get(

        "https://update-platform-api.onrender.com/platform/support-users",

        {

            headers: {

                Authorization:
                    `Bearer ${token}`

            }

        }

      )

      setSupportUsers(
          usersResponse.data
      )

      setAssignedUser(
          response.data.assigned_to || ""
      )
    }

      const commentsResponse = await axios.get(

        `https://update-platform-api.onrender.com/tickets/${ticketId}/comments`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setComments(commentsResponse.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  if (!ticket) {

    return (
      <div className="p-10">
        Cargando...
      </div>
    )

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

  return (

    <>

      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">
        <div className="flex justify-end mb-5">

          <button

            onClick={() => navigate(-1)}

            className="
              bg-sky-300
              hover:bg-sky-400
              text-white
              px-5
              py-2
              rounded-xl
              font-semibold
            "

          >
            Volver
          </button>

        </div>

        {/* HEADER */}

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">

          <h1 className="text-3xl font-bold">

            Ticket #000{ticket.id}

          </h1>

          <p className="text-xl text-gray-700 mt-3">

            {ticket.title}

          </p>

        </div>

{userRole === "sysadmin" && (

  <div className="bg-white rounded-2xl p-6 shadow-sm">

    <h3 className="font-semibold mb-4">

      Técnico Asignado

    </h3>

    <select

      value={assignedUser}

      onChange={(e) =>

        setAssignedUser(
          e.target.value
        )

      }

      className="
        w-full
        border
        rounded-xl
        px-4
        py-3
      "

    >

      <option value="">
        Sin asignar
      </option>

      {

        supportUsers.map((user) => (

          <option

            key={user.id}

            value={user.id}

          >

            {user.full_name}

          </option>

        ))

      }

    </select>

    <button

      onClick={assignTicket}

      className="
        mt-4
        bg-[#0f3d3e]
        text-white
        px-5
        py-2
        rounded-xl
      "

    >

      Guardar Asignación

    </button>

  </div>

)}
        {/* GRID */}

        <div className="grid grid-cols-2 gap-6 mt-6">

          {/* DATOS */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-5">

              Información General

            </h2>
          
{(userRole === "sysadmin" || userRole === "support") && (

<div className="mt-1">

  <p className="text-sm text-gray-500 mb-1">
    Cambiar estado:
  </p>

  <div className="flex gap-1">

    <button
      onClick={() => changeStatus("OPEN")}
      className="
        px-3
        py-1
        text-sm
        bg-gray-100
        hover:bg-gray-200
        rounded-lg
        border
      "
    >
      Abierto
    </button>

    <button
      onClick={() => changeStatus("IN_PROGRESS")}
      className="
        px-3
        py-1
        text-sm
        bg-gray-100
        hover:bg-gray-200
        rounded-lg
        border
      "
    >
      En progreso
    </button>

    <button
      onClick={() => changeStatus("CLOSED")}
      className="
        px-3
        py-1
        text-sm
        bg-gray-100
        hover:bg-gray-200
        rounded-lg
        border
      "
    >
      Cerrado
    </button>

  </div>

</div>

)}
    
<div className="space-y-3 mb-6 mt-6">

<div>

  <strong>Estado:</strong>

  <span
    className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
      ticket.status === "OPEN"
        ? "bg-green-100 text-green-700"
        : ticket.status === "IN_PROGRESS"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >

    {statusLabels[ticket.status]}

  </span>

</div>

              <div>

                <strong>Prioridad:</strong>{" "}

                {priorityLabels[ticket.priority]}

              </div>

              <div>

                <strong>Creado por:</strong>{" "}

                {ticket.created_by_name}

              </div>

              <div>

                <strong>Fecha de creación:</strong>{" "}

                {

                  new Date(
                    ticket.created_at
                  ).toLocaleString("es-AR",{ hour12: false })
                  
                }

              </div>

              <div>

                <strong>Última actualización:</strong>{" "}

                {
                  ticket.updated_at
                    ? new Date(
                        ticket.updated_at
                      ).toLocaleString("es-AR", { hour12: false })
                    : "-"
                }

              </div>

              <div>

                <strong>Actualizado por:</strong>{" "}

                {ticket.updated_by_name || "-"}

              </div>
            </div>

          </div>

          {/* EQUIPO */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h2 className="text-xl font-bold mb-5">

              Equipo Asociado

            </h2>

            <div className="space-y-3">

              <div>
                <strong>Empresa:</strong>{" "}
                #000{ticket.company_id} - {ticket.company_name}
              </div>

              <div>
                <strong>Sucursal:</strong>{" "}
                {ticket.branch_name}
              </div>

              <div>
                <strong>Equipo:</strong>{" "}
                {ticket.equipment_name}
              </div>

            </div>

          </div>

        </div>

        {/* DESCRIPCION */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

          <h2 className="text-xl font-bold mb-5">

            Problema Reportado

          </h2>

          <p className="whitespace-pre-wrap text-gray-700">

            {ticket.description}

          </p>

        </div>

        {/* COMENTARIOS */}

<div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

  <h2 className="text-xl font-bold mb-5">

    Comentarios

  </h2>

  <div className="space-y-4">

    {comments.map((comment) => (

      <div

        key={comment.id}

        className="
          border
          rounded-xl
          p-4
        "

      >

        <div className="flex justify-between">

          <span className="font-semibold">

            {comment.user_name}

          </span>

          <span className="text-sm text-gray-500">

            {

              new Date(
                comment.created_at
              ).toLocaleString("es-AR", { hour12: false })

            }

          </span>

        </div>

        <p className="mt-3 text-gray-700">

          {comment.comment}

        </p>

      </div>

    ))}

  </div>
{(userRole === "sysadmin" || userRole === "support") && (
  <div className="mt-6">

    <textarea

      value={newComment}

      onChange={(e) =>
        setNewComment(
          e.target.value
        )
      }

      rows={4}

      placeholder="
      Escribir comentario técnico...
      "

      className="
        w-full
        border
        rounded-xl
        p-3
      "

    />

    <button

      onClick={addComment}

      className="
        mt-3
        bg-[#808080]
        hover:bg-[#a9a9a9]
        text-white
        px-5
        py-2
        rounded-xl
        font-semibold
      "

    >

      Agregar Comentario

    </button>

  </div>
)}
</div>

      </div>

    </>

  )

}

export default TicketDetail

