import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import {
  FaBuilding,
  FaUsers,
  FaDesktop,
  FaMapMarkerAlt
} from "react-icons/fa"

function CompanyHome() {
  const navigate = useNavigate()

const [data, setData] = useState(null)
const [search, setSearch] = useState("")


const toggleUserStatus = async (userId) => {

  try {

    const token = localStorage.getItem("token")

    await axios.patch(

      `http://127.0.0.1:8000/users/${userId}/toggle-status`,

      {},

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )

    fetchCompany()

  }

  catch (error) {

    console.error(error)

    alert(
      error.response?.data?.detail ||
      "Error al actualizar usuario"
    )

  }

}

const userRole = localStorage.getItem("role")

useEffect(() => {

  fetchCompany()

}, [])

  const fetchCompany = async () => {

  try {

    const token = localStorage.getItem("token")

    const response = await axios.get(
      "http://127.0.0.1:8000/company/home/",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setData(response.data)

  }

  catch (error) {

    console.error(error)

  }

}

  if (!data) {
    return (
      <div className="p-10">
        Cargando...
      </div>
    )
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white/60 p-6">
        {/* WELCOME */}

        <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-200">

        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          Bienvenido, {data.company?.name} 
           <FaBuilding className="text-[#0b2b33]" /> 
        </h1>

          <p className="text-xs text-gray-600">
            Empresa ID #000{data.company?.id}
          </p>

          <p className="mt-3 text-gray-500">
            Gestioná sucursales, equipos y usuarios de tu empresa desde un único lugar.
          </p>

        </div>
                {/* ACTIONS */}
<div className="flex gap-4 mb-6">

  {userRole === "sysadmin" && (

    <button
      onClick={() =>
        navigate(`/company/${data.company.id}/branch/create`)
      }
      className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
    >

      <div className="relative">

        <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
          📍
        </div>

        <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow">
          +
        </div>

      </div>

      <div className="text-left">

        <p className="font-semibold text-gray-800">
          Crear Sucursal
        </p>

        <p className="text-sm text-gray-500">
          Nueva ubicación
        </p>

      </div>

    </button>

  )}

  {["sysadmin", "administrador"].includes(userRole) && (

    <button
      onClick={() =>
        navigate(`/company/${data.company.id}/users/create`)
      }
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
          Crear Usuario
        </p>

        <p className="text-sm text-gray-500">
          Personal de tu empresa
        </p>

      </div>

    </button>

  )}

  {["sysadmin", "administrador", "supervisor", "viewer"].includes(userRole) && (
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
      >

        <div className="relative">

          <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
            🖥️
          </div>

        </div>

        <div className="text-left">

          <p className="font-semibold text-gray-800">
            Ir al Dashboard
          </p>

          <p className="text-sm text-gray-500">
            Equipos y monitoreo
          </p>

        </div>

      </button>
      
  )}

  </div>
        {/* KPI CARDS */}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
    {data.stats?.branches || 0}
  </p>

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Sucursales registradas de tu empresa
  </p>

</div>
{/* EQUIPOS */}

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

  {/* Icono decorativo de fondo */}

  <FaDesktop
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

    <FaDesktop size={28} />

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
    Total de Equipos
  </h3>

  {/* Número */}

  <p
    className="
      text-5xl
      font-bold
      mt-3
    "
  >
    {data.stats?.equipments || 0}
  </p>

  {/* Información secundaria */}

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Equipos registrados de tu empresa
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
    {data.stats?.users || 0}
  </p>

  <p
    className="
      mt-4
      text-sm
      text-white/80
    "
  >
    Usuarios registrados de tu empresa
  </p>

</div>
        </div>
        {/* HEADER EMPRESA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          {/* TITULO */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {data.company?.name || "-"}
            </h1>
            <p className="text-gray-500 mt-1">
              Información general de tu empresa
            </p>
          </div>
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-500">
                ID Empresa
              </p>
              <p className="font-medium text-sm text-gray-700">
                #000{data.company?.id || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Razón Social
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.business_name || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                CUIT
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.tax_id || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Rubro
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.industry || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Teléfono
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.phone || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.email || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Direccion
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.address || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Ciudad
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.city || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Provincia
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.province || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Pais
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.country || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Código Postal
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.postal_code || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Sitio Web
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.website || "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">
                Observaciones
              </p>
              <p className="font-medium text-sm text-gray-700">
                {data.company?.notes || "-"}
              </p>
            </div>
          </div>
        </div>
        {/* BRANCHES */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">
            Tus Sucursales
          </h1>
          <div className="space-y-4">
            
            {data.branches.map((branch) => (
              <div
                key={branch.name}
                className="border rounded-xl p-4"
              >
                <h3 className="font-bold">
                  {branch.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  📍{branch.address}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* USERS */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Tus Usuarios
          </h2>
          <div className="space-y-3">
            {data.users.map((user) => (
              <div
                key={user.id}
                className="border rounded-xl p-4"
              >
                <h3 className="font-bold">
                  {user.full_name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {user.email}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  {{
                    administrador: "Administrador",
                    supervisor: "Supervisor",
                    viewer: "Invitado"
                  }[user.role] || user.role}
                </p>  
                <p className={`text-sm mt-1 font-semibold ${user.is_active ? "text-green-600" : "text-red-600"}`}>
                  {user.is_active ? "Activo" : "Inactivo"}
                </p>
                <div className="mt-3 flex gap-2">
  {(["sysadmin", "administrador"].includes(userRole)) && (
  <button

    onClick={() =>
      navigate(`/company/users/${user.id}/edit`)
    }

    className="px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium"

  >
    Editar
  </button>
  )}
  {(["sysadmin", "administrador"].includes(userRole)) && (
  <button

  onClick={() =>
    navigate(`/company/users/${user.id}/password`)
  }

  className="px-3 py-1 rounded-md bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium transition"

>

  Cambiar Contraseña

</button>
  )}
  {(["sysadmin", "administrador", "supervisor"].includes(userRole)) && (
  <button

    onClick={() => toggleUserStatus(user.id)}

    className={`px-3 py-1 rounded-md text-white text-sm font-medium transition ${
      user.is_active
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600"
    }`}

  >

    {user.is_active
      ? "Desactivar"
      : "Activar"}

  </button>
  )}
</div>
              </div>
            ))}
          </div>
        </div>
        {/* EQUIPMENTS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Tus Equipos
          </h2>
          <div className="space-y-3">
            {data.equipments.map((eq) => (
              <div
                key={eq.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">
                    💻{eq.hostname}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    📍 {eq.branch_name}
                  </p>
                </div>
                <div>
<p className={`text-sm mt-1 font-semibold ${
  eq.is_active
    ? "text-green-600"
    : "text-red-600"
}`}>
  {eq.is_active
    ? "Activo"
    : "Inactivo"}
</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default CompanyHome
