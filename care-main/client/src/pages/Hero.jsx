import { Link } from "react-router-dom";

function MedicineCard({ medicine }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">

      {medicine.tabletPic && (
        <img
          src={medicine.tabletPic}
          alt={medicine.tabletName}
          className="w-full h-48 object-cover rounded-xl"
        />
      )}

      <h2 className="text-xl font-bold mt-4">
        {medicine.tabletName}
      </h2>

      <p className="text-blue-600 font-semibold mt-1">
        {medicine.mg}
      </p>

      <p className="text-gray-600 mt-2">
        {medicine.time}
      </p>

      {/* IMPORTANT */}
      <Link
        to={`/medicine/${medicine._id}`}
        className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        View Details
      </Link>

    </div>
  );
}

export default MedicineCard;