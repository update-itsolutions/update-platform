import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

function Equipments() {
  
  const navigate = useNavigate()
  const { companyId } = useParams ()
  const [equipments, setEquipments] = useState([])

  useEffect(() => {

    const fetchEquipments = async () => {

      try {

        const token = localStorage.getItem("token")

        if (!token) {
          console.log("No hay token")
          return
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/equipments",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setEquipments(response.data)

      } catch (error) {

        console.error(error)

      }

    }

    fetchEquipments()

  }, [])

  return (

    <div className="bg-white rounded-xl shadow p-2 mt-2">

      <h2 className="text-2xl font-bold mb-2">
        Equipos
      </h2>

      {equipments.length === 0 ? (

        <p>
          No hay equipos registrados.
        </p>

      ) : (

        <table className="w-full text-sm">

          <thead>

            <tr className="text-left text-xs font-semibold text-gray-600 pb-4">

              <th>Nombre de Equipo</th>
              <th>IP</th>
              <th>Estado</th>
              <th>Procesador</th>
              <th>RAM</th>
              <th>Disco</th>
              <th>Usuario</th>
              <th>Sistema Operativo</th>
              <th className= "py-3 px-4 text-left">
                Acciones
              </th>


            </tr>

          </thead>

          <tbody>

            {equipments.map((equipment) => (

              <tr
                key={equipment.id}
                className="border-b"
              >

                <td className="py-3 text-sm text-gray-700">
                  {equipment.hostname}
                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.ip_address}
                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.is_online
                    ? "🟢 Online"
                    : "🔴 Offline"}
                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.cpu?.slice(0, 26)} 
                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.ram} GB
                </td>

                <td className="py-3 text-sm text-gray-700">
                  <div>
                    {equipment.disk_total} GB 
                  </div>

                  <div className="text-xs text-gray-500">
                    Usado: {equipment.disk_usage} %
                  </div>

                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.logged_user}
                </td>

                <td className="py-3 text-sm text-gray-700">
                  {equipment.windows_version?.replaceAll("-", " ")}
                </td>

                <td className="py-3 text-sm text-gray-700">

              <button

                onClick={() =>
                  navigate(
                    `/company/${companyId}/equipment/${equipment.id}`
                  )
                }

                className="
                  bg-[#0F3D3E]
                  hover:bg-[#145052]
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-semibold
                  transition
                "

              >

                Administrar

              </button>

            </td>
              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  )

}

export default Equipments
