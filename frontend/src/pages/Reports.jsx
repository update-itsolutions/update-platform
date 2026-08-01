import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

function Reports() {

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Reportes
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow">

        <p className="text-gray-600">
          Acá aparecerán los reportes del sistema.
        </p>

      </div>

      <div className="flex justify-end mt-5">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#0f3d3e] text-white px-3 py-2 rounded-lg hover:bg-[#145052] transition text-sm"
        >

          <FaArrowLeft size={12} />

          Volver al Dashboard

        </Link>

      </div>

    </div>

  )

}

export default Reports