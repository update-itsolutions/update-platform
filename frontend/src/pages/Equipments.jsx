import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import { jwtDecode } from "jwt-decode"

function Equipments() {

  const token = localStorage.getItem("token")
  const decoded = jwtDecode(token)
  const isSysAdmin = 
    decoded.sub === "sysadmin@update.com"
  const navigate = useNavigate()
  const { companyId } = useParams()

  const [equipments, setEquipments] = useState([])

  useEffect(() => {

    fetchEquipments()

  }, [])

  const fetchEquipments = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(
        `https://update-platform-api.onrender.com/equipments/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setEquipments(response.data)

    }

    catch (error) {

      console.error(error)

    }

  }
  
  return (

    <>
      <Navbar />    
      
      <div className="min-h-screen bg-white/60 p-6">

        <div className="flex justify-end mb-5">

          <button
            onClick={() => navigate(`/platform/company/${companyId}/`)()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver a la Empresa
          </button>

        </div>
        

{ isSysAdmin && (

<div
  onClick={() =>
    navigate(`/company/${companyId}/equipments/create`)
  }
  className="
    w-full
    border-2
    border-dashed
    border-gray-300
    rounded-3xl
    py-3
    mb-2
    cursor-pointer
    hover:border-[#0F3D3E]
    hover:bg-gray-50
    transition
    flex
    flex-col
    items-center
    justify-center
  "
>

  <div className="text-5xl text-[#0F3D3E] font-light">
    +
  </div>

  <h2 className="mt-2 text-lg font-semibold text-gray-700">
    Registrar Nuevo Equipo
  </h2>

  <p className="text-sm text-gray-500 mt-1">
    Agregar un equipo manualmente
  </p>

</div>
)}

<h1 className="text-3xl mt-8 font-bold text-gray-800">
  Equipos
</h1>

<p className="text-gray-500 mt-1 mb-6">
  Administración de equipos registrados de la empresa
</p>

        <div className="space-y-10 mt-6">

          {equipments.map((eq) => (

<div
  key={eq.id}
  className="bg-white rounded-2xl p-5 shadow-sm border"
>

  <div className="flex justify-between items-center">

    <div>

      <h2 className="font-bold text-lg">
        {eq.asset_tag || "Sin Asset Tag"}
      </h2>

      <p className="text-gray-700">
        {eq.hostname}
      </p>

      <p className="text-gray-500 text-sm">
        📍{eq.branch_name}
      </p>

    </div>

    <div className="flex items-center gap-8">

      <div className="text-right">

        <p
          className={`font-semibold ${
            eq.is_online
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {eq.is_online
            ? "Online"
            : "Offline"}
        </p>

        <p
          className={`font-semibold ${
            eq.is_active
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {eq.is_active
            ? "Activo"
            : "Inactivo"}
        </p>

      </div>

      <button

        onClick={() =>
          navigate(
            `/company/${companyId}/equipment/${eq.id}`
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
        "

      >

        Administrar

      </button>

    </div>

  </div>

</div>

          ))}

        </div>

      </div>

    </>

  )

}

export default Equipments


