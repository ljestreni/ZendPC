import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Edit({ auth, categoria }) {
    const { data, setData, put, processing, errors } = useForm({
        name: categoria.name,
        description: categoria.description || '',
        image: categoria.image || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', categoria.id));
    };

    const inputClasses = "w-full bg-black/40 border border-white/5 text-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder-slate-700 font-bold text-sm shadow-inner";
    const labelClasses = "block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ml-1";

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
                        Refactorizar <span className="text-emerald-500">Sector</span>
                    </h2>
                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/40"></span>
                        Modificando: {categoria.name}
                    </p>
                </motion.div>
            }
        >
            <Head title={`Editar Sector - ${categoria.name}`} />

            <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden bg-[#0a0c14]/90 backdrop-blur-3xl border border-white/5"
                >
                    {/* Visual Decorator */}
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                        <svg className="w-64 h-64 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>

                    <form onSubmit={submit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses} htmlFor="name">Etiqueta de Clasificación</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Nombre del sector..."
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClasses}
                                />
                                {errors.name && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1 animate-pulse">{errors.name}</div>}
                            </div>

                            <div>
                                <label className={labelClasses} htmlFor="description">Manifiesto de Categoría</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows="4"
                                    placeholder="Definición logística del sector..."
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`${inputClasses} leading-relaxed font-medium text-slate-400`}
                                />
                                {errors.description && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.description}</div>}
                            </div>

                            <div>
                                <label className={labelClasses} htmlFor="image">Imagen de Referencia (URL)</label>
                                <input
                                    id="image"
                                    type="text"
                                    placeholder="https://assets.zendpc.com/cat/..."
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    className={inputClasses}
                                />
                                {errors.image && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.image}</div>}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5 mt-10">
                            <Link 
                                href={route('admin.categories.index')} 
                                className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all italic underline underline-offset-8 decoration-emerald-500/20 hover:decoration-emerald-500"
                            >
                                [ RETROCEDER ]
                            </Link>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto min-w-[250px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] px-10 py-5 font-black uppercase tracking-[0.2em] italic transition-all shadow-[0_15px_30px_rgba(16,185,129,0.2)]"
                            >
                                {processing ? 'REESTRUCTURANDO...' : 'ACTUALIZAR_SECTOR'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

