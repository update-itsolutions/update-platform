import { useNavigate } from "react-router-dom"

function Navbar() {

  const navigate = useNavigate()

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

        {/* LEFT */}

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

        {/* RIGHT */}

        <div className="flex items-center">

          <div className="bg-[#145052] border border-[#1d6b6d] rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm">

            {/* ICON */}

            <div className="w-11 h-11 bg-sky-300 rounded-xl flex items-center justify-center text-white font-bold text-xl">

              {user.full_name?.charAt(0)}

            </div>

            {/* INFO */}

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

            {/* LOGOUT */}

            <button

              onClick={logout}

              className="ml-2 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-xl transition flex items-center justify-center"

            >

              ➜

            </button>

          </div>

        </div>

      </div>

    </div>

  )

}

export default Navbar