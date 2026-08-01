import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function EquipmentEdit() {

  const navigate = useNavigate()

  const {
    companyId,
    equipmentId
  } = useParams()

  const [loading, setLoading] = useState(true)

  const [branches, setBranches] = useState([])

  const [formData, setFormData] = useState({

    asset_tag: "",

    hostname: "",

    branch_id: "",

    notes: ""

  })

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {

    try {

      const token =
        localStorage.getItem("token")

      const equipmentResponse =
        await axios.get(

          `http://127.0.0.1:8000/equipment/${equipmentId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        )

      const equipment =
        equipmentResponse.data

      setFormData({

        asset_tag:
          equipment.asset_tag || "",

        hostname:
          equipment.hostname || "",

        branch_id:
          equipment.branch_id || "",

        notes:
          equipment.notes || ""

      })

      const branchResponse =
        await axios.get(

          `http://127.0.0.1:8000/branches/company/${companyId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        )

      setBranches(branchResponse.data)

      setLoading(false)

    }

    catch (error) {

      console.error(error)

    }

  }

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const token =
        localStorage.getItem("token")

      await axios.patch(

        `http://127.0.0.1:8000/equipment/${equipmentId}`,

        {

          asset_tag:
            formData.asset_tag,

          hostname:
            formData.hostname,

          branch_id:
            Number(formData.branch_id),

          notes:
            formData.notes

        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      )

      alert(
        "Equipo actualizado correctamente"
      )

      navigate(

        `/company/${companyId}/equipment/${equipmentId}`

      )

    }

    catch (error) {

      console.error(error)

      alert(
        "Error al actualizar equipo"
      )

    }

  }

  if (loading) {

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

        <div className="flex justify-end mb-5">

          <button

            onClick={() =>
              navigate(
                `/company/${companyId}/equipment/${equipmentId}`
              )
            }

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

            Volver al Equipo

          </button>

        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">

            Editar Equipo

          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label className="block font-semibold mb-2">

                ID de Equipo

              </label>

              <input

                type="text"

                name="asset_tag"

                value={formData.asset_tag}

                onChange={handleChange}

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "

              />

            </div>

            <div>

              <label className="block font-semibold mb-2">

                Nombre del Equipo

              </label>

              <input

                type="text"

                name="hostname"

                value={formData.hostname}

                onChange={handleChange}

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "

              />

            </div>

            <div>

              <label className="block font-semibold mb-2">

                Sucursal

              </label>

              <select

                name="branch_id"

                value={formData.branch_id}

                onChange={handleChange}

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "

              >

                {branches.map((branch) => (

                  <option

                    key={branch.id}

                    value={branch.id}

                  >

                    {branch.name}

                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="block font-semibold mb-2">

                Observaciones

              </label>

              <textarea

                name="notes"

                rows="5"

                value={formData.notes}

                onChange={handleChange}

                className="
                  w-full
                  border
                  rounded-xl
                  px-4
                  py-3
                "

              />

            </div>

            <button

              type="submit"

              className="
                bg-[#0F3D3E]
                hover:bg-[#145052]
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "

            >

              Guardar Cambios

            </button>

          </form>

        </div>

      </div>

    </>

  )

}

export default EquipmentEdit
