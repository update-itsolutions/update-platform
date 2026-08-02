import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function EditBranch() {

  const navigate = useNavigate()

  const { companyId, branchId } = useParams()

  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [province, setProvince] = useState("")

  useEffect(() => {

    fetchBranch()

  }, [])

  const fetchBranch = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `https://update-platform-api.onrender.com/branches/${branchId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setName(response.data.name || "")
      setAddress(response.data.address || "")
      setCity(response.data.city || "")
      setProvince(response.data.province || "")

    }

    catch (error) {

      console.error(error)

      alert("Error al cargar sucursal")

    }

  }

  const handleUpdate = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.put(

        `https://update-platform-api.onrender.com/branches/${branchId}`,

        {

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

      alert("Sucursal actualizada correctamente")

      navigate(`/platform/company/${companyId}`)

    }

    catch (error) {

      console.error(error)

      alert(

        error.response?.data?.detail ||

        "Error al actualizar sucursal"

      )

    }

  }

  return (

    <>

      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">

        <div className="flex justify-end mb-5">

          <button
            onClick={() =>
              navigate(`/platform`)
          }
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >

            Volver al panel

          </button>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">

            Editar Sucursal

          </h1>

          <p className="text-gray-500 mb-8">

            Modificar información de la sucursal

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

            onClick={handleUpdate}

            className="mt-8 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold"

          >

            Guardar Cambios

          </button>

        </div>

      </div>

    </>

  )

}

export default EditBranch
