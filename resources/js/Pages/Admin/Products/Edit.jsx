import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Edit({ auth, producto, categorias }) {
    const { data, setData, post, processing, errors, transform } = useForm({
        category_id: producto.category_id,
        name: producto.name,
        description: producto.description || '',
        price: producto.price,
        stock: producto.stock,
        image: producto.image || '',
        image_file: null,
        _method: 'PUT',
    });

    const [specsList, setSpecsList] = useState(() => {
        if (!producto.specs) return [];
        return Object.entries(producto.specs).map(([k, v]) => ({
            id: Math.random().toString(),
            key: k,
            value: v
        }));
    });

    const addSpec = () => {
        setSpecsList([...specsList, { id: Math.random().toString(), key: '', value: '' }]);
    };

    const removeSpec = (index) => {
        const newList = [...specsList];
        newList.splice(index, 1);
        setSpecsList(newList);
    };

    const updateSpec = (index, field, val) => {
        const newList = [...specsList];
        newList[index][field] = val;
        setSpecsList(newList);
    };

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(producto.image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setData('image_file', null);
        setData('image', '');
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    transform((data) => {
        const specsObj = {};
        specsList.forEach(spec => {
            const k = spec.key.trim();
            if (k !== '') {
                specsObj[k] = spec.value;
            }
        });

        return {
            ...data,
            specs: Object.keys(specsObj).length > 0 ? specsObj : null,
        };
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.products.update', producto.id), {
            forceFormData: true,
        });
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
                                        className={`${inputClasses} appearance-none bg-none cursor-pointer pr-12`}
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
                                <label className={labelClasses}>Matriz Visual (URL o Archivo)</label>
                                <div className="flex items-center gap-6">
                                    <div className="w-40 h-40 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 bg-white p-2">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest text-center">NO<br/>IMAGE</span>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                Subir
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={handleRemoveImage}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {errors.image_file && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-3 ml-1">{errors.image_file}</div>}
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
                                <label className={labelClasses} htmlFor="stock">Suministro Disponible (UNIDADES)</label>
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

                            {/* Especificaciones Dinámicas */}
                            <div className="md:col-span-2 relative">
                                <label className={labelClasses}>Especificaciones Técnicas</label>
                                <div className="space-y-3">
                                    {specsList.map((spec, index) => (
                                        <div key={spec.id} className="flex items-center gap-3">
                                            <input
                                                type="text"
                                                placeholder="Ej: Socket"
                                                value={spec.key}
                                                onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                                className={`${inputClasses} flex-1`}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ej: AM5"
                                                value={spec.value}
                                                onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                                className={`${inputClasses} flex-[2]`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSpec(index)}
                                                className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-2xl border border-red-500/20 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addSpec}
                                        className="w-full py-4 border-2 border-dashed border-white/10 text-slate-400 font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-white/5 hover:border-emerald-500/30 hover:text-emerald-500 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                        Añadir Especificación
                                    </button>
                                </div>
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

