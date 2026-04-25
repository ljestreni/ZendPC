import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zend-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <Head title="Restablecer Contraseña" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="ZendPC Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(52, 211, 153,0.5)] rounded-2xl" />
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight">ZendPC</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Nueva Contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Establece tus nuevas credenciales de acceso industrial.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-dark-border">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-300" />
                            <div className="mt-1">
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="input-field shadow-inner"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Nueva Contraseña" className="text-slate-300" />
                            <div className="mt-1">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="input-field shadow-inner"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-slate-300" />
                            <div className="mt-1">
                                <TextInput
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="input-field shadow-inner"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-primary flex justify-center py-3 text-lg"
                            >
                                Restablecer Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="absolute top-6 left-6 z-20">
                 <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     Volver al Inicio
                 </Link>
            </div>
        </div>
    );
}
