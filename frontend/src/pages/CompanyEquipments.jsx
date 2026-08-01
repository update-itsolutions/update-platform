import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function CompanyEquipments() {

  const navigate = useNavigate()

  const [equipments, setEquipments] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {

    fetchEquipments()

  }, [])

  const fetchEquipments = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        "http://127.0.0.1:8000/company/equipments",

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

  const filteredEquipments = equipments.filter((eq) => {

    const text = search.toLowerCase()

    return (

      eq.hostname?.toLowerCase().includes(text) ||

      eq.asset_tag?.toLowerCase().includes(text) ||

      eq.branch_name?.toLowerCase().includes(text) ||

      String(eq.id).includes(text)

    )

  })

  return (

    <>

      <Navbar />

      <div className="flex justify-end bg-white/60 p-3">

        <button

          onClick={() => navigate(`/dashboard`)()}

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

          Volver al Dashboard

        </button>

      </div>

      <div className="min-h-screen bg-white/60 p-6">

        <h1 className="text-3xl font-bold">

          Equipos

        </h1>

        <p className="text-gray-500 mt-1 mb-6">

          Equipos registrados de la empresa

        </p>

        <div className="mb-5">

          <input

            type="text"

            placeholder="Buscar equipo..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }

            className="
              border
              rounded-xl
              px-4
              py-2
              w-full
            "

          />

        </div>

        <div className="bg-white rounded-3xl shadow-sm p-4">

          <table className="w-full text-xs">

            <thead>

              <tr className="border-b text-center">

                <th className="py-2">
                  ID
                </th>

                <th className="py-2">
                  Equipo
                </th>

                <th className="py-2">
                  Sucursal
                </th>

                <th className="py-2">
                  Online
                </th>

                <th className="py-2">
                  Estado
                </th>

                <th className="py-2">
                  Acción
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEquipments.map((eq) => (

                <tr
                  key={eq.id}
                  className="border-b text-center"
                >

                  <td className="py-3">
                    {eq.id}
                  </td>

                  <td className="py-3">
                    {eq.hostname}
                  </td>

                  <td className="py-3">
                    {eq.branch_name}
                  </td>

                  <td className="py-3">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        eq.is_online
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {eq.is_online
                        ? "Online"
                        : "Offline"}

                    </span>

                  </td>

                  <td className="py-3">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        eq.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {eq.is_active
                        ? "Activo"
                        : "Inactivo"}

                    </span>

                  </td>

                  <td className="py-3">

                    <button

                      onClick={() =>
                        navigate(
                          `/company/1/equipment/${eq.id}`
                        )
                      }

                      className="
                        bg-[#808080]
                        hover:bg-[#a9a9a9]
                        text-white
                        px-4
                        py-2
                        rounded-xl
                      "

                    >

                      Ver Equipo

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

export default CompanyEquipments