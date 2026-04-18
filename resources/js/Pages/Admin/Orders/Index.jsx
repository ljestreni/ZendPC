import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ orders }) {
    const { patch } = useForm();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    const handleStatusChange = (orderId, newStatus) => {
        patch(route('admin.orders.updateStatus', orderId), {
            status: newStatus,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            'processing': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            'completed': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            'cancelled': 'text-red-400 bg-red-400/10 border-red-400/20',
        };
        return colors[status] || 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    };

    const translateStatus = (status) => {
        const translations = {
            'pending': 'PENDIENTE',
            'processing': 'PROCESANDO',
            'completed': 'COMPLETADA',
            'cancelled': 'CANCELADA',
        };
        return translations[status] || status;
    };

    return (
        <AuthenticatedLayout
            header={
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
                        Gestión de <span className="text-emerald-500">Pedidos</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Consola de administración logística de ZendPC
                    </p>
                </motion.div>
            }
        >
            <Head title="Admin - Pedidos" />

            <div className="py-12 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[#0a0c14]/80 backdrop-blur-xl"
                >
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Historial de Operaciones</h3>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Monitoreo de transacciones y estados de envío</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Nº Pedido</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cliente</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Estado</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fecha</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Protocolos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.data.map((order) => (
                                    <motion.tr 
                                        key={order.id} 
                                        variants={itemVariants}
                                        className="hover:bg-emerald-500/[0.03] transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-white italic group-hover:text-emerald-400 transition-colors uppercase">{order.order_number}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-slate-200">{order.user.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase tracking-tight">{order.user.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-lg font-black text-white italic">{parseFloat(order.total).toLocaleString('es-ES')} €</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(order.status)} whitespace-nowrap`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right whitespace-nowrap">
                                            <div className="flex items-center gap-3 justify-end">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-400 px-4 py-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 shadow-inner"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    DETALLES
                                                </button>
                                                <div className="relative group/sel">
                                                    <select 
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="bg-black/40 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-300 px-4 py-2 pr-8 focus:ring-emerald-500/30 focus:border-emerald-500/50 appearance-none cursor-pointer hover:bg-black/60 transition-all outline-none"
                                                    >
                                                        <option value="pending" className="bg-[#0a0c14]">PENDIENTE</option>
                                                        <option value="processing" className="bg-[#0a0c14]">PROCESANDO</option>
                                                        <option value="completed" className="bg-[#0a0c14]">COMPLETADO</option>
                                                        <option value="cancelled" className="bg-[#0a0c14]">CANCELADO</option>
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-hover/sel:text-emerald-500">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-3">
                    {orders.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-5 py-2.5 rounded-[1rem] text-[9px] font-black uppercase tracking-widest border transition-all ${
                                link.active 
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] italic' 
                                : 'bg-white/[0.02] text-slate-500 border-white/5 hover:text-white hover:border-white/20'
                            } ${!link.url && 'opacity-20 cursor-not-allowed'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de Detalles del Pedido */}
            <Modal show={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="5xl">
                {selectedOrder && (
                    <div className="p-10 bg-[#0a0c14] border border-white/10 rounded-[2.5rem] relative overflow-hidden backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                        
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none mb-2">Detalles del <span className="text-emerald-500">Manifiesto</span></h3>
                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    REGISTRO_Nº: {selectedOrder.order_number}
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all rounded-full border border-white/5">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    Componentes Seleccionados
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 py-4 border-b border-white/5 last:border-0 lg:last:border-b last:lg:border-0 hover:bg-emerald-500/[0.02] transition-colors px-2 rounded-xl">
                                            <div className="w-20 h-20 rounded-2xl bg-white p-3 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                                                <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white font-black italic uppercase tracking-tight leading-none mb-1.5 truncate text-lg">{item.product?.name}</div>
                                                <div className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    UNIDADES: {item.quantity.toString().padStart(2, '0')}
                                                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                                    ID: {item.product?.id.toString().padStart(4, '0')}
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-xl font-black text-white italic tracking-tighter">{Number(item.price).toLocaleString('es-ES')} €</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-emerald-500/20 flex justify-between items-center">
                                    <div className="text-emerald-500 text-[11px] font-black uppercase italic tracking-widest flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        Inversión Total de Hardware
                                    </div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter shadow-emerald-500/20 drop-shadow-2xl">{Number(selectedOrder.total).toLocaleString('es-ES')} €</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Protocolo de Envío ({selectedOrder.user?.name})
                                    </div>
                                    <div className="text-sm text-slate-300 space-y-2 font-medium">
                                        <p className="font-black text-white uppercase italic text-lg tracking-tight">{selectedOrder.address}</p>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">{selectedOrder.postal_code} {selectedOrder.city}</p>
                                        <div className="pt-2 flex items-center gap-2 text-emerald-500 font-mono text-xs">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            TEL_COMMS: {selectedOrder.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-white/[0.01]">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Estado Operativo del Pedido
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[11px] font-black uppercase px-6 py-2 rounded-full border ${getStatusColor(selectedOrder.status)} shadow-lg`}>
                                            {translateStatus(selectedOrder.status)}
                                        </span>
                                    </div>
                                    {selectedOrder.notes && (
                                        <div className="mt-6 text-[11px] text-slate-500 uppercase tracking-widest leading-relaxed italic border-t border-white/5 pt-5">
                                            <span className="text-emerald-500 font-black block mb-2 text-[9px]">MANIFIESTO_ADICIONAL:</span>
                                            "{selectedOrder.notes}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <motion.button 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-5 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all italic border border-white/5 shadow-inner"
                            >
                                [ CERRAR_PROTOCOLO_DE_VISTA ]
                            </motion.button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}

