<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withCount('orders')->latest()->paginate(10);
        
        $stats = [
            'total_users' => User::count(),
            'super_admins' => User::where('role', 'super_admin')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'standard_users' => User::where('role', 'user')->count(),
            'google_users' => User::whereNotNull('google_id')->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'stats' => $stats
        ]);
    }

    public function show(User $user)
    {
        $user->load(['orders.items.product', 'orders.user']);
        
        return response()->json($user);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,admin,super_admin'
        ]);

        $currentUser = auth()->user();

        // Safety: Cannot change your own role
        if ($user->id === $currentUser->id) {
            return back()->with('error', 'No puedes cambiar tu propio rol.');
        }

        // Hierarchy Rules:
        // 1. Only super_admin can create/manage other admins or super_admins
        // 2. admins can only manage standard users (user)
        
        if ($currentUser->role !== 'super_admin') {
            // If current user is just an admin
            if ($user->role !== 'user' || $request->role !== 'user') {
                return back()->with('error', 'No tienes privilegios para gestionar rangos administrativos.');
            }
        }

        $user->update([
            'role' => $request->role
        ]);

        return back()->with('success', "Rol de {$user->name} actualizado correctamente.");
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
        ]);

        $currentUser = auth()->user();

        // Hierarchy Rules for Editing:
        // 1. admin can only edit standard users
        // 2. super_admin can edit anyone
        if ($currentUser->role !== 'super_admin' && $user->role !== 'user') {
            return back()->with('error', 'No tienes privilegios para editar a personal administrativo.');
        }

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->update($data);

        return back()->with('success', "Datos de {$user->name} actualizados correctamente.");
    }

    public function destroy(User $user)
    {
        $currentUser = auth()->user();

        if ($user->id === $currentUser->id) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        // Hierarchy Rules for Deletion:
        // 1. admin can only delete standard users
        // 2. super_admin can delete anyone (except themselves)
        
        if ($currentUser->role !== 'super_admin') {
            if ($user->role !== 'user') {
                return back()->with('error', 'No tienes privilegios para eliminar a personal administrativo.');
            }
        }

        $user->delete();

        return back()->with('success', 'Usuario eliminado correctamente.');
    }
}
