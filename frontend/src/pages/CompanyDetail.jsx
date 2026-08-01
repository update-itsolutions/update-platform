import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
function CompanyDetail() {
  const { companyId } = useParams()
  const userRole = localStorage.getItem("role")
  const [data, setData] = useState(null)
  const [search, setSearch] = useState("")
  const [branchSearch, setBranchSearch] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [equipmentSearch, setEquipmentSearch] = useState("")
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

const toggleEquipmentStatus = async (equipmentId) => {

  try {

    const token = localStorage.getItem("token")

    await axios.patch(

      `http://127.0.0.1:8000/equipments/${equipmentId}/toggle-status`,

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
      "Error al actualizar equipo"
    )

  }

}
  const navigate = useNavigate()
  useEffect(() => {
    fetchCompany()
  }, [])
  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `http://127.0.0.1:8000/platform/company/${companyId}`,
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
        {/* TOP BAR */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() =>
              navigate(`/platform`)
        }
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Panel
          </button>
        </div>
        {/* HEADER EMPRESA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          {/* TITULO */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              {data.company?.name || "-"}
            </h1>
            <p className="text-gray-500 mt-1">
              Información general de la empresa
            </p>
            {["sysadmin"].includes(userRole) && (
            <button

  onClick={() =>
    navigate(`/platform/company/${companyId}/edit`)
  }

  className="
    bg-amber-500
    hover:bg-amber-600
    text-white
    px-2
    py-1
    rounded-xl
    text-sm
    font-semibold
    mt-3
  "

>

  Editar Empresa

</button>
)}
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
        {/* ACTIONS */}
<div className="flex gap-4 mb-6">

  {userRole === "sysadmin" && (

    <button
      onClick={() =>
        navigate(`/company/${companyId}/branch/create`)
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

  {["sysadmin", "admin_empresa"].includes(userRole) && (

    <button
      onClick={() =>
        navigate(`/company/${companyId}/users/create`)
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
          Personal de la Empresa
        </p>

      </div>

    </button>

  )}
  {["sysadmin", "support"].includes(userRole) && ( 
  <button
    onClick={() => navigate(`/company/${companyId}/equipments`)}
    className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4 transition"
  >
  <div className="relative">

    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center text-2xl">
      💻
    </div>
    <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow">
      +
    </div>
  </div>
  <div className="text-left">
    <p className="font-semibold text-gray-800">
      Gestionar Equipos
    </p>

    <p className="text-sm text-gray-500">
      Equipos de la Empresa
    </p>
    </div>  
</button> 
)}

</div>
        {/* BRANCHES */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Sucursales
          </h2>
                    <div className="space-y-3">
            <input
              type="text"
              placeholder="Buscar sucursal por nombre o dirección..."
              value={branchSearch}
              onChange={(e) => setBranchSearch(e.target.value)}
              className="
                  border
                border-gray-300
                rounded-xl
                px-4
                py-3
                w-full
                mb-4
                "
                />
            {data.branches
            .filter((branch) => {

    if (!branchSearch) return true

    return (
      branch.name?.toLowerCase().includes(
        branchSearch.toLowerCase()
      ) ||

      branch.address?.toLowerCase().includes(
        branchSearch.toLowerCase()
      )
    )

  })
  .map((branch) => (
    
    <div
      key={branch.id}
      className="border rounded-xl p-4"
    >

      <h3 className="font-bold">
        {branch.name}
      </h3>

      <p className="text-gray-500 text-sm">
        📍{branch.address}
      </p>
    <button
  onClick={() =>
    navigate(
      `/company/${companyId}/branch/${branch.id}/edit`
    )
  }
  className="
    mt-3
    bg-amber-500
    hover:bg-amber-600
    text-white
    px-2
    py-1
    rounded-xl
    text-sm
  "
>
  Editar Sucursal
</button>
    </div>

))}
          </div>
        </div>
        {/* USERS */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Usuarios
          </h2>
          <div className="space-y-3">
          <input
              type="text"
              placeholder="Buscar usuario por nombre, email o rol..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
                w-full
                mb-4
                "
              />
            {data.users
            .filter((user) => {
              if (!userSearch) return true;

              return (
                user.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email?.toLowerCase().includes(userSearch.toLowerCase())
              );
            })
            .map((user) => (
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

    className="px-2 py-1 rounded-md bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium"

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

<div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">

  <h2 className="text-2xl font-bold mb-4">
    Equipos
  </h2>

  <input
    type="text"
    placeholder="Buscar equipo por nombre o sucursal..."
    value={equipmentSearch}
    onChange={(e) => setEquipmentSearch(e.target.value)}
    className="
      border
      border-gray-300
      rounded-xl
      px-4
      py-3
      w-full
      mb-4
    "
  />

  <div className="space-y-3">

    {data.equipments
      .filter((eq) => {

        if (!equipmentSearch) return true

        return (

          eq.hostname
            ?.toLowerCase()
            .includes(
              equipmentSearch.toLowerCase()
            )

          ||

          eq.branch_name
            ?.toLowerCase()
            .includes(
              equipmentSearch.toLowerCase()
            )

        )

      })
      .map((eq) => (

        <div
          key={eq.id}
          className="border rounded-xl p-4"
        >

<h3 className="font-bold">
  💻{eq.hostname}
</h3>

<p className="text-gray-500 text-sm">
  📍{eq.branch_name}
</p>

<p
  className={`text-sm mt-1 font-semibold ${
    eq.is_active
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {eq.is_active
    ? "Activo"
    : "Inactivo"}
</p>

<div className="mt-3 flex gap-2">

  <button

    onClick={() =>
      toggleEquipmentStatus(eq.id)
    }

    className={`px-3 py-1 rounded-md text-white text-sm font-medium transition ${
      eq.is_active
        ? "bg-red-500 hover:bg-red-600"
        : "bg-green-500 hover:bg-green-600"
    }`}

  >

    {eq.is_active
      ? "Desactivar"
      : "Activar"}

  </button>

</div>

        </div>

      ))}

  </div>

</div>
      </div>
    </>
  )
}
export default CompanyDetail

