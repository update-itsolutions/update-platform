import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function CreateCompanyUser() {

  const { companyId } = useParams()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("administrador")

  const handleCreate = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.post(

        "https://update-platform-api.onrender.com/company/users/create",

        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role,
          company_id: parseInt(companyId)
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      alert("Usuario creado correctamente")

      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setRole("viewer")

    }

    catch (error) {

      console.error(error.response?.data)

      alert(
        JSON.stringify(error.response?.data)
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
            Nuevo Usuario de Empresa
          </h1>

          <p className="text-gray-500 mb-8">
            Crear Administrador, Supervisor o Invitado
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Nombre
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                onChange={(e) => setLastName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Contraseña
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Rol
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
            onClick={handleCreate}
            className="mt-8 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Crear Usuario
          </button>

        </div>

      </div>

    </>
    
  )

}

export default CreateCompanyUser
