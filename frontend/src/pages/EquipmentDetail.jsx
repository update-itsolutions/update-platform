import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import Navbar from "../components/Navbar"
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
  FaInfo,
  FaInfoCircle,
  FaNotesMedical,
  FaEvernote,
  FaPrint,
  FaList,
  FaRegListAlt,
  FaArrowAltCircleUp,
  FaArrowsAlt,
  FaLongArrowAltUp,
  FaArrowAltCircleDown,
  FaLaptop,
  FaTicketAlt
} from "react-icons/fa"


function EquipmentDetail() {
  
  const navigate = useNavigate ()
  const { companyId, equipmentId } = useParams()
  const [history, setHistory] = useState([])
  const [visibleHistory, setVisibleHistory] = useState(5)
  const [tickets, setTickets] = useState([])
  const [equipment, setEquipment] = useState(null)
  const [searchTicket, setSearchTicket] = useState("")
  const [visibleTickets, setVisibleTicket] = useState("10")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const token = localStorage.getItem("token")
  const decoded = jwtDecode(token)
  const role = decoded.role?.toLowerCase()

const isAdminEmpresa =
  decoded.role === "administrador"

const isSupport =
  decoded.role === "support"

const isSysAdmin =
  decoded.role === "sysadmin"

  useEffect(() => {

    fetchEquipment()

  }, [])

  const fetchEquipment = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `https://update-platform-api.onrender.com/equipment/${equipmentId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setEquipment(response.data)
    
    const historyResponse = await axios.get(
        `https://update-platform-api.onrender.com/equipments/${equipmentId}/history`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    setHistory(historyResponse.data)

    const ticketsResponse = await axios.get(
        `https://update-platform-api.onrender.com/equipments/${equipmentId}/tickets`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    setTickets(ticketsResponse.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  if (!equipment) {

    return (
      <div className="p-10">
        Cargando...
      </div>
    )

  }

  return (

    console.log (tickets),

    <>
      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">

        {/* TOP BAR */}
{isSysAdmin && (
        <div className="flex justify-end mb-5">

          <button
            onClick={() => navigate(`/company/${companyId}/equipments/`)()}
            className="
              bg-sky-300
              hover:bg-sky-400
              text-white
              px-5
              py-2
              rounded-xl
              transition
              font-semibold
              shadow-sm
            "
          >
            Volver a Equipos
          </button>

        </div>
)}
{isSupport && (
        <div className="flex justify-end mb-5">

          <button
            onClick={() => navigate(`/company/${companyId}/equipments/`)()}
            className="
              bg-sky-300
              hover:bg-sky-400
              text-white
              px-5
              py-2
              rounded-xl
              transition
              font-semibold
              shadow-sm
            "
          >
            Volver a Equipos
          </button>

        </div>
)}
{isAdminEmpresa && (
        <div className="flex justify-end mb-5">

          <button
            onClick={() => navigate(`/company/equipments/`)()}
            className="
              bg-sky-300
              hover:bg-sky-400
              text-white
              px-5
              py-2
              rounded-xl
              transition
              font-semibold
              shadow-sm
            "
          >
            Volver a Equipos
          </button>

        </div>
)}
        {/* HEADER */}

        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">

          <div className="flex justify-between items-start">

            <div>
                
            <h1 className="text-4xl font-bold mb-5 flex items-center gap-5">
                {equipment.asset_tag || "Sin Asset Tag"}
                    <FaLaptop className="text-[#171718]" /> 
            </h1>
            

              <p className="text-xl text-gray-600 mt-2">
                {equipment.hostname}
              </p>

              <p className="text-gray-500 mt-2">
                📍 {equipment.branch_name}
              </p>

            </div>

            <div className="text-right">

              <p
                className={`font-bold text-lg ${
                  equipment.is_active
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {equipment.is_active
                  ? "Activo"
                  : "Inactivo"}
              </p>

              <p
                className={`font-bold text-lg ${
                  equipment.is_online
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {equipment.is_online
                  ? "Online"
                  : "Offline"}
              </p>
            {isSysAdmin && (

<button
  onClick={() =>
    navigate(
      `/company/${companyId}/equipment/${equipmentId}/edit`
    )
  }
  className="
    bg-[#0F3D3E]
    hover:bg-[#145052]
    text-white
    mt-4
    px-3
    py-1
    rounded-xl
    font-semibold
  "
>
  Editar Equipo
</button>

  )}
            </div>

          </div>

        </div>

        {/* GRID */}

        <div className="grid grid-cols-2 gap-6">

          {/* INFORMACION GENERAL */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Información General
           <FaInfoCircle className="text-[#171718]" /> 
        </h1>

            <div className="space-y-3">

              <div>
                <span className="font-semibold">
                  ID de Equipo:
                </span>{" "}
                {equipment.asset_tag || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Nombre de Equipo:
                </span>{" "}
                {equipment.hostname || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Sucursal:
                </span>{" "}
                {equipment.branch_name || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  IP:
                </span>{" "}
                {equipment.ip_address || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  MAC ADDRESS:
                </span>{" "}
                {equipment.mac_address || "Sin datos"}
              </div>

            </div>

          </div>

          {/* HARDWARE */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Hardware 
           <FaCogs className="text-[#171718]" /> 
        </h1>

            <div className="space-y-3">

              <div>
                <span className="font-semibold">
                  CPU:
                </span>{" "}
                {equipment.cpu || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Memoria RAM:
                </span>{" "}
                {equipment.ram || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Almacenamiento:
                </span>{" "}
                {equipment.disk_total || "Sin datos"}
              </div>

            </div>

          </div>

          {/* SISTEMA OPERATIVO */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Sistema Operativo
           <FaWindows className="text-[#171718]" /> 
        </h1>

            <div className="space-y-3">

              <div>
                <span className="font-semibold">
                  OS:
                </span>{" "}
                {equipment.operating_system || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Versión:
                </span>{" "}
                {equipment.windows_version || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Usuario Logeado:
                </span>{" "}
                {equipment.logged_user || "Sin datos"}
              </div>

            </div>

          </div>

          {/* ESTADO */}

          <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Estado General
           <FaCheckCircle className="text-[#171718]" /> 
        </h1>

            <div className="space-y-3">

              <div>
                <span className="font-semibold">
                  Estado Equipo:
                </span>{" "}
                {equipment.is_active
                  ? "Activo"
                  : "Inactivo"}
              </div>

              <div>
                <span className="font-semibold">
                  Conectividad:
                </span>{" "}
                {equipment.is_online
                  ? "Online"
                  : "Offline"}
              </div>

              <div>
                <span className="font-semibold">
                  Tiempo de Encendido:
                </span>{" "}
                {equipment.uptime || "Sin datos"}
              </div>

              <div>
                <span className="font-semibold">
                  Última conexión:
                </span>{" "}
              { equipment.last_seen
                  ? new Date(equipment.last_seen).toLocaleString(
                      "es-AR",{ hour12: false }
                    )
                  : "Nunca conectado"
              }
                </div>

            </div>

          </div>

        </div>

        {/* OBSERVACIONES */}

        <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Observaciones
           <FaRegListAlt className="text-[#171718]" /> 
        </h1>

          <p className="text-gray-700 whitespace-pre-wrap">
            {equipment.notes || "Sin observaciones"}
          </p>

        </div>
    
    {/* ALERTAS Y ESTADO */}

<div className="bg-white rounded-3xl p-6 shadow-sm mt-8">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Estados y Alertas
           <FaExclamationTriangle className="text-[#171718]" /> 
        </h1>

  <div className="space-y-4">

    {/* ONLINE */}

    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Estado de Conectividad
      </span>

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          equipment.is_online
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {equipment.is_online
          ? "Online"
          : "Offline"}
      </span>

    </div>

    {/* ACTIVO */}

    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Estado Administrativo
      </span>

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          equipment.is_active
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {equipment.is_active
          ? "Activo"
          : "Inactivo"}
      </span>

    </div>

    {/* ANTIVIRUS */}
    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Antivirus
      </span>

      <span
        className={`font-semibold ${
          equipment.antivirus_enabled
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {
          equipment.antivirus_enabled
            ? "Activado"
            : "Desactivado"
        }
      </span>

    </div>
    
    {/* FIREWALL */}
    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Firewall
      </span>

      <span
        className={`font-semibold ${
          equipment.firewall_enabled
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {
          equipment.firewall_enabled
            ? "Activo"
            : "Desactivado"
        }
      </span>

    </div>

    {/* USO DE DISCO */}

    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Uso de Disco
      </span>

 <div className="text-right">

    {(equipment.disk_usage || "")
      .split("|")
      .map((disk, index) => {

        const percentMatch =
          disk.match(/(\d+(\.\d+)?)%/)

        const percent =
          percentMatch
            ? parseFloat(percentMatch[1])
            : 0

        return (

          <div
            key={index}
            className={`font-semibold ${
              percent >= 91
                ? "text-red-600"
                : percent >= 70
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {disk.trim()}
          </div>

        )

      })}

  </div>

</div>

    {/* USO DE MEMORIA RAM */}

    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Uso de Memoria RAM
      </span>

  <span
    className={`font-semibold ${
      equipment.ram_usage >= 91
        ? "text-red-600"
        : equipment.ram_usage >= 70
        ? "text-yellow-500"
        : "text-green-500"
    }`}
  >
    {equipment.ram_usage || 0}%
  </span>

</div>

    {/* TIEMPO DE ENCENDIDO */}

    <div className="flex justify-between items-center border-b pb-3">

      <span className="font-ligth">
        Tiempo de Encendido
      </span>
      <div>
              <span className="text-gray-600">{" "}
              {equipment.uptime || "Sin datos"}
              </span>
            </div>

        </div>

    {/* ULTIMA CONEXION */}

    <div className="flex justify-between items-center">

      <span className="font-ligth">
        Última Conexión
      </span>

      <span className="text-gray-600">

      { equipment.last_seen
          ? new Date(equipment.last_seen).toLocaleString(
              "es-AR",{ hour12: false }
            )
          : "Nunca conectado"
      }

      </span>

    </div>

  </div>

</div>
{/* HISTORIAL */}
<div className="bg-white rounded-2xl p-6 shadow-sm border mt-6">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Historial
           <FaClock className="text-[#171718]" /> 
        </h1>

  {history
    .slice(0, visibleHistory)
    .map((item) => (

    <div
      key={item.description}
      className="border-b py-3"
    >

      <p className="font-medium">
        {item.description}
      </p>

      <p className="text-sm text-gray-500">
        {new Date(item.created_at)
          .toLocaleString(
              "es-AR",{ hour12: false }
          )}
      </p>

    </div>

  ))}
{history.length > visibleHistory && (

  <div className="mt-4 text-center">

    <button

      onClick={() =>
        setVisibleHistory(
          visibleHistory + 5
        )
      }

      className="
        px-4
        py-2
        rounded-xl
        border
        bg-gray-50
        hover:bg-gray-100
        text-gray-700
        font-medium
      "

    >

      Ver más

    </button>

  </div>

)}
{visibleHistory > 5 && (

  <div className="mt-3 text-center">

    <button

      onClick={() =>
        setVisibleHistory(5)
      }

      className="
        px-4
        py-2
        rounded-xl
        border
        bg-gray-50
        hover:bg-gray-100
        text-gray-700
        font-medium
      "

    >

      Ver menos

    </button>

  </div>

)}

</div>
{/* TICKETS */}
<div className="bg-white rounded-2xl p-6 shadow-sm border mt-6">

  <div className="flex justify-between mb-4">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Tickets Asociados
           <FaTicketAlt className="text-[#171718]" /> 
        </h1>

<button
  onClick={() =>
    navigate(
      `/company/${companyId}/equipment/${equipmentId}/ticket/create`
    )
  }
  className="
    bg-[#0F3D3E]
    hover:bg-[#145052]
    text-white
    px-5
    py-2
    rounded-xl
    font-semibold
    transition
    flex
    items-center
    gap-2
  "
>
  <FaTicketAlt />
  Crear Ticket
</button>
  </div>

{tickets
  .slice(0, visibleTickets)
  .map((ticket) => {

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

    <div
      key={ticket.id}
      className="border rounded-xl p-4 mb-4"
    >

      <div className="flex justify-between items-start">

        <div className="flex-1">

          <p className="font-bold text-lg">
            #000{ticket.id} - {ticket.title}
          </p>

          <p className="text-gray-700 mt-2">
            {ticket.description}
          </p>

          <div className="mt-3 space-y-1 text-sm text-gray-600">

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

            <p className="mt-3 space-y-1 font-bold text-sm text-gray-600">
            Prioridad: {priorityLabels[ticket.priority]}
            </p>
        
            <p>
              Creado por: {ticket.created_by_name}
            </p>

            <p>
              Fecha de creación: {
                new Date(ticket.created_at)
                .toLocaleString("es-AR", { hour12: false })
              }
            </p>

            <p>
              Última actualización: {
                new Date(ticket.updated_at)
                .toLocaleString("es-AR", { hour12: false })
              }
            </p>

          </div>

        </div>

        <button

          onClick={() =>
            navigate(
              `/company/${companyId}/tickets/${ticket.id}`
            )
          }

          className="
            bg-[#808080]
            hover:bg-[#a9a9a9]
            text-white
            px-4
            py-2
            rounded-xl
            font-semibold
            transition
            ml-4
          "

        >

          Ver Ticket

        </button>

      </div>
{tickets.length > visibleTickets && (

  <div className="mt-4 text-center">

    <button

      onClick={() =>
        setVisibleTickets(
          visibleTickets + 10
        )
      }

      className="
        px-4
        py-2
        rounded-xl
        border
        bg-gray-50
        hover:bg-gray-100
        text-gray-700
        font-medium
      "

    >

      Ver más tickets

    </button>

  </div>

)}
{visibleTickets > 10 && (

  <div className="mt-3 text-center">

    <button

      onClick={() =>
        setVisibleTickets(10)
      }

      className="
        px-4
        py-2
        rounded-xl
        border
        bg-gray-50
        hover:bg-gray-100
        text-gray-700
        font-medium
      "

    >

      Ver menos

    </button>

  </div>

)}
    </div>

  )

})}

</div>

        {/* ACCIONES */}
        {(isSysAdmin || isSupport) && (
        <div className="bg-white rounded-3xl p-6 shadow-sm mt-6">

        <h1 className="text-xl font-bold mb-5 flex items-center gap-5">
          Acciones Remotas
           <FaArrowAltCircleDown className="text-[#171718]" /> 
        </h1>

          <div className="flex gap-4 flex-wrap">

            <button
              disabled
              className="
                bg-gray-300
                text-gray-600
                px-5
                py-3
                rounded-xl
                cursor-not-allowed
              "
            >
              Reiniciar
            </button>

            <button
              disabled
              className="
                bg-gray-300
                text-gray-600
                px-5
                py-3
                rounded-xl
                cursor-not-allowed
              "
            >
              Apagar
            </button>

            <button
              disabled
              className="
                bg-gray-300
                text-gray-600
                px-5
                py-3
                rounded-xl
                cursor-not-allowed
              "
            >
              Ejecutar Script
            </button>

            <button
              disabled
              className="
                bg-gray-300
                text-gray-600
                px-5
                py-3
                rounded-xl
                cursor-not-allowed
              "
            >
              Abrir Terminal
            </button>

          </div>

          <p className="text-gray-500 text-sm mt-4">
            Próximamente disponible.
          </p>

        </div>
          )}
      </div>

    </>

  )

}

export default EquipmentDetail