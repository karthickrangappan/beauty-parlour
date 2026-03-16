import React from "react";
import { fmtCurrency } from "../../constants/config";
import { Search, Plus, X, Edit3, Trash2, Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductSection = ({
  products,
  productSearch,
  setProductSearch,
  showForm,
  setShowForm,
  editingProduct,
  formData,
  setFormData,
  resetForm,
  saveProduct,
  openEditForm,
  deleteProduct,
  isSaving,
  imagePreview,
  setImagePreview,
  imageFile,
  handleImageChange,
  fileRef,
  collectionOptions,
  categoryOptions,
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-8 gap-4">
        <div className="flex-1 max-w-none sm:max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search catalogue..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:border-gold-500 rounded-sm"
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <p className="text-xs text-neutral-500 hidden md:block">
            {products.filter((p) => p.name?.toLowerCase().includes(productSearch.toLowerCase())).length} products
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* product form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-neutral-100 shadow-lg mb-8 overflow-hidden"
          >
            <div className="p-4 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                  {editingProduct ? "Edit Product" : "New Product"}
                </h3>
                <button
                  onClick={resetForm}
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
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                      Short Description
                    </label>
                    <input
                      value={formData.shortDesc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDesc: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      placeholder="e.g. Purifying & Illuminating"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="65"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stock: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Collection
                      </label>
                      <select
                        value={formData.collection}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            collection: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {collectionOptions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                      >
                        {categoryOptions.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-neutral-900"
                    />
                    <span className="text-xs text-neutral-600">
                      Active (visible in shop)
                    </span>
                  </label>
                </div>

                {/* image upload */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                    Product Image
                  </label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square bg-neutral-50 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors overflow-hidden relative group"
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
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
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
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 border border-neutral-100 sm:border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  disabled={isSaving || !formData.name}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingProduct ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* products table */}
      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-cream-50">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Image
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Price
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Stock
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
              {products
                .filter(
                  (p) =>
                    !productSearch ||
                    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.category?.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.collection?.toLowerCase().includes(productSearch.toLowerCase())
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.target.src =
                            "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff";
                        }}
                        className="w-12 h-14 object-cover border border-neutral-100"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-800 text-xs uppercase tracking-wider">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        {p.collection?.replace("-", " ")} · {p.category}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-neutral-800 font-medium">
                      {fmtCurrency(p.price)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {p.stock ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${p.isActive !== false ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}
                      >
                        {p.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditForm(p)}
                          className="text-neutral-400 hover:text-gold-500 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                  >
                    No products yet. Click "+ Add Product" to create your first
                    product.
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

export default ProductSection;
