import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Edit({ auth, producto, categorias }) {
    const { data, setData, put, processing, errors, transform } = useForm({
        category_id: producto.category_id,
        name: producto.name,
        description: producto.description || '',
        price: producto.price,
        stock: producto.stock,
        image: producto.image || '',
        specs_json: producto.specs ? JSON.stringify(producto.specs, null, 2) : '',
    });

    transform((data) => {
        let specs = null;
        try {
            if (data.specs_json) {
                specs = JSON.parse(data.specs_json);
            }
        } catch (error) {
            console.error("Invalid JSON format for specs");
        }
        return {
            ...data,
            specs: specs,
        };
    });

    const submit = (e) => {
        e.preventDefault();
        try {
            if (data.specs_json) {
                JSON.parse(data.specs_json);
            }
        } catch (error) {
            alert("El formato JSON de las especificaciones no es válido.");
            return;
        }

        put(route('admin.products.update', producto.id));
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
                        Modificar <span className="text-emerald-500">Componente</span>
                    </h2>
                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/40"></span>
                        Editando: {producto.name}
                    </p>
                </motion.div>
            }
        >
            <Head title={`Editar - ${producto.name}`} />

            <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[#0a0c14]/90 backdrop-blur-3xl border border-white/5"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                    <form onSubmit={submit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Identidad */}
                            <div className="md:col-span-2 relative">
                                <div className="absolute right-4 top-0 text-[40px] font-black text-white/[0.03] italic uppercase pointer-events-none select-none tracking-tighter">IDENTIDAD_PC</div>
                                <label className={labelClasses} htmlFor="name">Designación del Producto</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="EJ: NVIDIA RTX 5090..."
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClasses}
                                />
                                {errors.name && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1 animate-pulse">{errors.name}</div>}
                            </div>

                            {/* Categoría */}
                            <div className="relative">
                                <label className={labelClasses} htmlFor="category_id">Sector Logístico</label>
                                <div className="relative group">
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`${inputClasses} appearance-none cursor-pointer`}
                                    >
                                        <option value="" className="bg-[#0f111a] text-slate-600">-- SELECCIONAR SECTOR --</option>
                                        {categorias && categorias.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-[#0f111a] text-white uppercase font-bold text-xs tracking-widest">{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 transition-colors group-hover:text-emerald-500">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                {errors.category_id && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.category_id}</div>}
                            </div>

                            {/* Imagen */}
                            <div>
                                <label className={labelClasses} htmlFor="image">Matriz Visual (URL)</label>
                                <input
                                    id="image"
                                    type="text"
                                    placeholder="https://resource.host/image.png"
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    className={inputClasses}
                                />
                                {errors.image && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.image}</div>}
                            </div>

                            {/* Precio */}
                            <div className="relative">
                                <label className={labelClasses} htmlFor="price">Valor de Adquisición (€)</label>
                                <div className="relative group">
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className={`${inputClasses} pl-12`}
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500 font-black italic tracking-tighter text-lg pointer-events-none group-hover:scale-110 transition-transform">€</div>
                                </div>
                                {errors.price && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.price}</div>}
                            </div>

                            {/* Stock */}
                            <div className="relative">
                                <label className={labelClasses} htmlFor="stock">Suministro Disponible (UD)</label>
                                <div className="relative group">
                                    <input
                                        id="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className={`${inputClasses} pl-12`}
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none">#</div>
                                </div>
                                {errors.stock && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.stock}</div>}
                            </div>

                            {/* Descripción */}
                            <div className="md:col-span-2">
                                <label className={labelClasses} htmlFor="description">Manifiesto Técnico / Descripción</label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows="4"
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`${inputClasses} leading-relaxed font-medium text-slate-400`}
                                />
                                {errors.description && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.description}</div>}
                            </div>

                            {/* Specs JSON */}
                            <div className="md:col-span-2 relative">
                                <div className="absolute left-5 top-14 z-20 pointer-events-none flex items-center gap-2">
                                    <span className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-tighter rounded-md italic shadow-[0_0_15px_rgba(16,185,129,0.5)]">JSON_PROTOCOL_V3</span>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                </div>
                                <label className={labelClasses} htmlFor="specs">Fichero de Especificaciones (JSON)</label>
                                <textarea
                                    id="specs"
                                    value={data.specs_json}
                                    onChange={(e) => setData('specs_json', e.target.value)}
                                    className="w-full bg-[#050505] border border-white/5 text-emerald-500 font-mono text-sm rounded-3xl px-8 py-10 pt-16 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all placeholder-slate-800 shadow-2xl relative z-10 min-h-[250px] scrollbar-hide"
                                />
                                {errors.specs && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1 animate-bounce">{errors.specs}</div>}
                            </div>
                        </div>

                        {/* Botonera */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5 mt-12 bg-gradient-to-t from-white/[0.01] to-transparent p-6 rounded-b-3xl">
                            <Link 
                                href={route('admin.products.index')} 
                                className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] italic transition-all decoration-emerald-500/0 hover:decoration-emerald-500 underline underline-offset-8 decoration-2"
                            >
                                [ CANCELAR_OPERACION ]
                            </Link>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto min-w-[300px] relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] px-10 py-5 font-black uppercase tracking-[0.2em] italic transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                                <div className="relative flex items-center justify-center gap-4">
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            SINCRONIZANDO...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            ACTUALIZAR_CORE_SISTEMA
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}

