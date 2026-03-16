import React from "react";
import { fmtCurrency } from "../../constants/config";
import { Search, Plus, X, Edit3, Trash2, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



const ServiceSection = ({
  services,
  serviceSearch,
  setServiceSearch,
  showServiceForm,
  setShowServiceForm,
  editingService,
  serviceFormData,
  setServiceFormData,
  resetServiceForm,
  saveService,
  openEditServiceForm,
  deleteService,
  isSaving,
  imagePreview,
  setImagePreview,
  imageFile,
  handleImageChange,
  fileRef,
  serviceCategoryOptions,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-8 gap-4">
        <div className="flex-1 max-w-none sm:max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:border-gold-500 rounded-sm"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              resetServiceForm();
              setShowServiceForm(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>


      <AnimatePresence>
        {showServiceForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-neutral-100 shadow-lg mb-8 overflow-hidden"
          >
            <div className="p-4 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                  {editingService ? "Edit Service" : "New Service"}
                </h3>
                <button
                  onClick={resetServiceForm}
                  className="text-neutral-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Service Name
                    </label>
                    <input
                      value={serviceFormData.name}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      placeholder="e.g. HD Bridal Makeup"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Description
                    </label>
                    <textarea
                      value={serviceFormData.description}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      placeholder="Brief description of the service..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={serviceFormData.price}
                        onChange={(e) =>
                          setServiceFormData({
                            ...serviceFormData,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="15000"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Duration (min)
                      </label>
                      <input
                        type="number"
                        value={serviceFormData.duration}
                        onChange={(e) =>
                          setServiceFormData({
                            ...serviceFormData,
                            duration: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="180"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Category
                    </label>
                    <select
                      value={serviceFormData.category}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
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
                  <label className="flex items-center gap-3 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceFormData.isActive}
                      onChange={(e) =>
                        setServiceFormData({
                          ...serviceFormData,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-neutral-900"
                    />
                    <span className="text-xs text-neutral-600">
                      Active (visible in services page)
                    </span>
                  </label>
                </div>


                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                    Service Highlight Image
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="aspect-video bg-neutral-50 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors overflow-hidden relative group"
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-neutral-300 mb-3" />
                        <p className="text-xs text-neutral-400 uppercase tracking-wider">
                          Click to upload
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-[10px] text-neutral-400">
                    Or paste an image URL:
                  </p>
                  <input
                    value={serviceFormData.image}
                    onChange={(e) => {
                      setServiceFormData({
                        ...serviceFormData,
                        image: e.target.value,
                      });
                      if (!imageFile) setImagePreview(e.target.value);
                    }}
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-8 pt-6 border-t border-neutral-100">
                <button
                  onClick={resetServiceForm}
                  className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-100 sm:border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={saveService}
                  disabled={isSaving || !serviceFormData.name}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingService ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
          <thead className="bg-cream-50">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Image
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Service
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Price
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Duration
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {services
              .filter(
                (s) =>
                  !serviceSearch ||
                  s.name?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                  s.category?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                  s.description?.toLowerCase().includes(serviceSearch.toLowerCase())
              )
              .map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={s.image}
                      alt={s.name}
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=Service+Error&background=D4AF37&color=fff";
                      }}
                      className="w-16 h-10 object-cover border border-neutral-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-800 text-xs uppercase tracking-wider">
                      {s.name}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-neutral-800 font-medium">
                    {fmtCurrency(s.price)}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {s.duration} min
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${s.isActive !== false ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}
                    >
                      {s.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditServiceForm(s)}
                        className="text-neutral-400 hover:text-gold-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {services.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                >
                  No services yet. Click "+ Add Service" to create your first
                  service.
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

export default ServiceSection;
