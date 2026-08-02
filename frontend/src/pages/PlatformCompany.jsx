import { useEffect, useState } from "react"

import axios from "axios"

import { useParams } from "react-router-dom"

import {

  FaDesktop,
  FaUsers,
  FaHeartbeat,
  FaNetworkWired

} from "react-icons/fa"

function PlatformCompany() {

  const { id } = useParams()

  const [data, setData] = useState(null)

  useEffect(() => {

    fetchCompany()

  }, [])

  const fetchCompany = async () => {

    try {

      const token = localStorage.getItem("token")

      const response = await axios.get(

        `https://update-platform-api.onrender.com/platform/company/${id}`,

        {

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      )

      setData(response.data)

    }

    catch (error) {

      console.error(error)

    }

  }

  if (!data) {

    return (

      <div className="p-10">

        Cargando...

      </div>

    )

  }

  return (

    <div className="min-h-screen bg-white/60 p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-800">

          {data.company.name}

        </h1>

        <p className="text-gray-500 mt-2">

          Administración empresarial

        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* EQUIPOS */}

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl w-fit">

            <FaDesktop size={24} />

          </div>

          <h3 className="text-gray-500 mt-5">
            Equipos
          </h3>

          <p className="text-4xl font-bold mt-2">

            {data.stats.total_equipments}

          </p>

        </div>

        {/* ONLINE */}

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <div className="bg-green-100 text-green-600 p-3 rounded-xl w-fit">

            <FaHeartbeat size={24} />

          </div>

          <h3 className="text-gray-500 mt-5">
            Online
          </h3>

          <p className="text-4xl font-bold mt-2 text-green-500">

            {data.stats.online_equipments}

          </p>

        </div>

        {/* USERS */}

        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl w-fit">

            <FaUsers size={24} />

          </div>

          <h3 className="text-gray-500 mt-5">
            Usuarios
          </h3>

          <p className="text-4xl font-bold mt-2">

            {data.stats.total_users}

          </p>

        </div>

      </div>

      {/* USERS TABLE */}

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">

        <div className="flex items-center gap-3 mb-5">

          <FaUsers className="text-purple-500" size={24} />

          <h2 className="text-2xl font-bold">
            Usuarios
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Nombre
                </th>

                <th className="text-left py-3">
                  Correo
                </th>

                <th className="text-left py-3">
                  Rol
                </th>

              </tr>

            </thead>

            <tbody>

              {data.users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="py-4 font-medium">

                    {user.full_name}

                  </td>

                  <td className="py-4 text-gray-600">

                    {user.email}

                  </td>

                  <td className="py-4">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-sm font-semibold uppercase">

                      {user.role}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* EQUIPMENTS TABLE */}

      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <div className="flex items-center gap-3 mb-5">

          <FaNetworkWired className="text-blue-500" size={24} />

          <h2 className="text-2xl font-bold">
            Equipos
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Hostname
                </th>

                <th className="text-left py-3">
                  IP
                </th>

                <th className="text-left py-3">
                  Sistema
                </th>

                <th className="text-left py-3">
                  Usuario
                </th>

                <th className="text-left py-3">
                  Estado
                </th>

              </tr>

            </thead>

            <tbody>

              {data.equipments.map((eq) => (

                <tr
                  key={eq.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="py-4 font-medium">

                    {eq.hostname}

                  </td>

                  <td className="py-4 text-gray-600">

                    {eq.ip_address}

                  </td>

                  <td className="py-4 text-gray-600">

                    {eq.operating_system}

                  </td>

                  <td className="py-4 text-gray-600">

                    {eq.logged_user}

                  </td>

                  <td className="py-4">

                    {eq.is_online ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm font-semibold">

                        ONLINE

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-xl text-sm font-semibold">

                        OFFLINE

                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default PlatformCompany

