import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe
} from "react-icons/fa"

import bg from "../assets/bg.png"
import logo from "../assets/logo.png"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

const handleLogin = async () => {

  try {

    const formData = new URLSearchParams()

    formData.append("username", email)
    formData.append("password", password)

    // LOGIN
    const response = await axios.post(

      "https://update-platform-api.onrender.com/login",

      formData,

      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        }
      }

    )

    // GUARDAR TOKEN
    localStorage.setItem(
      "token",
      response.data.access_token
    )

    // OBTENER DATOS USUARIO
    const meResponse = await axios.get(

      "https://update-platform-api.onrender.com/me",

      {
        headers: {
          Authorization:
            `Bearer ${response.data.access_token}`
        }
      }

    )

    const userData = meResponse.data

    localStorage.setItem(
      "full_name",
      userData.full_name || ""
    )

    localStorage.setItem(
      "email",
      userData.email
    )

    localStorage.setItem(
      "role",
      userData.role
    )

    // REDIRECCION SEGUN ROL

    if (
      userData.role === "sysadmin" ||
      userData.role === "support"
    ) {

      navigate("/platform")

    }

    else {

      navigate("/company/home")

    }

  }

  catch (error) {

    console.error(error)

    alert("Credenciales incorrectas")

  }

}

  return (

    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-6"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >

      {/* OVERLAY */}

      <div className="absolute inset-0 backdrop-blur-[1px]"></div>

      {/* LOGIN */}

      <form

        onSubmit={(e) => {

          e.preventDefault()

          handleLogin()

        }}

        className="relative z-10 w-full max-w-xs bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-5 shadow-2xl text-white"

      >

        {/* LOGO */}

        <div className="flex flex-col items-center mb-5">

          <img
            src={logo}
            alt="Logo"
            className="w-[100px] mb-3 drop-shadow-xl"
          />

          <h1 className="text-2xl font-bold">
            UPdate
          </h1>

          <p className="text-gray-300 mt-1 text-center">
            Servicio IT Gestionado para Empresas
          </p>

        </div>

        {/* INPUTS */}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 mb-4 outline-none placeholder:text-gray-300"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-white/10 border border-white/20 mb-4 outline-none placeholder:text-gray-300"
        />

        {/* BOTON */}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-xl font-semibold shadow-lg"
        >
          Iniciar sesión
        </button>

        <p className="text-sm text-gray-300 mt-3 text-center">
          ¿No tienes cuenta?
        </p>

        <a
          href="https://wa.me/5492604685510?text=Hola%20UPdate%2C%20quiero%20solicitar%20una%20cuenta%20en%20la%20plataforma%20de%20Soporte%20IT%20Gestionado%20para%20Empresas."
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-center text-blue-300 hover:text-blue-200 transition font-semibold" 
        > 
          Solicitar Cuenta

        </a>

        {/* INFO */}

        <div className="mt-5 pt-4 border-t border-white/20 space-y-3 text-sm text-gray-300">

          <div className="flex items-center gap-3">

            <FaPhoneAlt />

            <span>
              +54 9 260 468-5510
            </span>

          </div>

          <div className="flex items-center gap-3">

            <FaEnvelope />

            <span>
              soporte@updateitsolutions.com
            </span>

          </div>

          <a href="https://updateitsolutions.com" target="_blank" rel="noopener noreferrer" className="no-underline text-inherit">
            <div className="mt-3 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <FaGlobe />
              <span>
                www.updateitsolutions.com
              </span>
            </div>
          </a>

        </div>

      </form>

    </div>

  )

}

export default Login
