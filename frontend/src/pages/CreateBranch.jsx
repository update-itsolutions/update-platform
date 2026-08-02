import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function CreateBranch() {

  const { companyId } = useParams()

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")

  const handleCreate = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.post(

        "https://update-platform-api.onrender.com/branches/",

        {
          company_id: parseInt(companyId),
          name,
          address,
          city,
          province
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      alert("Sucursal creada correctamente")

      setName("")
      setAddress("")
      setCity("")
      setProvince("")

    }

    catch (error) {

      console.error(error)

      alert(
        error.response?.data?.detail ||
        "Error al crear sucursal"
      )

    }

  }

  return (

    <>
      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">
          {/* TOP BAR */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Inicio
          </button>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Nueva Sucursal
          </h1>

          <p className="text-gray-500 mb-8">
            Registrar nueva ubicación
          </p>

          <div className="grid grid-cols-1 gap-4">

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Nombre de Sucursal
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Dirección
              </label>

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Ciudad
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Provincia
              </label>

              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

          </div>

          <button
            onClick={handleCreate}
            className="mt-8 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Crear Sucursal
          </button>

        </div>

      </div>

    </>
  )

}

export default CreateBranch
