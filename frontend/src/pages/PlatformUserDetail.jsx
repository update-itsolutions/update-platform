import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import axios from "axios"

import Navbar from "../components/Navbar"

function PlatformUserDetail() {

  const { userId } = useParams()

  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [companies, setCompanies] = useState([])

  const [selectedCompanies, setSelectedCompanies] = useState([])

  const [savingUser, setSavingUser] = useState(false)

  const [userForm, setUserForm] = useState({

    first_name: "",

    last_name: "",

    email: "",

    role: "",

    phone: "",

    password: ""

  })

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {

    try {

      const token = localStorage.getItem("token")

      const userResponse = await axios.get(

        `https://update-platform-api.onrender.com/platform/users/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setUser(userResponse.data)

      setUserForm({

        first_name:
            userResponse.data.first_name || "",

        last_name:
            userResponse.data.last_name || "",

        email:
            userResponse.data.email || "",

        phone:
            userResponse.data.phone || "",

        role:
            userResponse.data.role || "",
        
        password: ""

      })

      setSelectedCompanies(
        userResponse.data.assigned_companies
      )

      const companiesResponse = await axios.get(

        "https://update-platform-api.onrender.com/platform/companies/simple",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setCompanies(companiesResponse.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  const toggleCompany = (companyId) => {

    if (
      selectedCompanies.includes(companyId)
    ) {

      setSelectedCompanies(

        selectedCompanies.filter(

          (id) => id !== companyId

        )

      )

    }

    else {

      setSelectedCompanies(

        [
          ...selectedCompanies,
          companyId
        ]

      )

    }

  }

const saveAssignments = async () => {

  try {

    const token = localStorage.getItem("token")

    await axios.put(

      `https://update-platform-api.onrender.com/platform/users/${userId}/companies`,

      {
        company_ids: selectedCompanies
      },

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )

    alert(
      "Empresas asignadas correctamente"
    )

  }

  catch (error) {

    console.error(error)

  }

}

const saveUser = async () => {

  try {

    setSavingUser(true)

    const token =
      localStorage.getItem("token")

    await axios.put(

      `https://update-platform-api.onrender.com/platform/users/${userId}`,

      userForm,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    )

    alert(
      "Funcionario actualizado correctamente"
    )

    fetchData()

  }

  catch (error) {

    console.error(error)

    alert(
      "Error al actualizar funcionario"
    )

  }

  finally {

    setSavingUser(false)

  }

}

const toggleStatus = async () => {

  try {

    const token =
      localStorage.getItem("token")

    await axios.patch(

      `https://update-platform-api.onrender.com/platform/users/${userId}/status`,

      {

        is_active:
          !user.is_active

      },

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    )

    fetchData()

  }

  catch (error) {

    console.error(error)

  }

}

  if (!user) {

    return (
      <div className="p-10">
        Cargando...
      </div>
    )

  }

  return (

    <>

      <Navbar />

      <div className="flex justify-end bg-gray-100 p-3">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver a Funcionarios
          </button>
      </div>
      <div className="min-h-screen bg-white/60 p-3">

        <div className="flex justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Administrar Funcionario
            </h1>

            <p className="text-gray-500 mt-1">
              Gestiona el funcionario y sus empresas asignadas
            </p>

          </div>


        </div>

{/* DATOS */}

<div className="bg-white rounded-3xl p-6 shadow-sm mb-6">

  <div className="flex justify-between items-start">

    <div>

      <h2 className="text-2xl font-bold">

        {user.full_name}

      </h2>

      <p className="text-gray-500">

        {user.email}

      </p>

    </div>

    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold ${
        user.is_active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >

      {

        user.is_active

          ? "Activo"

          : "Inactivo"

      }

    </span>

  </div>

  <div className="grid grid-cols-2 gap-4 mt-6">

    <div>

      <label className="text-sm text-gray-500">

        Nombre

      </label>

      <input

        type="text"

        value={userForm.first_name}

        onChange={(e) =>
          setUserForm({
            ...userForm,
            first_name:
              e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

      />

    </div>

    <div>

      <label className="text-sm text-gray-500">

        Apellido

      </label>

      <input

        type="text"

        value={userForm.last_name}

        onChange={(e) =>
          setUserForm({
            ...userForm,
            last_name:
              e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

      />

    </div>

    <div>

      <label className="text-sm text-gray-500">

        Email

      </label>

      <input

        type="text"

        value={userForm.email}

        onChange={(e) =>
          setUserForm({
            ...userForm,
            email:
              e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

      />

    </div>

        <div>

      <label className="text-sm text-gray-500">

        Teléfono

      </label>

      <input

        type="number"

        value={userForm.phone}

        onChange={(e) =>
          setUserForm({
            ...userForm,
            phone:
              e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

      />

    </div>

    <div>

      <label className="text-sm text-gray-500">

        Rol

      </label>

      <select

        value={userForm.role}

        onChange={(e) =>
          setUserForm({
            ...userForm,
            role:
              e.target.value
          })
        }

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

      >

        <option value="sysadmin">

          Sysadmin

        </option>

        <option value="support">

          Support

        </option>

      </select>

    </div>
    <div>

      <label className="text-sm text-gray-500">

        Nueva Contraseña

      </label>

  <input

    type="password"

    value={userForm.password}

    onChange={(e) =>

      setUserForm({

        ...userForm,

        password: e.target.value

      })

    }

    placeholder="Dejar vacío para mantener la actual"

        className="
          w-full
          border
          rounded-xl
          p-3
          mt-1
        "

  />

  <p className="text-xs text-gray-500 mt-2">

    Solo completar si deseas cambiar la contraseña.

  </p>

</div>
  </div>

  <div className="flex gap-3 mt-6">

    <button

      onClick={saveUser}

      disabled={savingUser}

      className="
        bg-[#0f3d3e]
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

    <button

      onClick={toggleStatus}

      className={`
        px-6
        py-3
        rounded-xl
        font-semibold
        text-white

        ${

          user.is_active

            ? "bg-red-500 hover:bg-red-600"

            : "bg-green-500 hover:bg-green-600"

        }
      `}

    >

      {

        user.is_active

          ? "Desactivar"

          : "Activar"

      }

    </button>

  </div>

</div>

        {/* EMPRESAS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="text-xl font-bold mb-5">

            Empresas Asignadas

          </h2>

<div
  className="
    bg-gray-50
    border
    rounded-2xl
    p-4
    mb-6
  "
>

  <div className="flex justify-between items-center mb-3">

    <h3 className="font-semibold">

      Empresas actualmente asignadas

    </h3>

    <span
      className="
        bg-[#0f3d3e]
        text-white
        text-xs
        px-3
        py-1
        rounded-full
      "
    >

      {selectedCompanies.length}

    </span>

  </div>

  <div className="flex flex-wrap gap-2">

    {

      companies

        .filter((company) =>

          selectedCompanies.includes(
            company.id
          )

        )

        .map((company) => (

          <span

            key={company.id}

            className="
              bg-green-100
              text-green-700
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
            "

          >

            #{String(company.id)
              .padStart(4, "0")} - {company.name}

          </span>

        ))

    }

    {

      selectedCompanies.length === 0 && (

        <span className="text-gray-400">

          Sin empresas asignadas

        </span>

      )

    }

  </div>

</div>

          <div className="space-y-3">

            {companies.map((company) => (

              <label

                key={company.id}

                className="
                  flex
                  items-center
                  gap-3
                  border
                  rounded-xl
                  p-3
                  cursor-pointer
                "

              >

                <input

                  type="checkbox"

                  checked={
                    selectedCompanies.includes(
                      company.id
                    )
                  }

                  onChange={() =>
                    toggleCompany(
                      company.id
                    )
                  }

                />

                <span>

                #{String(company.id)
                    .padStart(4, "0")} - {company.name}

                </span>

              </label>

            ))}

          </div>

          <button

            onClick={saveAssignments}

            className="
              mt-6
              bg-[#0f3d3e]
              hover:bg-[#145052]
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
            "

          >

            Guardar Asignaciones

          </button>

        </div>

      </div>

    </>

  )

}

export default PlatformUserDetail