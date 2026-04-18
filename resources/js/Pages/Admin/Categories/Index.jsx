import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Index({ auth, categorias }) {
    const { flash } = usePage().props;

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                >
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
                        Gestión de <span className="text-emerald-500">Categorías</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Terminal de Configuración de Estructura de Datos
                    </p>
                </motion.div>
            }
        >
            <Head title="Admin Categorías" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatePresence>
                    {flash.mensaje && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 px-6 py-4 rounded-r-xl relative mb-8 flex items-center gap-4 glass-panel"
                        >
                            <div className="bg-emerald-500 p-1 rounded-full text-black">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest leading-none">{flash.mensaje}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="glass-panel rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-[#0a0c14]/80 backdrop-blur-xl"
                >
                    <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Inventario de Tipologías</h3>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Sectores activos en el configurador</p>
                        </div>
                        <Link
                            href={route("admin.categories.create")}
                            className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] italic transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Nueva Categoría
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01] border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categoría</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden md:table-cell text-center">Identificador (Slug)</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden lg:table-cell">Manifiesto</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Protocolos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {categorias && categorias.map((category) => (
                                    <motion.tr 
                                        key={category.id} 
                                        variants={itemVariants}
                                        className="hover:bg-emerald-500/[0.03] transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all"></div>
                                                <div className="font-black text-white italic uppercase tracking-tight text-lg transition-colors group-hover:text-emerald-400">{category.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden md:table-cell text-center">
                                            <span className="text-[9px] font-black text-emerald-500/80 bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 uppercase tracking-widest">{category.slug}</span>
                                        </td>
                                        <td className="px-8 py-6 hidden lg:table-cell text-slate-500">
                                            <div className="text-[10px] font-bold uppercase tracking-widest line-clamp-1 italic max-w-xs">{category.description || 'Sin notas adicionales'}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right space-x-2 whitespace-nowrap">
                                            <Link
                                                href={route("admin.categories.edit", category.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Editar
                                            </Link>
                                            <Link
                                                href={route("admin.categories.destroy", category.id)}
                                                method="delete"
                                                as="button"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Borrar
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {(!categorias || categorias.length === 0) && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 mb-6 shadow-inner">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                                <h4 className="text-white font-black uppercase italic tracking-tighter text-xl">Sin Datos de Estructura</h4>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Aún no has inicializado categorías en el núcleo del sistema.</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

