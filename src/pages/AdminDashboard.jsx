import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, updateDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LayoutDashboard, Users, Calendar, Package, DollarSign, Settings, ShoppingBag, Box, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Stats & Data
    const [orders, setOrders] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [products, setProducts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch Orders
                const ordersSnap = await getDocs(query(collection(db, 'orders')));
                const fetchedOrders = ordersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setOrders(fetchedOrders);

                // Fetch Appointments
                const apptsSnap = await getDocs(query(collection(db, 'appointments')));
                const fetchedAppts = apptsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAppointments(fetchedAppts);

                // Example: Aggregating order totals by date for chart
                const groupedData = {};
                fetchedOrders.forEach(o => {
                    const dateObj = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || Date.now());
                    const d = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    groupedData[d] = (groupedData[d] || 0) + (o.totalAmount || 0);
                });
                const formattedChartData = Object.keys(groupedData).map(k => ({ date: k, revenue: groupedData[k] })).reverse().slice(0, 10);
                setChartData(formattedChartData.reverse()); // Latest 10 days

            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            // Trigger Notification logic (mock)
            alert(`Order status updated to ${newStatus}. User notified.`);
        } catch (error) {
            console.error("Error updating order", error);
        }
    };

    const handleAppointment = async (apptId, status) => {
        try {
            await updateDoc(doc(db, 'appointments', apptId), { status });
            setAppointments(appointments.map(a => a.id === apptId ? { ...a, status } : a));
            alert(`Appointment ${status}. Client notified.`);
        } catch (error) {
            console.error("Error updating appointment", error);
        }
    };

    const RevenueStats = () => {
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const pendingAppts = appointments.filter(a => a.status === 'pending').length;

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 border border-neutral-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Total Venue</p>
                        <h3 className="text-3xl font-light text-neutral-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>${totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-6 border border-neutral-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Action Orders</p>
                        <h3 className="text-3xl font-light text-neutral-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{pendingOrders}</h3>
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-6 border border-neutral-100 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Pending Reservations</p>
                        <h3 className="text-3xl font-light text-neutral-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>{pendingAppts}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex">

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-neutral-200 fixed h-full flex flex-col pt-8">
                <div className="px-8 mb-12">
                    <span className="text-2xl tracking-widest uppercase font-light text-gold-500" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Lumière</span>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Admin Portal</p>
                </div>

                <div className="flex flex-col space-y-2 px-4">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'orders', label: 'Orders Management', icon: ShoppingBag },
                        { id: 'appointments', label: 'Reservations', icon: Calendar },
                        { id: 'products', label: 'Product Inventory', icon: Box },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-medium rounded-sm transition-all ${activeTab === tab.id
                                    ? 'bg-neutral-900 text-white shadow-md'
                                    : 'text-neutral-500 hover:bg-cream-50 hover:text-neutral-900'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-12">
                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-light text-neutral-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-sm text-neutral-500 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Supervisor: <span className="font-bold">{user?.displayName}</span>
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20"><div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin"></div></div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* OVERVIEW TAB */}
                                {activeTab === 'overview' && (
                                    <>
                                        <RevenueStats />

                                        <div className="bg-white p-8 border border-neutral-100 shadow-sm mb-8">
                                            <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
                                                <TrendingUp className="w-5 h-5 text-gold-500" />
                                                <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">Revenue Analytics</h3>
                                            </div>
                                            <div className="h-80 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={chartData}>
                                                        <defs>
                                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A3A3A3' }} dy={10} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A3A3A3' }} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '4px', fontSize: '12px' }} />
                                                        <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-cream-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Order ID</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Date</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Total</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Status</th>
                                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 text-sm">
                                                {orders.map(o => {
                                                    const formattedDate = o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString() : new Date(o.createdAt || Date.now()).toLocaleDateString();
                                                    return (
                                                        <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                                                            <td className="px-6 py-4 font-mono text-xs">{String(o.id).slice(0, 8)}</td>
                                                            <td className="px-6 py-4 text-neutral-600 font-serif italic">{formattedDate}</td>
                                                            <td className="px-6 py-4 text-neutral-800 font-medium">${(o.totalAmount || 0).toFixed(2)}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${o.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{o.status}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <select
                                                                    value={o.status}
                                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                                    className="text-xs border border-neutral-200 bg-white p-1 text-neutral-600 focus:outline-none"
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="confirmed">Confirmed</option>
                                                                    <option value="processing">Processing</option>
                                                                    <option value="shipped">Shipped</option>
                                                                    <option value="delivered">Delivered</option>
                                                                    <option value="return requested">Return Request</option>
                                                                    <option value="refunded">Refunded</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* APPOINTMENTS TAB */}
                                {activeTab === 'appointments' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {appointments.map(a => (
                                            <div key={a.id} className="bg-white p-6 border border-neutral-100 shadow-sm flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 ${a.status === 'cancelled' ? 'bg-red-100 text-red-600' : a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gold-100 text-gold-700'}`}>
                                                            {a.status}
                                                        </span>
                                                        <span className="text-xl font-light text-neutral-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>${a.price}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-800 mb-1">{a.serviceName}</h4>
                                                    <p className="text-xs text-neutral-500 font-serif italic mb-4">{a.staffName}</p>

                                                    <p className="text-xs text-neutral-600 mb-6 flex items-center gap-2"><Calendar className="w-3 h-3" /> {a.date} at {a.time}</p>
                                                </div>

                                                {a.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAppointment(a.id, 'confirmed')} className="flex-1 bg-neutral-900 text-white py-2 text-[10px] uppercase font-bold hover:bg-gold-500 transition-colors flex justify-center items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Approve
                                                        </button>
                                                        <button onClick={() => handleAppointment(a.id, 'cancelled')} className="flex-1 bg-red-50 text-red-600 py-2 text-[10px] uppercase font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-1">
                                                            <XCircle className="w-3 h-3" /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* PRODUCTS TAB - PLACEHOLDER IMPLEMENTATION */}
                                {activeTab === 'products' && (
                                    <div className="bg-white p-8 border border-neutral-100 shadow-sm text-center py-20">
                                        <Box className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                                        <h3 className="text-lg text-neutral-800 font-light mb-2">Inventory Management</h3>
                                        <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">Create, read, update, and delete products from the luxury catalogue. (Future implementation)</p>
                                        <button className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-gold-500">
                                            + Add New Product
                                        </button>
                                    </div>
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
