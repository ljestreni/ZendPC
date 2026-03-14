<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', '=', $googleUser->getEmail())->first();

            if (!$user) {
                // Creates a new user if it doesn't exist
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)) // Random password
                ]);
            } else {
                // Update google ID if exists
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->getId()
                    ]);
                }
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));

        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['error' => 'No se pudo autenticar con Google.']);
        }
    }
}
