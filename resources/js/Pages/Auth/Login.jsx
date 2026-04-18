import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-zend-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <Head title="Iniciar Sesión" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="ZendPC Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(52, 211, 153,0.5)] rounded-2xl" />
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zend-400 to-zend-200 tracking-tight">ZendPC</h1>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    Bienvenido de nuevo
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    O{' '}
                    <Link href={route('register')} className="font-medium text-zend-400 hover:text-zend-300 transition-colors">
                        crea una cuenta nueva
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="glass-panel py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-dark-border">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-400/10 p-3 rounded-lg border border-emerald-500/20">
                            {status}
                        </div>
                    )}

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
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-slate-300" />
                            <div className="mt-1">
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="input-field shadow-inner"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    id="remember_me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-zend-600 focus:ring-zend-500 border-dark-border rounded bg-dark-bg"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-slate-400">
                                    Recordarme
                                </label>
                            </div>

                            <div className="text-sm">
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="font-medium text-zend-400 hover:text-zend-300 transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full btn-primary flex justify-center py-3 text-lg"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-dark-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-dark-bg/80 text-slate-400 backdrop-blur-sm">O continúa con</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href={route('google.login')}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-dark-border rounded-xl shadow-sm bg-dark-bg text-sm font-medium text-slate-200 hover:bg-white/5 hover:border-slate-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Iniciar sesión con Google
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimalist return to home */}
            <div className="absolute top-6 left-6 z-20">
                 <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                     Volver al Inicio
                 </Link>
            </div>
        </div>
    );
}
