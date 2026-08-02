import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"

function EditUserPassword() {

  const { userId } = useParams()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSave = async () => {

    if (password !== confirmPassword) {

      alert("Las contraseñas no coinciden")

      return

    }

    try {

      const token = localStorage.getItem("token")

      await axios.patch(

        `https://update-platform-api.onrender.com/users/${userId}/password`,

        {
          password
        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      alert("Contraseña actualizada")

      window.history.back()

    }

    catch (error) {

      console.error(error)

      alert(
        error.response?.data?.detail ||
        "Error al actualizar contraseña"
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
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl"
          >
            Volver al Panel
          </button>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">
            Cambiar Contraseña
          </h1>

          <p className="text-gray-500 mb-8">
            Ingrese una nueva contraseña
          </p>

          <div className="space-y-4">

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full"
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full"
            />

          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-[#0F3D3E] hover:bg-[#145052] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Guardar Contraseña
          </button>

        </div>

      </div>

    </>
  )

}

export default EditUserPassword
