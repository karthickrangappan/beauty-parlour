import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  updateDoc,
  deleteDoc,
  addDoc,
  doc,
  Timestamp,
  onSnapshot,
  runTransaction,
  increment,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { canMoveToStatus } from "../utils/logicUtils";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  ShoppingBag,
  Box,
  TrendingUp,
  CheckCircle,
  XCircle,
  Plus,
  Edit3,
  Trash2,
  Save,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  Search,
  Sparkles,
  UserCheck,
  Clock,
} from "lucide-react";

/* ───────────────────── helpers ───────────────────── */
const fmt = (n) => (n ?? 0).toFixed(2);
const statusColors = {
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  return_requested: "bg-neutral-100 text-neutral-600",
  completed: "bg-emerald-100 text-emerald-700",
  no_show: "bg-slate-100 text-slate-700",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  /* shared data */
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
<<<<<<< Updated upstream
=======
  const [staff, setStaff] = useState([]);
>>>>>>> Stashed changes
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* search states */
  const [productSearch, setProductSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");

  /* form states */
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: "", shortDesc: "", price: "", collection: "skin-care", category: "Cleansers", stock: "", image: "", isActive: true,
  });

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "", description: "", price: "", duration: "", category: "Bridal", image: "", isActive: true,
  });

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormData, setStaffFormData] = useState({
    name: "", role: "", experience: "", bio: "", specializations: [], image: "", isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef(null);

  /* constants */
  const serviceCategoryOptions = ["Bridal", "Pre-Wedding", "Party", "Editorial", "Natural", "Add-on", "Hair", "Traditional", "Shoots"];
  const specialistRoles = ["Master Bridal Artist", "South Indian Specialist", "Editorial & Fashion Expert", "Muslim Bridal Specialist", "Celebrity Makeup Artist", "Skin & Natural Glam Expert", "Senior Hair Stylist", "HD & Airbrush Specialist", "Party & Cocktail Specialist", "Traditional Saree Drapist"];

  /* ─── fetch all ────────────────────────────────────── */
  useEffect(() => {
    setIsLoading(true);
    const unsubs = [
      onSnapshot(collection(db, "orders"), (snap) => {
        const d = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(d);
        const grouped = {};
        d.forEach(o => {
          const dt = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || Date.now());
          const key = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          grouped[key] = (grouped[key] || 0) + (o.totalAmount || 0);
        });
        setChartData(Object.entries(grouped).map(([date, revenue]) => ({ date, revenue })).slice(-10));
      }),
      onSnapshot(collection(db, "appointments"), (snap) => setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "products"), (snap) => setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "services"), (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "staff"), (snap) => setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, "users"), (snap) => setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    ];
    setIsLoading(false);
    return () => unsubs.forEach(fn => fn());
  }, []);

