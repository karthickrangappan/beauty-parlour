import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  query,
  getDocs,
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
import { canMoveToStatus, calculateNewAverage } from "../utils/logicUtils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  Box,
  Loader2,
  Sparkles,
} from "lucide-react";

// Modular Components
import Sidebar from "../components/admin/Sidebar";
import OverviewSection from "../components/admin/OverviewSection";
import ProductSection from "../components/admin/ProductSection";
import ServiceSection from "../components/admin/ServiceSection";
import StaffSection from "../components/admin/StaffSection";
import OrderSection from "../components/admin/OrderSection";
import AppointmentSection from "../components/admin/AppointmentSection";
import UserSection from "../components/admin/UserSection";

/* ───────────────────── helpers ───────────────────── */
// Local helpers
const statusColors = {
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  return_requested: "bg-neutral-100 text-neutral-600",
};

/* ───────────────────── main component ───────────────────── */
const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  /* shared data */
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* search states */
  const [productSearch, setProductSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");

  /* product form state */
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shortDesc: "",
    price: "",
    collection: "skin-care",
    category: "Cleansers",
    stock: "",
    image: "",
    isActive: true,
  });

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    role: "Specialist",
    category: "General",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    workingHours: { start: 9, end: 18 },
    image: "",
    isActive: true,
  });

  /* service form state */
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "Bridal",
    image: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef(null);

  /* collection helpers */
  const collectionOptions = [
    { id: "skin-care", name: "Skin Care" },
    { id: "hair-care", name: "Hair Care" },
    { id: "body-care", name: "Body Care" },
  ];
  const categoryOptions = [
    "Cleansers",
    "Serums",
    "Moisturizers",
    "Conditioners",
    "Treatments",
    "Exfoliants",
    "Oils",
    "Lotions",
  ];

  const serviceCategoryOptions = [
    "Bridal",
    "Pre-Wedding",
    "Party",
    "Editorial",
    "Natural",
    "Add-on",
    "Hair",
    "Traditional",
    "Shoots",
  ];

  /* ─── fetch all ────────────────────────────────────── */
  useEffect(() => {
    setIsLoading(true);
    const unsubs = [];

    // orders
    const uO = onSnapshot(collection(db, "orders"), (snap) => {
      const d = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(d);
      // chart
      const grouped = {};
      d.forEach((o) => {
        const dt = o.createdAt?.toDate
          ? o.createdAt.toDate()
          : new Date(o.createdAt || Date.now());
        const key = dt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        grouped[key] = (grouped[key] || 0) + (o.totalAmount || 0);
      });
      setChartData(
        Object.entries(grouped)
          .map(([date, revenue]) => ({ date, revenue }))
          .slice(-10)
      );
    });
    unsubs.push(uO);

    // appointments
    const uA = onSnapshot(collection(db, "appointments"), (snap) => {
      setAppointments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    unsubs.push(uA);

    // products
    const uP = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    unsubs.push(uP);

    // services
    const uS = onSnapshot(collection(db, "services"), (s) => setServices(s.docs.map(d => ({id: d.id, ...d.data()}))));
    unsubs.push(uS);

    // staff
    const uStaff = onSnapshot(collection(db, "staff"), (s) => setStaff(s.docs.map(d => ({id: d.id, ...d.data()}))));
    unsubs.push(uStaff);

    // users
    const uU = onSnapshot(collection(db, "users"), (s) => setUsers(s.docs.map(d => ({id: d.id, ...d.data()}))));
    unsubs.push(uU);

    setIsLoading(false);
    return () => unsubs.forEach((u) => u());
  }, []);

  /* ─── order status ────────────────────────────────── */
  const updateOrderStatus = async (order, nextStatus) => {
    if (order.status === nextStatus) return;
    
    // Status can never go backward
    if (nextStatus !== 'cancelled' && !canMoveToStatus(order.status, nextStatus)) {
      toast.error(`Cannot move order status from ${order.status} to ${nextStatus}.`);
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
      toast.success(`Order status updated to ${nextStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error("Update status failed", err);
      toast.error("Failed to update status. Check console.");
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
      toast.success(`Appointment marked as ${status}`);
    } catch (err) {
      console.error("Appointment update failed", err);
      toast.error("Failed to update appointment.");
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
      toast.success(editingProduct ? "Product updated." : "Product published.");
    } catch (err) {
      console.error("Save product failed", err);
      toast.error("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product removed.");
    } catch (err) {
      toast.error("Failed to delete product.");
    }
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
      toast.success(editingService ? "Service updated." : "Service published.");
    } catch (err) {
      console.error("Save service failed", err);
      toast.error("Failed to save service.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service permanently?")) return;
    try {
      await deleteDoc(doc(db, "services", id));
      toast.success("Service removed.");
    } catch (err) {
      toast.error("Failed to delete service.");
    }
  };


  /* ─── staff form helpers ─────────────────────────── */
  const resetStaffForm = () => {
    setStaffFormData({
      name: "",
      role: "Specialist",
      category: "General",
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      workingHours: { start: 9, end: 18 },
      image: "",
      isActive: true,
    });
    setImageFile(null);
    setImagePreview("");
    setEditingStaff(null);
    setShowStaffForm(false);
  };

  const openEditStaffForm = (s) => {
    setEditingStaff(s);
    setStaffFormData({
      name: s.name || "",
      role: s.role || "Specialist",
      category: s.category || "General",
      workingDays: s.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      workingHours: s.workingHours || { start: 9, end: 18 },
      image: s.image || "",
      isActive: s.isActive !== false,
    });
    setImagePreview(s.image || "");
    setImageFile(null);
    setShowStaffForm(true);
  };

  const saveStaff = async () => {
    setIsSaving(true);
    try {
      let imageUrl = staffFormData.image;
      if (imageFile) {
        const storageRef = ref(storage, `staff/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        ...staffFormData,
        image: imageUrl,
        updatedAt: Timestamp.now(),
      };

      if (editingStaff) {
        await updateDoc(doc(db, "staff", editingStaff.id), payload);
      } else {
        payload.createdAt = Timestamp.now();
        await addDoc(collection(db, "staff"), payload);
      }
      resetStaffForm();
      toast.success(editingStaff ? "Specialist updated." : "Specialist added.");
    } catch (err) {
      console.error("Save staff failed", err);
      toast.error("Failed to save specialist.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Remove this specialist?")) return;
    try {
      await deleteDoc(doc(db, "staff", id));
      toast.success("Specialist removed.");
    } catch (err) {
      toast.error("Failed to remove specialist.");
    }
  };

  /* ─── sidebar tabs config ─────────────────────────── */
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Box },
    { id: "services", label: "Services", icon: Sparkles },
    { id: "staff", label: "Specialists", icon: Users },
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
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

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
                  <OverviewSection 
                    totalRevenue={totalRevenue}
                    pendingOrders={pendingOrders}
                    totalProducts={totalProducts}
                    totalServices={totalServices}
                    totalUsers={totalUsers}
                    chartData={chartData}
                  />
                )}

                {/* ═══ PRODUCTS ═══════════════════════ */}
                {activeTab === "products" && (
                  <ProductSection 
                    products={products}
                    productSearch={productSearch}
                    setProductSearch={setProductSearch}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    editingProduct={editingProduct}
                    formData={formData}
                    setFormData={setFormData}
                    resetForm={resetForm}
                    saveProduct={saveProduct}
                    openEditForm={openEditForm}
                    deleteProduct={deleteProduct}
                    isSaving={isSaving}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageFile={imageFile}
                    handleImageChange={handleImageChange}
                    fileRef={fileRef}
                    collectionOptions={collectionOptions}
                    categoryOptions={categoryOptions}
                  />
                )}

                {/* ═══ SERVICES ════════════════════════ */}
                {activeTab === "services" && (
                  <ServiceSection 
                    services={services}
                    serviceSearch={serviceSearch}
                    setServiceSearch={setServiceSearch}
                    showServiceForm={showServiceForm}
                    setShowServiceForm={setShowServiceForm}
                    editingService={editingService}
                    serviceFormData={serviceFormData}
                    setServiceFormData={setServiceFormData}
                    resetServiceForm={resetServiceForm}
                    saveService={saveService}
                    openEditServiceForm={openEditServiceForm}
                    deleteService={deleteService}
                    isSaving={isSaving}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageFile={imageFile}
                    handleImageChange={handleImageChange}
                    fileRef={fileRef}
                    serviceCategoryOptions={serviceCategoryOptions}
                  />
                )}

                {/* ═══ STAFF ═══════════════════════════ */}
                {activeTab === "staff" && (
                  <StaffSection 
                    staff={staff}
                    staffSearch={staffSearch}
                    setStaffSearch={setStaffSearch}
                    showStaffForm={showStaffForm}
                    setShowStaffForm={setShowStaffForm}
                    editingStaff={editingStaff}
                    staffFormData={staffFormData}
                    setStaffFormData={setStaffFormData}
                    resetStaffForm={resetStaffForm}
                    saveStaff={saveStaff}
                    openEditStaffForm={openEditStaffForm}
                    deleteStaff={deleteStaff}
                    isSaving={isSaving}
                    imagePreview={imagePreview}
                    handleImageChange={handleImageChange}
                    fileRef={fileRef}
                    serviceCategoryOptions={serviceCategoryOptions}
                  />
                )}
                {activeTab === "orders" && (
                  <OrderSection 
                    orders={orders}
                    orderSearch={orderSearch}
                    setOrderSearch={setOrderSearch}
                    updateOrderStatus={updateOrderStatus}
                    statusColors={statusColors}
                  />
                )}

                {/* ═══ APPOINTMENTS ═══════════════════ */}
                {activeTab === "appointments" && (
                  <AppointmentSection 
                    appointments={appointments}
                    handleAppointment={handleAppointment}
                    statusColors={statusColors}
                  />
                )}

                {/* ═══ USERS ═════════════════════════ */}
                {activeTab === "users" && (
                  <UserSection 
                    users={users}
                    userSearch={userSearch}
                    setUserSearch={setUserSearch}
                    updateUserRole={updateUserRole}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
