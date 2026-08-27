import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"

function Notifications() {

  const navigate = useNavigate()

  const [notifications, setNotifications] =
    useState([])

  const loadNotifications = async () => {

    try {

      const response = await fetch(
        "https://update-platform-api.onrender.com/notifications",
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          }
        }
      )

      const data = await response.json()

      setNotifications(data)

    } catch (error) {

      console.error(error)

    }

  }

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })

    loadNotifications()

  }, [])

  return (

    <>

      <Navbar />

      <div className="min-h-screen bg-white/60 p-6">

        <div className="flex justify-end mb-5">

          <button

            onClick={() => window.history.back()}

            className="
              bg-sky-300
              hover:bg-sky-400
              text-white
              px-5
              py-2
              rounded-xl
              transition
              font-semibold
              shadow-sm
            "

          >

            Volver

          </button>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold mb-2">

            Notificaciones

          </h1>

          <p className="text-gray-500 mb-8">

            Historial completo de actividades recientes en la plataforma

          </p>

          {notifications.length === 0 ? (

            <div className="text-center text-gray-500 py-10">

              No hay notificaciones

            </div>

          ) : (

            <div className="space-y-3">

              {notifications.map((item) => (

                <div

                  key={item.id}

                  className="
                    border
                    border-gray-200
                    rounded-2xl
                    p-4
                    hover:bg-gray-50
                    transition
                  "

                >

                  <div className="flex justify-between items-center">

                    <h3 className="font-bold text-[#0F3D3E]">

                      {item.title}

                    </h3>

                    {!item.is_read && (

                      <span
                        className="
                          bg-red-500
                          text-white
                          text-xs
                          px-2
                          py-1
                          rounded-lg
                          font-semibold
                        "
                      >

                        Nuevo

                      </span>

                    )}

                  </div>

                  <p className="mt-2 text-gray-700">

                    {item.message}

                  </p>

                  <p className="mt-2 text-xs text-gray-400">

                    {
                      new Date(
                        item.created_at
                      ).toLocaleString(
                        "es-AR",
                        {
                          hour12: false
                        }
                      )
                    }

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </>

  )

}

export default Notifications
