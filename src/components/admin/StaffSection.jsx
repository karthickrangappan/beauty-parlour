import React from "react";
import {
  Plus,
  X,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StaffSection = ({
  staff,
  staffSearch,
  setStaffSearch,
  showStaffForm,
  setShowStaffForm,
  editingStaff,
  staffFormData,
  setStaffFormData,
  resetStaffForm,
  saveStaff,
  openEditStaffForm,
  deleteStaff,
  isSaving,
  imagePreview,
  handleImageChange,
  fileRef,
  serviceCategoryOptions,
}) => {
  const [sortBy, setSortBy] = React.useState("newest");

  const sortedStaff = [...staff]
    .filter(
      (s) =>
        !staffSearch ||
        s.name?.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.role?.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.category?.toLowerCase().includes(staffSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical") return (a.name || "").localeCompare(b.name || "");
      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-8 gap-4">
        <div className="flex flex-1 gap-4">
          <div className="flex-1 max-w-none sm:max-w-sm relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search specialists..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:border-gold-500 rounded-sm"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden md:block bg-white border border-neutral-200 px-4 py-2 text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-gold-500"
          >
            <option value="newest">Latest Hired</option>
            <option value="alphabetical">Name (A-Z)</option>
          </select>
        </div>
        <p className="text-xs text-neutral-500 hidden md:block">
          {sortedStaff.length} specialists
        </p>
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              resetStaffForm();
              setShowStaffForm(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Specialist
          </button>
        </div>
      </div>

      {/* staff form modal */}
      <AnimatePresence>
        {showStaffForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-neutral-100 shadow-lg mb-8 overflow-hidden"
          >
            <div className="p-4 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                  {editingStaff ? "Edit Specialist" : "New Specialist"}
                </h3>
                <button
                  onClick={resetStaffForm}
                  className="text-neutral-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Name
                    </label>
                    <input
                      value={staffFormData.name}
                      onChange={(e) =>
                        setStaffFormData({
                          ...staffFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Role
                      </label>
                      <input
                        value={staffFormData.role}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            role: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="e.g. Senior Stylist"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Category
                      </label>
                      <select
                        value={staffFormData.category}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {serviceCategoryOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Working Hours (0-23)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={staffFormData.workingHours.start}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            workingHours: {
                              ...staffFormData.workingHours,
                              start: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-20 p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      />
                      <span className="text-neutral-400">to</span>
                      <input
                        type="number"
                        value={staffFormData.workingHours.end}
                        onChange={(e) =>
                          setStaffFormData({
                            ...staffFormData,
                            workingHours: {
                              ...staffFormData.workingHours,
                              end: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-20 p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                    Specialist Image
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors overflow-hidden relative group"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-neutral-300" />
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-8 pt-6 border-t border-neutral-100">
                <button
                  onClick={resetStaffForm}
                  className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-100 sm:border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStaff}
                  disabled={isSaving || !staffFormData.name}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Specialist"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh] custom-scrollbar pb-2">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-cream-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Specialist
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Category
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Working Days
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Working Hours
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {sortedStaff.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.image}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-100"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${s.name}&background=D4AF37&color=fff`;
                          }}
                        />
                        <div>
                          <p className="font-bold text-neutral-800 text-[10px] uppercase tracking-widest">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {s.role || "Specialist"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">
                        {s.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-neutral-500 max-w-[150px] truncate">
                        {s.workingDays?.join(", ") || "Mon - Sat"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-neutral-600">
                      {s.workingHours?.start || "09"}:00 -{" "}
                      {s.workingHours?.end || "18"}:00
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditStaffForm(s)}
                          className="text-neutral-400 hover:text-gold-500 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteStaff(s.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {staff.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                  >
                    No specialists in roster. Click "+ Add Specialist" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffSection;
