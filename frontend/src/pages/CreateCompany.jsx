import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import Navbar from "../components/Navbar"

function CreateCompany() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    name: "",
    business_name: "",
    tax_id: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    website: "",
    industry: "",
    notes: ""

  })

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.post(

        "http://127.0.0.1:8000/platform/companies/create",

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      navigate("/platform")

    }

    catch (error) {

      console.error(error)

      console.log("STATUS:", error.response?.status)

      console.log("DATA:", error.response?.data)

      alert(
        JSON.stringify(error.response?.data)
      )

    }

  }

  return (

    <>
    
      <Navbar />

      <div className="min-h-screen bg-white/60 p-8">
          {/* TOP BAR */}
        <div className="flex justify-end mb-5">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Inicio
          </button>
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8">

          <h1 className="text-3xl font-bold mb-2">
            Crear Nueva Empresa
          </h1>

          <p className="text-gray-500 mb-8">
            Registro completo de empresa cliente
          </p>

          <div className="grid grid-cols-2 gap-5">

            <input
              name="name"
              placeholder="Nombre Fantasía"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="business_name"
              placeholder="Razón Social"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="tax_id"
              placeholder="CUIT"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="phone"
              placeholder="Teléfono"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="website"
              placeholder="Sitio Web"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="address"
              placeholder="Dirección"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="city"
              placeholder="Ciudad"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="province"
              placeholder="Provincia"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="postal_code"
              placeholder="Código Postal"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="country"
              placeholder="Pais"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="industry"
              placeholder="Rubro"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

          </div>

          <textarea
            name="notes"
            placeholder="Observaciones"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 mt-5 h-32"
          />

          <div className="flex justify-end mt-8">

            <button

              onClick={handleSubmit}

              className="bg-[#0F3D3E] hover:bg-[#145052] text-white px-8 py-4 rounded-2xl font-semibold"

            >

              Crear Empresa

            </button>

          </div>

        </div>

      </div>

    </>

  )
}

export default CreateCompany
