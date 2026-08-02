import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import axios from "axios"

import Navbar from "../components/Navbar"
import { FaWindows } from "react-icons/fa"

function CreateTicket() {

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    }, [])

  const navigate = useNavigate()

  const { companyId, equipmentId } = useParams()

  const [title, setTitle] = useState("")

  const [description, setDescription] = useState("")

  const [priority, setPriority] = useState("MEDIUM")

  const handleCreateTicket = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.post(

        "https://update-platform-api.onrender.com/tickets",

        {

          title,

          description,

          priority,

          equipment_id: parseInt(equipmentId)

        },

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      )

      alert("Ticket creado correctamente")

      navigate(
        `/company/${companyId}/equipment/${equipmentId}`
      )

    }

    catch (error) {

      console.error(error)

      alert(
        error.response?.data?.detail ||
        "Error al crear ticket"
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

            Volver

          </button>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-3xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Nuevo Ticket a Soporte
          </h1>

          <p className="text-gray-500 mb-8">
            Registrar incidencia o solicitud
          </p>

          <div className="space-y-5">

            <div>

              <label className="block text-sm text-gray-500 mb-2">

                Título

              </label>

              <input

                type="text"

                value={title}

                onChange={(e) =>
                  setTitle(e.target.value)
                }

                className="
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  w-full
                "

              />

            </div>

            <div>

              <label className="block text-sm text-gray-500 mb-2">

                Descripción

              </label>

              <textarea

                rows="6"

                value={description}

                onChange={(e) =>
                  setDescription(e.target.value)
                }

                className="
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  w-full
                "

              />

            </div>

            <div>

              <label className="block text-sm text-gray-500 mb-2">

                Prioridad

              </label>

              <select

                value={priority}

                onChange={(e) =>
                  setPriority(e.target.value)
                }

                className="
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  w-full
                "

              >

                <option value="LOW">
                  Baja
                </option>

                <option value="MEDIUM">
                  Media
                </option>

                <option value="HIGH">
                  Alta
                </option>

                <option value="CRITICAL">
                  Crítica
                </option>

              </select>

            </div>

          </div>

          <button

            onClick={handleCreateTicket}

            className="
              mt-8
              bg-[#0F3D3E]
              hover:bg-[#145052]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
            "

          >

            Crear Ticket

          </button>

        </div>

      </div>

    </>
  )

}

export default CreateTicket
