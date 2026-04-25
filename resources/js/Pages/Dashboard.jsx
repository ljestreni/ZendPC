import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/Components/Modal';

export default function Dashboard({ configuracionesGuardadas, pedidos }) {
    const [activeTab, setActiveTab] = useState('configs');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    
    const totalSpent = pedidos.reduce((acc, pedido) => acc + parseFloat(pedido.total), 0);
    const buildCount = configuracionesGuardadas.length;

    const handleCancelOrder = (order) => {
        setOrderToCancel(order);
        setIsCancelConfirmOpen(true);
    };

    const confirmCancel = () => {
        if (!orderToCancel) return;
        router.post(route('orders.cancel', orderToCancel.id), {}, {
            onSuccess: () => {
                setIsCancelConfirmOpen(false);
                setOrderToCancel(null);
            }
        });
    };

    const getStatusLabel = (status) => {
        const labels = {
            'pending': 'Pendiente',
            'processing': 'Procesando',
            'completed': 'Completado',
            'cancelled': 'Cancelado',
        };
        return labels[status] || status;
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

    return (
        <AuthenticatedLayout
            header={
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-2">
                        Mi <span className="text-emerald-500">Taller</span>
                    </h2>
                    <p className="text-slate-400 font-medium uppercase tracking-[0.2em] text-[10px]">Espacio de trabajo de grado industrial.</p>
                </div>
            }
        >
            <Head title="Mi Taller" />
            <div className="py-12 relative z-10">

                {/* User Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card-premium p-8 rounded-[2rem] flex items-center gap-6 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16, 185, 129,0.2)]">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
                        </div>
                        <div>
                             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Montajes</div>
                             <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{buildCount}</div>
                        </div>
                    </div>
                    
                    <div className="glass-card-premium p-8 rounded-[2rem] flex items-center gap-6 border border-white/5 hover:border-emerald-500/20 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <div>
                             <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Inversión Total</div>
                             <div className="text-3xl font-black text-white italic tracking-tighter leading-none">{totalSpent.toLocaleString('es-ES')} <span className="text-emerald-500 text-xl">€</span></div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2">
                         <Link href={route('builder.index')} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16, 185, 129,0.4)] hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm italic">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                             Nuevo Proyecto
                         </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 mb-8 border-b border-white/5 pb-4">
                    <button 
                        onClick={() => setActiveTab('configs')}
                        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'configs' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Montajes Guardados ({buildCount})
                        {activeTab === 'configs' && <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-500" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'orders' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Mis Pedidos ({pedidos.length})
                        {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-emerald-500" />}
                    </button>
                </div>

                {activeTab === 'configs' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {configuracionesGuardadas && configuracionesGuardadas.length > 0 ? (
                            configuracionesGuardadas.map((config) => (
                                <div key={config.id} className="glass-card-premium rounded-[2.5rem] overflow-hidden flex flex-col group border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                                    <div className="h-28 bg-white/[0.02] border-b border-white/5 p-8 flex justify-between items-center group-hover:bg-white/[0.04] transition-colors">
                                         <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16, 185, 129,0.2)]">
                                              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                         </div>
                                         <div className="text-right">
                                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Manifiesto de Montaje</div>
                                              <div className="text-2xl font-black text-white italic leading-none">{Number(config.total_price).toLocaleString('es-ES')} €</div>
                                         </div>
                                    </div>
                                    
                                    <div className="p-8 flex-grow">
                                         <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 group-hover:text-emerald-300 transition-colors leading-tight">{config.name}</h3>
                                         
                                         <div className="text-sm text-slate-400 space-y-2">
                                              <div className="flex items-center gap-2">
                                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                   <span>Configuración lista</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                                   <span>Actualizado: {new Date(config.updated_at).toLocaleDateString()}</span>
                                              </div>
                                         </div>
                                    </div>

                                    <div className="p-4 bg-dark-bg/50 border-t border-white/5 flex gap-2">
                                     <Link 
                                         href={route('saved-configs.edit', config.id)}
                                         className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 text-center flex items-center justify-center gap-2"
                                     >
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                         Editar
                                     </Link>
                                     <Link 
                                         href={route('saved-configs.moveToCart', config.id)}
                                         method="post"
                                         as="button"
                                         className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-300 text-center flex items-center justify-center gap-2"
                                     >
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                         Al Carrito
                                     </Link>
                                     
                                     <a 
                                         href={route('export.config.pdf', config.id)}
                                         target="_blank"
                                         className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all text-slate-300 hover:text-white flex items-center justify-center flex-shrink-0"
                                         title="Ficha PDF"
                                     >
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                     </a>
                                     <Link 
                                         href={route('saved-configs.destroy', config.id)}
                                         method="delete"
                                         as="button"
                                         title="Eliminar"
                                         className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all flex-shrink-0"
                                     >
                                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                     </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center flex flex-col items-center glass-panel rounded-3xl">
                                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500/50 mb-6">
                                     <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase text-white mb-2 tracking-tighter">Aún no hay proyectos</h3>
                                <p className="text-slate-400 mb-8 max-w-sm font-medium">Parece que tu taller está vacío. Empieza a configurar tu próxima bestia ahora mismo.</p>
                                <Link href={route('builder.index')} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16, 185, 129,0.4)] hover:bg-emerald-500 transition-all text-sm italic">
                                    Ir al Configurador
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pedidos && pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <div key={pedido.id} className="glass-card-premium rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-all group">
                                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-xl font-black italic uppercase text-white tracking-tight">{pedido.order_number}</h4>
                                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${getStatusColor(pedido.status)}`}>
                                                        {getStatusLabel(pedido.status)}
                                                    </span>
                                                </div>
                                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Registrado el {new Date(pedido.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total del Manifiesto</div>
                                                <div className="text-2xl font-black text-white italic leading-none">{Number(pedido.total).toLocaleString('es-ES')} €</div>
                                            </div>
                                            <div className="flex gap-2">
                                                {pedido.status === 'pending' && (
                                                    <button 
                                                        onClick={() => handleCancelOrder(pedido)}
                                                        className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 italic"
                                                    >
                                                        Cancelar Pedido
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => setSelectedOrder(pedido)}
                                                    className="px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 italic"
                                                >
                                                    Ver Detalles
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Component Preview in Order */}
                                    <div className="px-8 pb-8 flex gap-4 overflow-x-auto custom-scrollbar">
                                        {pedido.items.map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden" title={item.product?.name || 'Producto'}>
                                                {item.product && <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-sm" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center glass-panel rounded-3xl border border-white/5">
                                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500/30 mb-6">
                                     <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase text-white mb-2 tracking-tighter">Sin Pedidos en el Sistema</h3>
                                <p className="text-slate-400 mb-8 max-w-sm font-medium">Aún no has realizado ninguna adquisición en ZendPC. Visita el catálogo para empezar.</p>
                                <Link href={route('catalog.index')} className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16, 185, 129,0.4)] hover:bg-emerald-500 transition-all text-sm italic">
                                    Explorar Catálogo
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de Detalles del Pedido */}
            <Modal show={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="5xl">
                {selectedOrder && (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none mb-2">Detalles del <span className="text-emerald-500">Manifiesto</span></h3>
                                <div className="text-slate-500 text-xs font-black uppercase tracking-widest">{selectedOrder.order_number}</div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Componentes Seleccionados</div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 lg:last:border-b last:lg:border-0">
                                            <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="text-white font-black italic uppercase tracking-tight leading-none mb-1">{item.product?.name}</div>
                                                <div className="text-slate-500 text-[10px] font-bold">UNIDADES: {item.quantity}</div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-white font-black italic tracking-tighter">{Number(item.price).toLocaleString('es-ES')} €</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-emerald-500/20 flex justify-between items-center">
                                    <div className="text-emerald-500 text-sm font-black uppercase italic">Inversión Total</div>
                                    <div className="text-2xl font-black text-white italic tracking-tighter">{Number(selectedOrder.total).toLocaleString('es-ES')} €</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Información de Envío</div>
                                    <div className="text-sm text-slate-300 space-y-1">
                                        <p className="font-bold text-white">{selectedOrder.address}</p>
                                        <p>{selectedOrder.postal_code} {selectedOrder.city}</p>
                                        <p>Tlf: {selectedOrder.phone}</p>
                                    </div>
                                </div>
                                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Estado del Sistema</div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusLabel(selectedOrder.status)}
                                        </span>
                                    </div>
                                    {selectedOrder.notes && (
                                        <div className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed italic">
                                            "{selectedOrder.notes}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 py-4 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-white/5"
                            >
                                Cerrar Detalles
                            </button>
                            {selectedOrder.status === 'pending' && (
                                <button 
                                    onClick={() => {
                                        const order = selectedOrder;
                                        setSelectedOrder(null);
                                        handleCancelOrder(order);
                                    }}
                                    className="flex-1 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-red-500/20"
                                >
                                    Cancelar Pedido
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal de Confirmación de Cancelación */}
            <Modal show={isCancelConfirmOpen} onClose={() => setIsCancelConfirmOpen(false)} maxWidth="md">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-2xl font-black italic uppercase text-white mb-2 tracking-tighter">¿Abortar Manifiesto?</h3>
                    <p className="text-slate-400 mb-8 font-medium text-sm">Esta acción cancelará el pedido <span className="text-white font-bold">{orderToCancel?.order_number}</span> y liberará los componentes al inventario. No se puede deshacer.</p>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsCancelConfirmOpen(false)}
                            className="flex-1 py-4 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-white/5"
                        >
                            Mantener Pedido
                        </button>
                        <button 
                            onClick={confirmCancel}
                            className="flex-1 py-4 bg-red-600 text-white hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            Confirmar Cancelación
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
