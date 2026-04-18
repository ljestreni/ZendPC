import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '', hasPassword }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
        confirmation_text: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-xl font-black text-red-500 italic uppercase tracking-tighter">
                    Secuencia de Autodestrucción
                </h2>

                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Una vez que se elimine tu cuenta, todos sus recursos y datos se borrarán de forma permanente. 
                    Antes de eliminar tu cuenta, por favor descarga cualquier dato o información que desees conservar.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="px-6 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all text-[10px] italic"
            >
                Eliminar Mi Cuenta Permanentemente
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">
                        ¿Estás seguro de que deseas desactivar tu <span className="text-red-500">Núcleo</span>?
                    </h2>

                    <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Una vez que se elimine tu cuenta, todos sus recursos y datos se borrarán de forma permanente. 
                        {hasPassword && ' Por favor, introduce tu contraseña para confirmar que deseas eliminar permanentemente tu cuenta.'}
                    </p>

                    {hasPassword ? (
                        <div className="mt-6">
                            <InputLabel
                                htmlFor="password"
                                value="Contraseña"
                                className="sr-only"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="Contraseña"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                    ) : (
                        <div className="mt-6">
                            <InputLabel
                                htmlFor="confirmation_text"
                                value="Escribe 'ELIMINAR' para confirmar"
                                className="text-slate-300 mb-1"
                            />

                            <TextInput
                                id="confirmation_text"
                                type="text"
                                name="confirmation_text"
                                value={data.confirmation_text}
                                onChange={(e) =>
                                    setData('confirmation_text', e.target.value)
                                }
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="ELIMINAR"
                            />
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button 
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all italic border border-white/5"
                        >
                            Abortar
                        </button>

                        <button 
                            disabled={processing || (!hasPassword && data.confirmation_text !== 'ELIMINAR')}
                            className="px-6 py-3 bg-red-600 text-white hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 italic shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                        >
                            Confirmar Eliminación
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
