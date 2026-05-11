import { useState } from "react";

const SearchBarForAdminAppointSearch = ({ onSearch, onSearchClick }) => {
  const [filters, setFilters] = useState({
    patientName: "",
    doctorName: "",
    email: "",
    mob_no: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClear = () => {
    const reset = {
      patientName: "",
      doctorName: "",
      email: "",
      mob_no: "",
    };

    setFilters(reset);
    onSearch(reset); // sync parent state
    onSearchClick(reset); // TRIGGERING API CALL WITH EMPTY FILTERS
  };

  return (
    <div className="bg-white border border-gray-100 p-5 rounded-2xl mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          name="patientName"
          value={filters.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
        />
        <input
          name="doctorName"
          value={filters.doctorName}
          onChange={handleChange}
          placeholder="Doctor Name"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
        />
        <input
          name="email"
          value={filters.email}
          onChange={handleChange}
          placeholder="Email Address"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
        />
        <input
          name="mob_no"
          value={filters.mob_no}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3 mt-4 justify-end">
        <button 
          onClick={handleClear}
          className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
        >
          Clear
        </button>
        <button 
          onClick={() => onSearchClick(filters)}
          className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBarForAdminAppointSearch;