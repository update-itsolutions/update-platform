import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function CreateEquipment() {

  const navigate = useNavigate()
  const [assetTag, setAssetTag] = useState("")
  const [hostname, setHostname] = useState("")
  const [ipAddress, setIpAddress] = useState("")
  const [macAddress, setMacAddress] = useState("")
  const [operatingSystem, setOperatingSystem] = useState("")
  const [notes, setNotes] = useState("")
  const [branchId, setBranchId] = useState("")
  const [branches, setBranches] = useState([])
  const { companyId } = useParams()

  useEffect(() => {

    const fetchBranches = async () => {

      try {

        const token = localStorage.getItem("token")

        const response = await axios.get(

          `http://127.0.0.1:8000/branches/company/${companyId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        )

        setBranches(response.data)

      }

      catch (error) {

        console.error(error)

      }

    }

    fetchBranches()

  }, [])

  const handleCreate = async () => {

    try {

      const token = localStorage.getItem("token")

await axios.post(

  "http://127.0.0.1:8000/equipments/",

  {
    company_id: parseInt(companyId),
    asset_tag: assetTag,
    hostname,
    ip_address: ipAddress,
    mac_address: macAddress,
    branch_id: parseInt(branchId),
    notes
  },

  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

)

      alert("Equipo creado correctamente")

      navigate(`/company/${companyId}/equipments`)

    }

    catch (error) {

      console.error(error)

      alert(
        error.response?.data?.detail ||
        "Error al crear equipo"
      )

    }

  }

  return (

    <>
      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">

        <div className="flex justify-end mb-5">

          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Panel
          </button>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Nuevo Equipo de la Empresa
          </h1>

          <p className="text-gray-500 mb-8">
            Registrar un nuevo equipo en la base de datos
          </p>

          <div className="space-y-4">

            <div>

              <label className="text-sm text-gray-500 block mb-2">
                Identificación de Equipo
              </label>

              <input
                type="text"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 block mb-2">
                Nombre de Equipo
              </label>

              <input
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 block mb-2">
                MAC Address
              </label>

              <input
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div>

            <label className="text-sm text-gray-500 block mb-2">
                Sucursal
            </label>

            <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white"
            >

                <option value="">
                Seleccionar sucursal
                </option>

                {branches.map((branch) => (

                <option
                key={branch.id}
                    value={branch.id}
                >
                    {branch.name}
                </option>

                ))}

            </select>
          {branches.length === 0 && (

  <p className="text-sm text-red-500 mt-2">
    Esta empresa no posee sucursales registradas
  </p>

)}
            </div>

            <div>

              <label className="text-sm text-gray-500 block mb-2">
                Observaciones
              </label>

              <textarea
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

          </div>

          <button
            onClick={handleCreate}
            className="mt-8 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Crear Equipo
          </button>

        </div>

      </div>

    </>

  )

}

export default CreateEquipment
