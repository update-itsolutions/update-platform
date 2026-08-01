import { useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
function CreatePlatformUser() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("sysadmin")
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://127.0.0.1:8000/platform/users/create",
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role
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
      setRole("sysadmin")
    }
    catch (error) {
      console.error(error)
      console.log(error.response)
      alert(
        error.response?.data?.detail ||
        "Error al crear usuario")
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
            Nuevo Funcionario de Plataforma
          </h1>
          <p className="text-gray-500 mb-8">
            Crear usuario SYSADMIN o SUPPORT
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NOMBRE */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            {/* APELLIDO */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            {/* EMAIL */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            {/* PASSWORD */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none"
              />
            </div>
            {/* ROL */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-2">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white"
              >
                <option value="sysadmin">
                  SysAdmin
                </option>
                <option value="support">
                  Support
                </option>
              </select>
            </div>
          </div>
          {/* BOTON */}
          <button
            onClick={handleCreate}
            className="mt-8 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Crear Usuario
          </button>
        </div>
      </div>
    </>
  )
}
export default CreatePlatformUser
