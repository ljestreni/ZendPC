import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                        Editar <span className="text-zend-500">Categoría</span>
                    </h2>
                    <p className="text-slate-400">Modificando los detalles de: <span className="text-white font-medium">{categoria.name}</span></p>
                </div>
            }
        >
            <Head title={`Editar Categoría - ${categoria.name}`} />

            <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <svg className="w-48 h-48 text-zend-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>

                    <form onSubmit={submit} className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="name">
                                Nombre de la Categoría
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
                            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="description">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                rows="4"
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full bg-dark-bg/50 border border-dark-border text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zend-500 focus:border-transparent transition-all placeholder-slate-600"
                            />
                            {errors.description && <div className="text-red-400 text-sm mt-2 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.description}</div>}
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

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-dark-border mt-8">
                            <Link href={route('admin.categories.index')} className="text-slate-400 hover:text-white font-medium transition-colors">
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
                                        Actualizar Categoría
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
