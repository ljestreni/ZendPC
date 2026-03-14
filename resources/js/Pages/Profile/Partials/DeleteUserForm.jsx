import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
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
                <h2 className="text-xl font-bold text-white">
                    Eliminar Cuenta
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Una vez que se elimine tu cuenta, todos sus recursos y datos se borrarán de forma permanente. 
                    Antes de eliminar tu cuenta, por favor descarga cualquier dato o información que desees conservar.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Eliminar Mi Cuenta
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        ¿Estás seguro de que deseas eliminar tu cuenta?
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Una vez que se elimine tu cuenta, todos sus recursos y datos se borrarán de forma permanente. 
                        Por favor, introduce tu contraseña para confirmar que deseas eliminar permanentemente tu cuenta.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
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
                            placeholder="Password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            Confirmar Eliminación
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
