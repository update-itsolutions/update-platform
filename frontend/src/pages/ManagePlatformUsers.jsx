import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"

function ManagePlatformUsers() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])

  const [search, setSearch] = useState("")

  useEffect(() => {

    fetchUsers()

  }, [])

  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        "https://update-platform-api.onrender.com/platform/users",

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      setUsers(response.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  return (

    <>

      <Navbar />

      <div className="flex justify-end bg-white/60 p-3">
          <button
            onClick={() => window.history.back()}
            className="bg-sky-300 hover:bg-sky-400 text-white px-5 py-2 rounded-xl transition font-semibold shadow-sm"
          >
            Volver al Inicio
          </button>
      </div>
      <div className="min-h-screen bg-white/60 p-3">

        <div className="flex justify-between mb-6">

          <div>

            <h1 className="text-3xl font-bold">
              Funcionarios de la Plataforma
            </h1>

            <p className="text-gray-500 mt-1">
              Administrar y gestionar todos los funcionarios sysadmin y support
            </p>

          </div>


        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">

  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <p className="text-gray-500 text-sm">
      👤Total Funcionarios
    </p>
    <p className="text-3xl font-bold mt-2">
      {users.length}
    </p>
  </div>

  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <p className="text-gray-500 text-sm">
      ✅Activos
    </p>
    <p className="text-3xl font-bold text-green-600 mt-2">
      {users.filter(user => user.is_active).length}
    </p>
  </div>

  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <p className="text-gray-500 text-sm">
      ❌Inactivos
    </p>
    <p className="text-3xl font-bold text-red-600 mt-2">
      {users.filter(user => !user.is_active).length}
    </p>
  </div>

</div>
<input
  type="text"
  placeholder="Buscar funcionario por nombre o email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border border-gray-300 rounded-xl px-4 py-3 w-full mb-6"
/>
        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="space-y-4">

            {users
  .filter((user) =>

    user.full_name
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    user.email
      .toLowerCase()
      .includes(search.toLowerCase())

  )
  .map((user) => (

              <div

                key={user.id}

                className="
                  border
                  rounded-2xl
                  p-5
                  flex
                  justify-between
                  items-center
                "

              >

                <div>

                  <h2 className="font-bold text-lg">

                    {user.full_name}

                  </h2>

                  <p className="text-gray-500">

                    {user.email}

                  </p>

                </div>

                <div className="flex gap-3 items-center">

<span
  className={`
    px-3 py-1 rounded-full text-xs font-semibold
    ${
      user.role === "sysadmin"
        ? "bg-purple-100 text-purple-700"
        : "bg-blue-100 text-blue-700"
    }
  `}
>
  {user.role.toUpperCase()}
</span>
<span
  className={`
    px-3 py-1 rounded-full text-xs font-semibold
    ${
      user.is_active
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }
  `}
>
  {user.is_active ? "ACTIVO" : "INACTIVO"}
</span>
                  <button

                    onClick={() =>
                      navigate(
                        `/platform/users/${user.id}`
                      )
                    }

                    className="
                      bg-[#0f3d3e]
                      hover:bg-[#145052]
                      text-white
                      px-4
                      py-2
                      rounded-xl
                    "

                  >

                    Administrar

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </>

  )

}

export default ManagePlatformUsers