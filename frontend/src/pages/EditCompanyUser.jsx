import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function EditCompanyUser() {

  const { userId } = useParams()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")

  useEffect(() => {

    fetchUser()

  }, [])

  const fetchUser = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `http://127.0.0.1:8000/users/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setFirstName(response.data.first_name)
      setLastName(response.data.last_name)
      setEmail(response.data.email)
      setRole(response.data.role)

    }

    catch (error) {

      console.error(error)

    }

  }

  const handleUpdate = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.patch(

        `http://127.0.0.1:8000/users/${userId}`,

        {
          first_name: firstName,
          last_name: lastName,
          email,
          role
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      alert("Usuario actualizado correctamente")

    }

    catch (error) {

      console.error(error)

      alert(
        JSON.stringify(error.response?.data)
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
            Editar Usuario
          </h1>

          <p className="text-gray-500 mb-8">
            Modificar información del usuario
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="text-sm text-gray-500 mb-2 block">
                Nombre
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 mb-2 block">
                Apellido
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div className="md:col-span-2">

              <label className="text-sm text-gray-500 mb-2 block">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />

            </div>

            <div>

              <label className="text-sm text-gray-500 mb-2 block">
                Rol
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-white"
              >

                <option value="administrador">
                  Administrador
                </option>

                <option value="supervisor">
                  Supervisor
                </option>

                <option value="viewer">
                  Invitado
                </option>

              </select>

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

export default EditCompanyUser