<<<<<<< Updated upstream
  /* ─── order status ────────────────────────────────── */
  const updateOrderStatus = async (order, nextStatus) => {
    if (order.status === nextStatus) return;
    
    // Status can never go backward
    if (nextStatus !== 'cancelled' && !canMoveToStatus(order.status, nextStatus)) {
      alert(`Cannot move order status from ${order.status} to ${nextStatus}.`);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "orders", order.id);
        const orderSnap = await transaction.get(orderRef);
        if (!orderSnap.exists()) return;

        const data = orderSnap.data();
        let updatePayload = { 
          status: nextStatus,
          updatedAt: Timestamp.now(),
          statusHistory: [
            ...(data.statusHistory || []),
            { status: nextStatus, timestamp: Timestamp.now(), note: `Status updated by admin.` }
          ]
        };

        // IF CANCELLING
        if (nextStatus === "cancelled") {
          // 1. Restore Stock
          if (data.items) {
            for (const item of data.items) {
              const productRef = doc(db, "products", item.id);
              transaction.update(productRef, { stock: increment(item.qty || item.quantity) });
            }
          }

          // 2. Deduct Loyalty Points awarded on this order
          if (data.userId && data.pointsEarned) {
            const userRef = doc(db, "users", data.userId);
            transaction.update(userRef, { loyaltyPoints: increment(-data.pointsEarned) });
          }
          
          updatePayload.cancelledAt = Timestamp.now();
          updatePayload.cancelReason = "Cancelled by Administrator";
        }

        // IF SHIPPED -> Assign random tracking
        if (nextStatus === "shipped") {
          updatePayload.trackingId = `TRK${Math.floor(Math.random() * 9000000 + 1000000)}`;
          updatePayload.courier = "FastLane Logistics";
        }

        // IF DELIVERED -> Set delivery date & Award Points
        if (nextStatus === "delivered") {
          updatePayload.deliveredAt = Timestamp.now();
          if (data.userId && data.pointsEarned) {
            const userRef = doc(db, "users", data.userId);
            transaction.update(userRef, { loyaltyPoints: increment(data.pointsEarned) });
          }
        }

        transaction.update(orderRef, updatePayload);
        
        // 3. Send Notification (atomic collection add)
        const notificationRef = doc(collection(db, "notifications"));
        transaction.set(notificationRef, {
          userId: data.userId,
          title: `Order Update: ${nextStatus.replace('_', ' ')}`,
          message: `Your order #${order.id.slice(0,8)} is now ${nextStatus.replace('_', ' ')}.`,
          orderId: order.id,
          createdAt: Timestamp.now(),
          read: false
        });
      });
      alert(`Order status updated to ${nextStatus}`);
    } catch (err) {
      console.error("Update status failed", err);
      alert("Failed to update status. Check console.");
    }
  };

  const handleAppointment = async (id, status) => {
    try {
      await runTransaction(db, async (transaction) => {
        const apptRef = doc(db, "appointments", id);
        const apptSnap = await transaction.get(apptRef);
        if (!apptSnap.exists()) return;
        const data = apptSnap.data();

        let updatePayload = { status, updatedAt: Timestamp.now() };
        
        // IF COMPLETED -> Award Points (1 per 10 units of price)
        if (status === "completed") {
          if (data.userId && data.price) {
            const userRef = doc(db, "users", data.userId);
            transaction.update(userRef, { loyaltyPoints: increment(Math.floor(data.price / 10)) });
          }
        }

        // IF NO_SHOW -> Increment no-show counter
        if (status === "no_show") {
          if (data.userId) {
             const userRef = doc(db, "users", data.userId);
             transaction.update(userRef, { noShowCount: increment(1) });
          }
        }

        transaction.update(apptRef, updatePayload);

        // Send Notification
        const notificationRef = doc(collection(db, "notifications"));
        transaction.set(notificationRef, {
          userId: data.userId,
          title: `Appointment ${status.toUpperCase()}`,
          message: `Your ${data.serviceName} session is now ${status}.`,
          appointmentId: id,
          createdAt: Timestamp.now(),
          read: false
        });
      });
      alert(`Appointment marked as ${status}`);
    } catch (err) {
      console.error("Appointment update failed", err);
      alert("Failed to update appointment.");
    }
  };

  /* ─── user role ───────────────────────────────────── */
  const updateUserRole = async (uid, role) => {
    await updateDoc(doc(db, "users", uid), { role });
  };

  /* ─── product form helpers ────────────────────────── */
  const resetForm = () => {
    setFormData({
      name: "",
      shortDesc: "",
      price: "",
      collection: "skin-care",
      category: "Cleansers",
      stock: "",
      image: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEditForm = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || "",
      shortDesc: p.shortDesc || "",
      price: String(p.price ?? ""),
      collection: p.collection || "skin-care",
      category: p.category || "Cleansers",
      stock: String(p.stock ?? ""),
      image: p.image || "",
      isActive: p.isActive !== false,
    });
    setImagePreview(p.image || "");
    setImageFile(null);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveProduct = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formData.image;

      // upload image if new file selected
      if (imageFile) {
        const storageRef = ref(
          storage,
          `products/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        name: formData.name.trim(),
        shortDesc: formData.shortDesc.trim(),
        price: parseFloat(formData.price) || 0,
        collection: formData.collection,
        category: formData.category,
        stock: parseInt(formData.stock, 10) || 0,
        image: imageUrl,
        isActive: formData.isActive,
        rating: editingProduct?.rating || 0,
        updatedAt: Timestamp.now(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), payload);
      } else {
        payload.createdAt = Timestamp.now();
        await addDoc(collection(db, "products"), payload);
      }

      resetForm();
    } catch (err) {
      console.error("Save product failed", err);
      alert("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteDoc(doc(db, "products", id));
  };

  /* ─── service form helpers ────────────────────────── */
  const resetServiceForm = () => {
    setServiceFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "Bridal",
      image: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingService(null);
    setShowServiceForm(false);
  };

  const openEditServiceForm = (s) => {
    setEditingService(s);
    setServiceFormData({
      name: s.name || "",
      description: s.description || "",
      price: String(s.price ?? ""),
      duration: String(s.duration ?? ""),
      category: s.category || "Bridal",
      image: s.image || "",
      isActive: s.isActive !== false,
    });
    setImagePreview(s.image || "");
    setImageFile(null);
    setShowServiceForm(true);
  };

  const saveService = async () => {
    setIsSaving(true);
    try {
      let imageUrl = serviceFormData.image;

      if (imageFile) {
        const storageRef = ref(
          storage,
          `services/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        name: serviceFormData.name.trim(),
        description: serviceFormData.description.trim(),
        price: parseFloat(serviceFormData.price) || 0,
        duration: parseInt(serviceFormData.duration, 10) || 0,
        category: serviceFormData.category,
        image: imageUrl,
        isActive: serviceFormData.isActive,
        updatedAt: Timestamp.now(),
      };

      if (editingService) {
        await updateDoc(doc(db, "services", editingService.id), payload);
      } else {
        payload.createdAt = Timestamp.now();
        await addDoc(collection(db, "services"), payload);
      }

      resetServiceForm();
    } catch (err) {
      console.error("Save service failed", err);
      alert("Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service permanently?")) return;
    await deleteDoc(doc(db, "services", id));
  };

  const seedServices = async () => {
    if (!window.confirm("Upload 20 Indian Makeup Services? This may create duplicates if already present.")) return;
    setIsLoading(true);
    try {
      const { default: indianServices } = await import("../data/indianMakeupServices.json");
      for (const service of indianServices) {
        await addDoc(collection(db, "services"), {
          ...service,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      alert("Successfully uploaded 20 services!");
    } catch (err) {
      console.error("Seeding failed", err);
      alert("Failed to seed services.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── sidebar tabs config ─────────────────────────── */
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Box },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Reservations", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
  ];

  /* ─── derived stats ───────────────────────────────── */
  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingAppts = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const totalProducts = products.length;
  const totalServices = services.length;
  const totalUsers = users.length;

  /* ════════════════════════ RENDER ═══════════════════ */
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* ─── sidebar ─────────────────────────────────── */}
      <div className="w-64 bg-white border-r border-neutral-200 fixed h-full flex flex-col pt-8 z-30">
        <div className="px-8 mb-12">
          <span
            className="text-2xl tracking-widest uppercase font-light text-gold-500"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            Lumière
          </span>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Admin Portal
          </p>
        </div>

        <div className="flex flex-col space-y-2 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded-sm transition-all ${
                activeTab === tab.id
                  ? "bg-neutral-900 text-white shadow-md"
                  : "text-neutral-500 hover:bg-cream-50 hover:text-neutral-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto mb-8 px-4 w-full">
           <Link to="/shop" className="flex items-center gap-3 w-full px-4 py-3 text-xs uppercase tracking-widest font-bold bg-cream-50 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all rounded-sm border border-neutral-200">
             <ArrowLeft className="w-4 h-4" /> Exit to Store
           </Link>
        </div>
      </div>

      {/* ─── main content ────────────────────────────── */}
      <div className="ml-64 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          {/* header */}
          <div className="flex justify-between items-center mb-10">
            <h1
              className="text-3xl font-light text-neutral-800"
              style={{ fontFamily: "ui-serif, Georgia, serif" }}
            >
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-neutral-500 flex items-center gap-2">
              <Users className="w-4 h-4" /> Supervisor:{" "}
              <span className="font-bold">{user?.displayName}</span>
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* ═══ OVERVIEW ════════════════════════ */}
                {activeTab === "overview" && (
                  <>
                    {/* stat cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {[
                        {
                          label: "Revenue",
                          val: `$${fmt(totalRevenue)}`,
                          icon: DollarSign,
                          bg: "bg-green-50 text-green-600",
                        },
                        {
                          label: "Pending Orders",
                          val: pendingOrders,
                          icon: ShoppingBag,
                          bg: "bg-orange-50 text-orange-600",
                        },
                        {
                          label: "Products",
                          val: totalProducts,
                          icon: Box,
                          bg: "bg-blue-50 text-blue-600",
                        },
                        {
                          label: "Services",
                          val: totalServices,
                          icon: Sparkles,
                          bg: "bg-pink-50 text-pink-600",
                        },
                        {
                          label: "Active Users",
                          val: totalUsers,
                          icon: Users,
                          bg: "bg-violet-50 text-violet-600",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-white p-6 border border-neutral-100 shadow-sm flex items-start justify-between"
                        >
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                              {s.label}
                            </p>
                            <h3
                              className="text-3xl font-light text-neutral-800"
                              style={{
                                fontFamily: "ui-serif, Georgia, serif",
                              }}
                            >
                              {s.val}
                            </h3>
                          </div>
                          <div className={`p-3 rounded-full ${s.bg}`}>
                            <s.icon className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* chart */}
                    <div className="bg-white p-8 border border-neutral-100 shadow-sm mb-8">
                      <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
                        <TrendingUp className="w-5 h-5 text-gold-500" />
                        <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                          Revenue Analytics
                        </h3>
                      </div>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#D4AF37"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#D4AF37"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fill: "#A3A3A3" }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 10, fill: "#A3A3A3" }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #f1f5f9",
                                borderRadius: "4px",
                                fontSize: "12px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#D4AF37"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}

                {/* ═══ PRODUCTS ═══════════════════════ */}
                {activeTab === "products" && (
                  <div>
                    <div className="flex items-center justify-between mb-8 gap-4">
                      <div className="flex-1 max-w-sm relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          placeholder="Search catalogue..." 
                          value={productSearch}
                          onChange={e => setProductSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:border-gold-500 rounded-sm"
                        />
                      </div>
                      <p className="text-sm text-neutral-500 hidden md:block">
                        {products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase())).length} products found
                      </p>
                      <button
                        onClick={() => {
                          resetForm();
                          setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add Product
                      </button>
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
                          <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                                {editingProduct
                                  ? "Edit Product"
                                  : "New Product"}
                              </h3>
                              <button
                                onClick={resetForm}
                                className="text-neutral-400 hover:text-red-500"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2">
                                      Price ($)
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
                                <div className="grid grid-cols-2 gap-4">
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
                                    if (!imageFile)
                                      setImagePreview(e.target.value);
                                  }}
                                  className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-100">
                              <button
                                onClick={resetForm}
                                className="px-6 py-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveProduct}
                                disabled={isSaving || !formData.name}
                                className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
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
                      <table className="w-full text-left">
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
                            .filter(p => !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase()))
                            .map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Image+Error&background=D4AF37&color=fff"; }}
                                  className="w-12 h-14 object-cover border border-neutral-100"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-medium text-neutral-800 text-xs uppercase tracking-wider">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-neutral-400 mt-1">
                                  {p.collection?.replace("-", " ")} ·{" "}
                                  {p.category}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-neutral-800 font-medium">
                                ${fmt(p.price)}
                              </td>
                              <td className="px-6 py-4 text-neutral-600">
                                {p.stock ?? "—"}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${p.isActive !== false ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}
                                >
                                  {p.isActive !== false
                                    ? "Active"
                                    : "Inactive"}
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
                                No products yet. Click "+ Add Product" to create
                                your first product.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ═══ SERVICES ════════════════════════ */}
                {activeTab === "services" && (
                  <div>
                    <div className="flex items-center justify-between mb-8 gap-4">
                      <div className="flex-1 max-w-sm relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          placeholder="Search services..." 
                          value={serviceSearch}
                          onChange={e => setServiceSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 text-sm focus:outline-none focus:border-gold-500 rounded-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        {services.length === 0 && (
                          <button
                            onClick={seedServices}
                            className="px-6 py-3 bg-cream-100 text-neutral-800 text-xs uppercase tracking-widest hover:bg-cream-200 transition-colors border border-cream-200"
                          >
                            Seed 20 Services
                          </button>
                        )}
                        <button
                          onClick={() => {
                            resetServiceForm();
                            setShowServiceForm(true);
                          }}
                          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Add Service
                        </button>
                      </div>
                    </div>

                    {/* service form modal */}
                    <AnimatePresence>
                      {showServiceForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white border border-neutral-100 shadow-lg mb-8 overflow-hidden"
                        >
                          <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
                                {editingService
                                  ? "Edit Service"
                                  : "New Service"}
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

                              {/* image upload */}
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
                                    if (!imageFile)
                                      setImagePreview(e.target.value);
                                  }}
                                  className="w-full p-3 bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-gold-500"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-neutral-100">
                              <button
                                onClick={resetServiceForm}
                                className="px-6 py-3 text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveService}
                                disabled={isSaving || !serviceFormData.name}
                                className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors disabled:opacity-50"
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

                    {/* services table */}
                    <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
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
                            .filter(s => !serviceSearch || s.name?.toLowerCase().includes(serviceSearch.toLowerCase()))
                            .map((s) => (
                            <tr
                              key={s.id}
                              className="hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <img
                                  src={s.image}
                                  alt={s.name}
                                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Service&background=D4AF37&color=fff"; }}
                                  className="w-16 h-10 object-cover border border-neutral-100"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-medium text-neutral-800 text-xs uppercase tracking-wider">
                                  {s.name}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-neutral-800 font-medium">
                                ₹{s.price}
                              </td>
                              <td className="px-6 py-4 text-neutral-600">
                                {s.duration} min
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-cream-50 text-neutral-600 text-[10px] uppercase tracking-widest font-medium border border-cream-100">
                                  {s.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${s.isActive !== false ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"}`}
                                >
                                  {s.isActive !== false
                                    ? "Active"
                                    : "Inactive"}
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
                                No services yet. Click "+ Add Service" or "Seed 20 Services".
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ═══ ORDERS ═════════════════════════ */}
                {activeTab === "orders" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                       <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search Order ID or Email..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full bg-white border border-neutral-100 py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                    <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-cream-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Date
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Items
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Payment
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Status
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-sm">
                        {orders
                          .filter(o => 
                            !orderSearch || 
                            o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                            o.customer?.email?.toLowerCase().includes(orderSearch.toLowerCase())
                          )
                          .map((o) => {
                          const d = o.createdAt?.toDate
                            ? o.createdAt.toDate().toLocaleDateString()
                            : new Date(
                                o.createdAt || Date.now()
                              ).toLocaleDateString();
                          return (
                            <tr
                              key={o.id}
                              className="hover:bg-neutral-50 transition-colors"
                            >
                              <td className="px-6 py-4 font-mono text-xs">
                                {o.id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 text-neutral-600 font-serif italic text-xs">
                                {d}
                              </td>
                              <td className="px-6 py-4 text-neutral-600 text-xs">
                                {o.items?.length || 0} items
                              </td>
                              <td className="px-6 py-4 text-neutral-800 font-bold">
                                ₹{o.totalAmount || 0}
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                                  {o.paymentType === 'COD' ? '🚚' : '💳'} {o.paymentType}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${statusColors[o.status] || "bg-neutral-100 text-neutral-500"}`}
                                >
                                  {o.status?.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select
                                  value={o.status}
                                  onChange={(e) =>
                                    updateOrderStatus(o, e.target.value)
                                  }
                                  className="text-[10px] border border-neutral-100 bg-white p-1 text-neutral-600 focus:outline-none uppercase font-bold"
                                >
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="packed">Packed</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="out_for_delivery">Out for Delivery</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="return_requested">Return Requested</option>
                                  <option value="cancelled">Cancel</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                        {orders.length === 0 && (
                          <tr>
                            <td
                              colSpan="6"
                              className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                            >
                              No orders yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

                {/* ═══ APPOINTMENTS ═══════════════════ */}
                {activeTab === "appointments" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.length === 0 && (
                      <div className="col-span-full text-center py-20 text-neutral-400 text-sm italic">
                        No appointment bookings yet.
                      </div>
                    )}
                    {appointments.map((a) => (
                      <div
                        key={a.id}
                        className="bg-white p-6 border border-neutral-100 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${statusColors[a.status] || "bg-gold-100 text-gold-700"}`}
                            >
                              {a.status}
                            </span>
                            <span
                              className="text-xl font-light text-neutral-800"
                              style={{
                                fontFamily: "ui-serif, Georgia, serif",
                              }}
                            >
                              ${a.price}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-800 mb-1">
                            {a.serviceName}
                          </h4>
                          <p className="text-xs text-neutral-500 font-serif italic mb-4">
                            {a.staffName}
                          </p>
                          <p className="text-xs text-neutral-600 mb-6 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> {a.date} at{" "}
                            {a.time}
                          </p>
                        </div>
                        {a.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAppointment(a.id, "confirmed")
                              }
                              className="flex-1 bg-green-500 text-white py-2 text-[10px] uppercase font-bold hover:bg-green-600 transition-colors flex justify-center items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAppointment(a.id, "cancelled")
                              }
                              className="flex-1 bg-red-50 text-red-600 py-2 text-[10px] uppercase font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        )}
                        {a.status === "confirmed" && (
                          <div className="flex gap-2">
                            <button
                               onClick={() => handleAppointment(a.id, "completed")}
                               className="flex-1 bg-neutral-900 text-white py-2 text-[10px] uppercase font-bold hover:bg-gold-500 transition-colors"
                            >
                               Mark Completed
                            </button>
                             <button
                               onClick={() => handleAppointment(a.id, "no_show")}
                               className="flex-1 bg-neutral-100 text-neutral-500 py-2 text-[10px] uppercase font-bold hover:bg-neutral-200 transition-colors"
                            >
                               No Show
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ═══ USERS ═════════════════════════ */}
                {activeTab === "users" && (
                  <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-cream-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            UID
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Name / Email
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Points
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Role
                          </th>
                          <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-sm">
                        {users.map((u) => (
                          <tr
                            key={u.id}
                            className="hover:bg-neutral-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                              {u.id.slice(0, 10)}…
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-neutral-800 font-medium">
                                {u.name || u.displayName || "—"}
                              </p>
                              <p className="text-[10px] text-neutral-400 mt-0.5">
                                {u.email}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-gold-600 font-medium">
                              {u.loyaltyPoints ?? 0}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${u.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-neutral-100 text-neutral-600"}`}
                              >
                                {u.role || "customer"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role || "customer"}
                                onChange={(e) =>
                                  updateUserRole(u.id, e.target.value)
                                }
                                className="text-xs border border-neutral-200 bg-white p-1 text-neutral-600 focus:outline-none"
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                            >
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
=======
  /* ─── logic handlers ────────────────────────────────── */
  const updateOrderStatus = async (order, nextStatus) => {
    if (order.status === nextStatus) return;
    if (nextStatus !== 'cancelled' && !canMoveToStatus(order.status, nextStatus)) {
      alert(`Invalid status transition from ${order.status} to ${nextStatus}`);
      return;
    }
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, "orders", order.id);
        const snap = await transaction.get(orderRef);
        if (!snap.exists()) return;
        const data = snap.data();
        let update = { status: nextStatus, updatedAt: Timestamp.now() };
        if (nextStatus === "cancelled") {
          data.items?.forEach(item => {
            transaction.update(doc(db, "products", item.id), { stock: increment(item.qty || item.quantity) });
          });
          if (data.userId && data.pointsEarned) {
            transaction.update(doc(db, "users", data.userId), { loyaltyPoints: increment(-data.pointsEarned) });
          }
        }
        if (nextStatus === "delivered" && data.userId && data.pointsEarned) {
          transaction.update(doc(db, "users", data.userId), { loyaltyPoints: increment(data.pointsEarned) });
        }
        transaction.update(orderRef, update);
      });
    } catch (e) { console.error(e); alert("Failed to update order"); }
  };

  const handleAppointment = async (appt, status) => {
    try {
      await runTransaction(db, async (t) => {
        const ref = doc(db, "appointments", appt.id);
        const snap = await t.get(ref);
        if(!snap.exists()) return;
        const data = snap.data();
        t.update(ref, { status, updatedAt: Timestamp.now() });
        if (status === "completed" && data.userId) {
          t.update(doc(db, "users", data.userId), { loyaltyPoints: increment(Math.floor((data.price || 0) / 10)) });
        }
      });
    } catch (e) { console.error(e); alert("Failed to update appointment"); }
  };

  /* ─── generic save ─────────────────────────────────── */
  const saveEntry = async (col, data, editingId, resetFn) => {
    setIsSaving(true);
    try {
      let imageUrl = data.image;
      if (imageFile) {
        const sRef = ref(storage, `${col}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(sRef, imageFile);
        imageUrl = await getDownloadURL(sRef);
      }
      const payload = { ...data, image: imageUrl, updatedAt: Timestamp.now() };
      if (editingId) await updateDoc(doc(db, col, editingId), payload);
      else { payload.createdAt = Timestamp.now(); await addDoc(collection(db, col), payload); }
      resetFn();
      setImageFile(null);
      setImagePreview("");
    } catch (e) { console.error(e); alert("Save failed"); } finally { setIsSaving(false); }
  };

  const deleteEntry = async (col, id) => {
    if (window.confirm("Delete permanently?")) await deleteDoc(doc(db, col, id));
  };

  /* ─── seeding ──────────────────────────────────────── */
  const seedCollection = async (col, dataFile) => {
    if (!window.confirm(`Seed ${col}?`)) return;
    setIsLoading(true);
    try {
      const { default: entries } = await import(`../data/${dataFile}.json`);
      for (const entry of entries) {
        await addDoc(collection(db, col), { ...entry, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      }
      alert("Seeding complete!");
    } catch (e) { console.error(e); alert("Seeding failed"); } finally { setIsLoading(false); }
  };

  /* ─── calculations ─────────────────────────────────── */
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);

  /* ─── tab config ─────────────────────────────────── */
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Reservations", icon: Calendar },
    { id: "products", label: "Inventory", icon: Box },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "staff", label: "Specialists", icon: UserCheck },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 fixed h-full flex flex-col pt-8 z-30 shadow-sm">
        <div className="px-8 mb-12">
          <span className="text-2xl tracking-widest uppercase font-light text-gold-500" style={{ fontFamily: "ui-serif, Georgia, serif" }}>Lumière</span>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Admin Portal</p>
        </div>
        <div className="flex flex-col space-y-1 px-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest font-bold rounded transition-all ${activeTab === tab.id ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10" : "text-neutral-500 hover:bg-neutral-50"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-auto mb-8 px-4"><Link to="/" className="flex items-center justify-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-widest font-bold bg-cream-50 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all border border-neutral-200 rounded-sm"><ArrowLeft className="w-4 h-4" /> Exit Portal</Link></div>
      </div>

      <div className="ml-64 flex-1 p-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-10 pb-6 border-b border-neutral-100">
            <div>
              <h1 className="text-3xl font-light text-neutral-800" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Managing {user?.displayName || "System Administrator"}</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="px-4 py-2 bg-white border border-neutral-100 shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Live Status</span>
               </div>
            </div>
          </header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Synchronizing Data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, ease: "circOut" }}>
                
                {/* ═══ OVERVIEW ═══ */}
                {activeTab === "overview" && (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: "Gross Revenue", val: `₹${fmt(totalRevenue)}`, icon: DollarSign, c: "text-emerald-600 bg-emerald-50", line: "Revenue Stream" },
                        { label: "Total Orders", val: orders.length, icon: ShoppingBag, c: "text-orange-600 bg-orange-50", line: "Orders Flow" },
                        { label: "Active Services", val: services.length, icon: Sparkles, c: "text-pink-600 bg-pink-50", line: "Catalog Size" },
                        { label: "Total Staff", val: staff.length, icon: UserCheck, c: "text-indigo-600 bg-indigo-50", line: "Team Strength" },
                      ].map(s => (
                        <div key={s.label} className="bg-white p-6 border border-neutral-100 shadow-sm flex flex-col justify-between group hover:border-gold-200 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div><p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">{s.label}</p><h3 className="text-3xl font-light text-neutral-800" style={{ fontFamily: "ui-serif, Georgia, serif" }}>{s.val}</h3></div>
                            <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${s.c}`}><s.icon className="w-5 h-5" /></div>
                          </div>
                          <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">{s.line}</span>
                            <div className="w-12 h-1 bg-neutral-50 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-neutral-200" /></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-8 border border-neutral-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-800 mb-8 pb-4 border-b border-neutral-50 flex items-center gap-2 relative z-10"><TrendingUp className="w-4 h-4 text-gold-500" /> Revenue Growth Analytics</h3>
                      <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer><AreaChart data={chartData}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/></linearGradient></defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#AAA", fontWeight: 'bold' }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#AAA", fontWeight: 'bold' }} dx={-10} /><Tooltip contentStyle={{ borderRadius: 0, border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }} /><Area type="monotone" dataKey="revenue" stroke="#D4AF37" fill="url(#g)" strokeWidth={3} animationDuration={2000} /></AreaChart></ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ ORDERS ═══ */}
                {activeTab === "orders" && (
                   <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                     <table className="w-full text-left font-serif">
                       <thead className="bg-neutral-900 text-white"><tr className="text-[10px] uppercase tracking-[0.2em]">
                         <th className="px-6 py-5 font-bold">Transaction ID</th><th className="px-6 py-5 font-bold">Total Amount</th><th className="px-6 py-5 font-bold">Current State</th><th className="px-6 py-5 font-bold text-center">Update Action</th>
                       </tr></thead>
                       <tbody className="divide-y divide-neutral-100">
                         {orders.map(o => (
                           <tr key={o.id} className="text-xs text-neutral-800 hover:bg-neutral-50/50 transition-colors">
                             <td className="px-6 py-5 font-mono text-[10px] text-neutral-400">#LMR-{o.id.slice(0,8).toUpperCase()}</td>
                             <td className="px-6 py-5 font-bold">₹{fmt(o.totalAmount)}</td>
                             <td className="px-6 py-5"><span className={`px-3 py-1 rounded-sm uppercase text-[9px] font-bold tracking-[0.1em] ${statusColors[o.status]}`}>{o.status}</span></td>
                             <td className="px-6 py-5 text-center">
                               <select value={o.status} onChange={e => updateOrderStatus(o, e.target.value)} className="bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-sm uppercase font-bold text-[9px] tracking-widest focus:ring-0">
                                 <option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                               </select>
                             </td>
                           </tr>
                         ))}
                         {orders.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-neutral-400 text-[10px] uppercase tracking-widest italic">No sales transactions logged.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                )}

                {/* ═══ PRODUCTS ═══ */}
                {activeTab === "products" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-5 border border-neutral-100 shadow-sm mb-8">
                       <div className="relative w-64 mr-4 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-gold-500 transition-colors" />
                        <input type="text" placeholder="Filter inventory..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-neutral-100 text-[10px] uppercase tracking-widest bg-neutral-50 focus:ring-1 focus:ring-gold-300 outline-none" />
                      </div>
                      <button onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductFormData({ name: "", shortDesc: "", price: "", collection: "skin-care", category: "Cleansers", stock: "", image: "", isActive: true }); setImagePreview(""); }} className="px-8 py-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold-500 transition-all flex items-center gap-2"><Plus className="w-4 h-4"/> Register Product</button>
                    </div>
                    
                    <AnimatePresence>
                      {showProductForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-neutral-100 p-10 mb-10 shadow-lg border-t-2 border-t-gold-500">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Product Specifications</h3>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Canonical Name</label><input value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} className="w-full bg-neutral-50 p-4 text-[11px] uppercase tracking-widest border-none focus:ring-1 focus:ring-gold-300"/></div>
                              <div className="grid grid-cols-2 gap-6">
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Price (₹)</label><input type="number" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: e.target.value})} className="w-full bg-neutral-50 p-4 text-[11px] border-none"/></div>
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Inventory Stock</label><input type="number" value={productFormData.stock} onChange={e => setProductFormData({...productFormData, stock: e.target.value})} className="w-full bg-neutral-50 p-4 text-[11px] border-none"/></div>
                              </div>
                              <div className="flex gap-6 pt-6 border-t border-neutral-50"><button onClick={() => setShowProductForm(false)} className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-neutral-800 transition-colors">Discard</button><button onClick={() => saveEntry("products", productFormData, editingProduct?.id, () => setShowProductForm(false))} disabled={isSaving} className="px-10 py-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-gold-500 transition-all">{isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Commit Entry</button></div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-40 h-52 bg-neutral-50 border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center overflow-hidden cursor-pointer group hover:bg-neutral-100/50 transition-colors" onClick={() => fileRef.current?.click()}>
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/> : <><ImageIcon className="text-neutral-200 w-10 h-10 mb-3"/><p className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-300">Upload Visual Assets</p></>}
                                <input type="file" ref={fileRef} className="hidden" onChange={e => { const f = e.target.files[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f));}}} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left font-serif">
                        <thead className="bg-neutral-50 text-[10px] uppercase tracking-[0.2em] text-neutral-500"><tr className="border-b border-neutral-200"><th className="px-6 py-5">Visual Asset</th><th className="px-6 py-5">Product Identity</th><th className="px-6 py-5">Valuation</th><th className="px-6 py-5">Inventory Status</th><th className="px-6 py-5 text-right">Management</th></tr></thead>
                        <tbody className="divide-y divide-neutral-50">
                          {products.filter(p => !p.name || p.name.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                            <tr key={p.id} className="text-[11px] text-neutral-800 hover:bg-neutral-50/50 transition-colors">
                               <td className="px-6 py-4"><img src={p.image} className="w-10 h-12 object-cover border border-neutral-100 grayscale-[30%] hover:grayscale-0 transition-all duration-500 shadow-sm"/></td>
                               <td className="px-6 py-4 font-bold uppercase tracking-widest">{p.name || "Untitled Product"}</td>
                               <td className="px-6 py-4 font-bold text-neutral-900">₹{fmt(p.price)}</td>
                               <td className="px-6 py-4"><span className={`font-bold ${p.stock < 10 ? 'text-red-500' : 'text-neutral-500'}`}>{p.stock || 0} UNITS</span></td>
                               <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-3">
                                   <button onClick={() => { setEditingProduct(p); setProductFormData(p); setImagePreview(p.image); setShowProductForm(true); }} className="p-2 text-neutral-300 hover:text-gold-500 transition-colors"><Edit3 className="w-4 h-4"/></button>
                                   <button onClick={() => deleteEntry("products", p.id)} className="p-2 text-neutral-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                                 </div>
                               </td>
                            </tr>
                          ))}
                          {products.length === 0 && <tr><td colSpan={5} className="py-20 text-center text-neutral-400 text-[10px] uppercase tracking-widest italic font-serif">Empty inventory record.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ═══ SERVICES ═══ */}
                {activeTab === "services" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-5 border border-neutral-100 shadow-sm mb-8">
                      <div className="relative w-64 mr-4 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-gold-500 transition-colors" />
                        <input type="text" placeholder="Search services..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-neutral-100 text-[10px] uppercase tracking-widest bg-neutral-50 focus:ring-1 focus:ring-gold-300 outline-none" />
                      </div>
                      <div className="flex gap-4">
                        {services.length === 0 && <button onClick={() => seedCollection("services", "indianMakeupServices")} className="px-6 py-3 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-gold-500 border border-neutral-100 bg-white font-bold transition-all shadow-sm">Seed Services</button>}
                        <button onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceFormData({ name: "", description: "", price: "", duration: "", category: "Bridal", image: "", isActive: true }); setImagePreview(""); }} className="px-8 py-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold-500 transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/10"><Plus className="w-4 h-4"/> New Offering</button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showServiceForm && (
                        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white border border-neutral-100 p-10 mb-10 shadow-lg border-t-2 border-t-gold-500 overflow-hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mb-2">Service Configuration</h3>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Name</label><input value={serviceFormData.name} onChange={e => setServiceFormData({...serviceFormData, name: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] uppercase tracking-widest focus:ring-1 focus:ring-gold-300" placeholder="e.g. Royal Bridal Look"/></div>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Value Proposition</label><textarea value={serviceFormData.description} onChange={e => setServiceFormData({...serviceFormData, description: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] font-serif italic focus:ring-1 focus:ring-gold-300" rows={3}/></div>
                              <div className="grid grid-cols-2 gap-6">
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Rate (₹)</label><input type="number" value={serviceFormData.price} onChange={e => setServiceFormData({...serviceFormData, price: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] focus:ring-1 focus:ring-gold-300"/></div>
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Duration (min)</label><input type="number" value={serviceFormData.duration} onChange={e => setServiceFormData({...serviceFormData, duration: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] focus:ring-1 focus:ring-gold-300"/></div>
                              </div>
                              <div className="flex gap-6 pt-6 border-t border-neutral-50"><button onClick={() => setShowServiceForm(false)} className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-neutral-800 transition-colors">Abort</button><button onClick={() => saveEntry("services", serviceFormData, editingService?.id, () => setShowServiceForm(false))} disabled={isSaving} className="px-10 py-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:bg-gold-500 transition-all">{isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Confirm Service</button></div>
                            </div>
                            <div className="space-y-6 flex flex-col items-center justify-center">
                              <div className="w-full aspect-video bg-neutral-50 border-2 border-dashed border-neutral-100 flex flex-col items-center justify-center overflow-hidden group relative cursor-pointer hover:bg-neutral-100/50 transition-colors" onClick={() => fileRef.current?.click()}>
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"/> : <><ImageIcon className="w-10 h-10 text-neutral-200 mb-3"/><p className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400">Media Spotlight</p></>}
                                <input type="file" ref={fileRef} className="hidden" onChange={e => { const f = e.target.files[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f));}}} />
                              </div>
                              <div className="w-full">
                                <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Target Segment</label>
                                <select value={serviceFormData.category} onChange={e => setServiceFormData({...serviceFormData, category: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[10px] uppercase tracking-widest font-bold focus:ring-1 focus:ring-gold-300">{serviceCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}</select>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {services.filter(s => !s.name || s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map(s => (
                        <div key={s.id} className="bg-white border border-neutral-100 group relative shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden">
                          <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100">
                            <img src={s.image} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-125 grayscale-[40%] group-hover:grayscale-0"/>
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                              <button onClick={() => { setEditingService(s); setServiceFormData(s); setImagePreview(s.image); setShowServiceForm(true); }} className="p-3 bg-white/95 backdrop-blur-sm text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all shadow-xl"><Edit3 className="w-4 h-4"/></button>
                              <button onClick={() => deleteEntry("services", s.id)} className="p-3 bg-white/95 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 className="w-4 h-4"/></button>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="text-sm font-bold uppercase tracking-[0.2em] leading-tight text-neutral-800">{s.name || "Untitled Service"}</h4>
                              <span className="text-[10px] font-bold text-gold-600 border border-gold-100 px-2 py-0.5 rounded-sm">₹{fmt(s.price)}</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2 mb-6"><Sparkles className="w-3 h-3"/> {s.category || "General"}</p>
                            <div className="flex justify-between items-center p-3 bg-neutral-50 items-end">
                              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-neutral-400 tracking-widest"><Clock className="w-3.5 h-3.5"/> {s.duration || 0} MINS</div>
                              <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-sm shadow-gold-500/50" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {services.length === 0 && <div className="col-span-full py-40 flex flex-col items-center justify-center border border-dashed border-neutral-200 bg-white">
                        <Sparkles className="w-10 h-10 text-neutral-100 mb-4"/>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-300">Catalog Registry Empty</p>
                      </div>}
                    </div>
                  </div>
                )}

                {/* ═══ STAFF ═══ */}
                {activeTab === "staff" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-5 border border-neutral-100 shadow-sm mb-8">
                       <div className="relative w-64 mr-4 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-gold-500 transition-colors" />
                        <input type="text" placeholder="Search specialists..." value={staffSearch} onChange={e => setStaffSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-neutral-100 text-[10px] uppercase tracking-widest bg-neutral-50 focus:ring-1 focus:ring-gold-300 outline-none" />
                      </div>
                      <div className="flex gap-4">
                        {staff.length === 0 && <button onClick={() => seedCollection("staff", "indianSpecialists")} className="px-6 py-3 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-gold-500 border border-neutral-100 bg-white font-bold transition-all shadow-sm">Seed Roster</button>}
                        <button onClick={() => { setShowStaffForm(true); setEditingStaff(null); setStaffFormData({ name: "", role: "", experience: "", bio: "", specializations: [], image: "", isActive: true }); setImagePreview(""); }} className="px-8 py-3 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-gold-500 transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/10"><Plus className="w-4 h-4"/> New Specialist</button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showStaffForm && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="bg-white border border-neutral-100 p-10 mb-10 shadow-lg border-t-2 border-t-gold-500">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 mb-2">Staff Profile Registration</h3>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Full Name</label><input value={staffFormData.name} onChange={e => setStaffFormData({...staffFormData, name: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] uppercase tracking-widest focus:ring-1 focus:ring-gold-300" placeholder="e.g. Master Ananya"/></div>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Designation</label><select value={staffFormData.role} onChange={e => setStaffFormData({...staffFormData, role: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[10px] uppercase tracking-widest font-bold focus:ring-1 focus:ring-gold-300">{specialistRoles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                              <div className="grid grid-cols-2 gap-6">
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Industry Tenure</label><input value={staffFormData.experience} onChange={e => setStaffFormData({...staffFormData, experience: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] focus:ring-1 focus:ring-gold-300" placeholder="e.g. 10 years"/></div>
                                <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Skill Rating</label><input type="number" readOnly value={staffFormData.rating || 5.0} className="w-full bg-neutral-100/50 border-none p-4 text-[11px] font-bold text-neutral-400 outline-none"/></div>
                              </div>
                              <div><label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-2 block">Biography Snapshot</label><textarea value={staffFormData.bio} onChange={e => setStaffFormData({...staffFormData, bio: e.target.value})} className="w-full bg-neutral-50 border-none p-4 text-[11px] font-serif italic focus:ring-1 focus:ring-gold-300" rows={3}/></div>
                            </div>
                            <div className="space-y-8 flex flex-col items-center">
                              <div className="w-32 h-32 rounded-full ring-2 ring-gold-200 ring-offset-4 overflow-hidden group relative cursor-pointer shadow-xl transition-transform hover:scale-105" onClick={() => fileRef.current?.click()}>
                                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover"/> : <><Users className="w-8 h-8 text-neutral-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/><div className="w-full h-full bg-neutral-50 flex items-center justify-center pt-10"><p className="text-[7px] uppercase tracking-widest text-neutral-300 font-bold">Bio Asset</p></div></>}
                                <input type="file" ref={fileRef} className="hidden" onChange={e => { const f = e.target.files[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f));}}} />
                              </div>
                              <div className="w-full">
                                <label className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-4 block text-center">Domain Specializations</label>
                                <div className="flex flex-wrap justify-center gap-2">{serviceCategoryOptions.map(cat => (
                                  <button key={cat} onClick={() => { const s = staffFormData.specializations || []; const newS = s.includes(cat) ? s.filter(x => x !== cat) : [...s, cat]; setStaffFormData({ ...staffFormData, specializations: newS }); }} className={`px-4 py-1.5 text-[8px] uppercase tracking-widest border transition-all font-bold ${staffFormData.specializations?.includes(cat) ? 'bg-neutral-900 border-neutral-900 text-gold-500' : 'border-neutral-100 text-neutral-400 hover:border-gold-200'}`}>{cat}</button>
                                ))}</div>
                              </div>
                              <div className="flex gap-4 w-full pt-6">
                                <button onClick={() => setShowStaffForm(false)} className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-neutral-800 transition-colors">Dismiss</button>
                                <button onClick={() => saveEntry("staff", staffFormData, editingStaff?.id, () => setShowStaffForm(false))} disabled={isSaving} className="flex-1 bg-neutral-900 text-white py-3 text-[10px] uppercase tracking-widest font-bold flex justify-center items-center gap-2 hover:bg-gold-500 hover:text-white transition-all shadow-lg">{isSaving ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>} Commit Specialist</button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {staff.filter(s => !s.name || s.name.toLowerCase().includes(staffSearch.toLowerCase())).map(s => (
                         <div key={s.id} className="bg-white p-10 border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-700 relative group overflow-hidden flex flex-col items-center text-center">
                           <div className="absolute top-0 left-0 w-full h-1 bg-neutral-50 group-hover:bg-gold-500 transition-colors duration-700" />
                           <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-2 ring-neutral-50 ring-offset-4 grayscale-[100%] group-hover:grayscale-0 transition-all duration-700 shadow-inner"><img src={s.image} className="w-full h-full object-cover"/></div>
                           <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-800 mb-1">{s.name || "Specialist Name"}</h4>
                           <p className="text-[10px] text-gold-600 font-bold uppercase tracking-[0.15em] mb-4 italic">{s.role || "Lead Artist"}</p>
                           <p className="text-[11px] text-neutral-400 leading-relaxed mb-8 h-12 overflow-hidden line-clamp-3 font-serif font-light">{s.bio || "Crafting elegance with precision and artistic flair."}</p>
                           <div className="flex flex-wrap justify-center gap-1.5 mb-8">{s.specializations?.slice(0, 3).map(x => <span key={x} className="bg-neutral-50 border border-neutral-100 text-[8px] uppercase tracking-widest font-bold px-3 py-1 text-neutral-400">{x}</span>)}</div>
                           <div className="flex gap-4 w-full border-t border-neutral-50 pt-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                             <button onClick={() => { setEditingStaff(s); setStaffFormData(s); setImagePreview(s.image); setShowStaffForm(true); }} className="flex-1 p-2 text-neutral-300 hover:text-gold-500 transition-colors flex justify-center"><Edit3 className="w-4 h-4"/></button>
                             <button onClick={() => deleteEntry("staff", s.id)} className="flex-1 p-2 text-neutral-300 hover:text-red-500 transition-colors flex justify-center"><Trash2 className="w-4 h-4"/></button>
                           </div>
                         </div>
                       ))}
                       {staff.length === 0 && <div className="col-span-full py-40 border border-dashed border-neutral-100 bg-white flex flex-col items-center justify-center opacity-40">
                         <UserCheck className="w-12 h-12 mb-4 text-neutral-100"/>
                         <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-300">Personnel Record Unavailable</p>
                       </div>}
                    </div>
                  </div>
                )}

                {/* ═══ APPOINTMENTS ═══ */}
                {activeTab === "appointments" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {appointments.map(a => (
                      <div key={a.id} className="bg-white p-8 border border-neutral-100 shadow-sm relative group hover:border-gold-200 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                          <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm ${statusColors[a.status]}`}>{a.status}</span>
                          <span className="text-2xl font-light text-neutral-800" style={{ fontFamily: "ui-serif, Georgia, serif" }}>₹{a.price}</span>
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.15em] text-neutral-900 mb-2">{a.serviceName}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold mb-6 flex items-center gap-2 border-b border-neutral-50 pb-4"><Users className="w-3.5 h-3.5"/> {a.staffName}</p>
                        <div className="text-[10px] text-neutral-500 flex flex-col gap-3 mb-8 font-serif italic">
                          <div className="flex items-center gap-3"><Calendar className="w-3.5 h-3.5 text-gold-500"/> Scheduled: {a.date}</div>
                          <div className="flex items-center gap-3"><Clock className="w-3.5 h-3.5 text-gold-500"/> Session: {a.time}</div>
                        </div>
                        <div className="flex gap-3">
                           {a.status === 'pending' ? (
                             <>
                               <button onClick={() => handleAppointment(a, 'confirmed')} className="flex-1 py-3 bg-neutral-900 text-white text-[9px] uppercase font-bold tracking-widest hover:bg-gold-500 transition-all">Approve</button>
                               <button onClick={() => handleAppointment(a, 'cancelled')} className="flex-1 py-3 bg-red-50 text-red-600 text-[9px] uppercase font-bold tracking-widest hover:bg-red-100 transition-all">Reject</button>
                             </>
                           ) : a.status === 'confirmed' ? (
                             <>
                               <button onClick={() => handleAppointment(a, 'completed')} className="flex-1 py-3 bg-emerald-600 text-white text-[9px] uppercase font-bold tracking-widest hover:bg-emerald-700 transition-all">Check-Out</button>
                               <button onClick={() => handleAppointment(a, 'no_show')} className="flex-1 py-3 bg-neutral-100 text-neutral-500 text-[9px] uppercase font-bold tracking-widest hover:bg-neutral-200 transition-all">No-Show</button>
                             </>
                           ) : <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-neutral-200 w-full text-center py-4 border-t border-neutral-50">Transaction Closed</div>}
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && <div className="col-span-full py-40 border border-dashed border-neutral-200 flex flex-col items-center justify-center bg-white opacity-50"><Calendar className="w-12 h-12 mb-4 text-neutral-100"/><p className="text-[10px] uppercase tracking-widest font-bold text-neutral-300">No active reservations.</p></div>}
                  </div>
                )}

                 {/* ═══ USERS ═══ */}
                 {activeTab === "users" && (
                   <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                     <table className="w-full text-left font-serif">
                       <thead className="bg-neutral-900 text-white text-[10px] uppercase tracking-[0.25em]"><tr className="border-b border-neutral-800"><th className="px-8 py-6">Customer Identity</th><th className="px-8 py-6">Loyalty Pts</th><th className="px-8 py-6">System Role</th><th className="px-8 py-6 text-center">Permissivity</th></tr></thead>
                       <tbody className="divide-y divide-neutral-100 text-xs text-neutral-800">
                         {users.map(u => (
                           <tr key={u.id} className="hover:bg-neutral-50 transition-colors duration-500">
                             <td className="px-8 py-6"><div className="flex flex-col">
                               <span className="font-bold uppercase tracking-widest text-neutral-800">{u.name || (u.id.slice(0,10)+"…")}</span>
                               <span className="text-[10px] text-neutral-400 font-sans mt-0.5">{u.email}</span>
                             </div></td>
                             <td className="px-8 py-6"><span className="text-gold-600 font-black tracking-tighter text-lg">{u.loyaltyPoints || 0}</span></td>
                             <td className="px-8 py-6"><span className={`px-2 py-1 rounded-sm uppercase text-[9px] font-bold tracking-[0.1em] ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-neutral-50 text-neutral-400'}`}>{u.role || 'customer'}</span></td>
                             <td className="px-8 py-6 text-center"><select value={u.role || 'customer'} onChange={e => updateDoc(doc(db,"users",u.id),{role:e.target.value})} className="bg-neutral-50 border border-neutral-100 text-[10px] font-bold focus:ring-1 focus:ring-gold-300 uppercase tracking-widest outline-none px-4 py-2 rounded-sm transition-all"><option value="customer">CUSTOMER</option><option value="admin">ADMIN</option></select></td>
                           </tr>
                         ))}
                         {users.length === 0 && <tr><td colSpan={4} className="py-20 text-center text-neutral-400 text-[10px] uppercase tracking-widest italic">User directory unavailable.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                 )}

              </motion.div>
            </AnimatePresence>
          )}
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default AdminDashboard;
