import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Bell, AlertTriangle, LogOut } from "lucide-react"

function Navbar() {

  const navigate = useNavigate()

const [notificationCount, setNotificationCount] = useState(0)

const [notifications, setNotifications] =
  useState([])

const [showNotifications, setShowNotifications] =
  useState(false)

const loadCount = async () => {

  try {

    const response = await fetch(

      "https://update-platform-api.onrender.com/notifications/unread-count",

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }

    )

    const data = await response.json()

    setNotificationCount(data.count)

  } catch (error) {

    console.error(
      "Error cargando contador",
      error
    )

  }

}

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

    console.error(
      "Error cargando notificaciones",
      error
    )

  }

}

const markAsRead = async (id) => {

  try {

    await fetch(
      `https://update-platform-api.onrender.com/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }
    )

    await loadCount()

    await loadNotifications()

  } catch (error) {

    console.error(
      "Error marcando notificación",
      error
    )

  }

}

useEffect(() => {

  loadCount()

  loadNotifications()

}, [])
  
  const user = {
    full_name: localStorage.getItem("full_name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role")
  }

  const logout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("full_name")
    localStorage.removeItem("email")
    localStorage.removeItem("role")

    navigate("/login")

  }

  return (

    <div className="w-full bg-[#0F3D3E] text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* IZQUIERDA */}

        <div className="flex items-center gap-5">

          <div className="bg-white rounded-2xl p-1 shadow-xl">

            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 object-contain"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold">
              UPdate | IT Solutions • Cybersecurity
            </h1>

            <p className="text-gray-200">
              Servicio IT Gestionado para Empresas
            </p>

            <p className="text-xs text-gray-200">
              www.updateitsolutions.com
            </p>

          </div>

        </div>

        {/* DERECHA */}

        <div className="flex items-center gap-4">

          {/* NOTIFICACIONES */}



  <button

    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }

    className="relative bg-[#145052] hover:bg-[#1b6668] border border-[#1d6b6d] w-12 h-12 rounded-xl flex items-center justify-center transition"

  >

    🔔

    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-[2px] min-w-[20px] text-center">

      {notificationCount}

    </span>

  </button>
{showNotifications && (

  <div className="absolute right-16 top-6 w-71 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">

<div className="bg-[#0F3D3E] text-white px-2 py-1 flex justify-between items-center">

  <span className="text-xs font-bold">
    Notificaciones
  </span>

  <span className="text-xs bg-white/5 px-2 py-1 rounded-lg font-bold">
    {notificationCount}
  </span>

</div>

    <div className="max-h-64 overflow-y-auto">

      {notifications.length === 0 ? (

        <div className="p-4 text-gray-500 text-sm">

          No hay notificaciones

        </div>

      ) : (

        notifications
          .slice(0, 5)
          .map((item) => (

<div

  key={item.id}

  onClick={() => markAsRead(item.id)}

  className={`
    border-b
    px-4
    py-3
    hover:bg-gray-200
    cursor-pointer
    transition

    ${
      !item.is_read
        ? "bg-red-50/30"
        : ""
    }
  `}

>

  <div className="flex justify-between items-start">

    <div>

      <div className="font-semibold text-sm text-[#0F3D3E]">

        {item.title}

      </div>

      <div className="text-sm text-gray-800 mt-1">

        {item.message}

      </div>

    </div>

    {

      !item.is_read && (

        <div
          className="
            w-2
            h-2
            bg-red-500
            rounded-full
            animate-pulse
            mt-1
          "
        />

      )

    }

  </div>

  <div className="text-xs text-gray-400 mt-1">

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

  </div>

</div>

        ))

      )}

    </div>

    <button

      onClick={() =>
        navigate("/notifications")
      }

      className="w-full py-3 bg-gray-400 hover:bg-gray-500 text-sm font-semibold"

    >

      Ver todas →

    </button>

  </div>

)}
          {/* ALERTAS */}

          <button
            className="relative bg-[#145052] hover:bg-[#1b6668] border border-[#1d6b6d] w-12 h-12 rounded-xl flex items-center justify-center transition"
          >

            <AlertTriangle size={20} />

            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold rounded-full px-2 py-[2px] min-w-[20px] text-center">
              0
            </span>

          </button>

          {/* USUARIO */}

          <div className="bg-[#145052] border border-[#1d6b6d] rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">

            <div className="w-11 h-11 bg-sky-300 rounded-xl flex items-center justify-center text-white font-bold text-xl">

              {user.full_name?.charAt(0)}

            </div>

            <div>

              <h3 className="text-white font-bold text-sm leading-none">

                {user.full_name}

              </h3>

              <p className="text-gray-300 text-xs mt-1">

                {user.email}

              </p>

              <div className="mt-2">

                <span className="bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide">

                  {user.role}

                </span>

              </div>

            </div>

            <button

              onClick={logout}

              className="ml-2 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-xl transition flex items-center justify-center"

            >

              <LogOut size={18} />

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Navbar
