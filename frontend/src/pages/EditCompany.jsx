import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

import Navbar from "../components/Navbar"

function EditCompany() {

  const navigate = useNavigate()

  const { companyId } = useParams()

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

  useEffect(() => {

    fetchCompany()

  }, [])

  const fetchCompany = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `https://update-platform-api.onrender.com/platform/company/${companyId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setFormData(response.data.company)

    }

    catch (error) {

      console.error(error)

    }

  }

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }

  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token")

      await axios.put(

        `https://update-platform-api.onrender.com/platform/company/${companyId}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      alert("Empresa actualizada correctamente")

      navigate(`/platform/company/${companyId}`)

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

      <div className="min-h-screen bg-white/60 p-8">

        <div className="flex justify-end mb-5">

          <button
            onClick={() =>
              navigate(`/platform`)
        }
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >

            Volver al panel

          </button>

        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8">

          <h1 className="text-3xl font-bold mb-2">

            Editar Empresa

          </h1>

          <p className="text-gray-500 mb-8">

            Modificar datos de empresa cliente

          </p>

          <div className="grid grid-cols-2 gap-5">

            <input
              name="name"
              value={formData.name}
              placeholder="Nombre Fantasía"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="business_name"
              value={formData.business_name}
              placeholder="Razón Social"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="tax_id"
              value={formData.tax_id}
              placeholder="CUIT"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="phone"
              value={formData.phone}
              placeholder="Teléfono"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="website"
              value={formData.website}
              placeholder="Sitio Web"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="address"
              value={formData.address}
              placeholder="Dirección"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="city"
              value={formData.city}
              placeholder="Ciudad"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="province"
              value={formData.province}
              placeholder="Provincia"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="postal_code"
              value={formData.postal_code}
              placeholder="Código Postal"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="country"
              value={formData.country}
              placeholder="País"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

            <input
              name="industry"
              value={formData.industry}
              placeholder="Rubro"
              onChange={handleChange}
              className="border rounded-xl px-4 py-3"
            />

          </div>

          <textarea
            name="notes"
            value={formData.notes}
            placeholder="Observaciones"
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 mt-5 h-32"
          />

          <div className="flex justify-end mt-8">

            <button

              onClick={handleSubmit}

              className="bg-[#0F3D3E] hover:bg-[#145052] text-white px-8 py-4 rounded-2xl font-semibold"

            >

              Guardar Cambios

            </button>

          </div>

        </div>

      </div>

    </>

  )

}

export default EditCompany

