<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // User exists, update google_id if it's empty and log them in
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
                Auth::login($user, true);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(Str::random(16)), // Fallback random password
                    'email_verified_at' => now(), // Assume Google's email is verified
                ]);

                Auth::login($user, true);
            }

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['email' => 'Unable to authenticate with Google.']);
        }
    }
}
