import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Editar <span className="text-zend-500">Producto</span>
                    </h2>
                    <p className="text-slate-400">Modificando los detalles de: <span className="text-white font-medium">{producto.name}</span></p>
                </div>
            }
        >
            <Head title={`Editar Producto - ${producto.name}`} />

            <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <form onSubmit={submit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="name">
                                    Nombre del Producto
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                />
                                {errors.name && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="category_id">
                                    Categoría
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all appearance-none"
                                >
                                    <option value="" className="bg-dark-card text-slate-400">Seleccionar Categoría...</option>
                                    {categorias && categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-dark-card text-white">{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.category_id}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="image">
                                    URL de la Imagen
                                </label>
                                <input
                                    id="image"
                                    type="text"
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                />
                                {errors.image && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.image}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="price">
                                    Precio (€)
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                />
                                {errors.price && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.price}</div>}
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="stock">
                                    Stock
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                />
                                {errors.stock && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.stock}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="description">
                                    Descripción del Producto
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows="3"
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                                />
                                {errors.description && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.description}</div>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-slate-300 text-sm font-semibold mb-2 flex items-center justify-between" htmlFor="specs">
                                    <span>Especificaciones Técnicas (Formato JSON)</span>
                                </label>
                                <textarea
                                    id="specs"
                                    value={data.specs_json}
                                    onChange={(e) => setData('specs_json', e.target.value)}
                                    className="w-full bg-dark-bg border border-dark-border text-emerald-400 font-mono text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-700"
                                    rows="6"
                                />
                                {errors.specs && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.specs}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-border mt-8">
                            <Link href={route('admin.products.index')} className="text-slate-400 hover:text-white font-medium transition-colors">
                                Volver
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary py-3 px-8 flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                        Actualizar Producto
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
