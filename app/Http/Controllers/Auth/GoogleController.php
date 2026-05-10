<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth.
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google Callback.
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google authentication failed.');
        }

        // 1. Check if user with this google_id exists
        $user = User::where('google_id', $googleUser->id)->first();

        if ($user) {
            Auth::login($user);
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // 2. Check if email exists but not linked
        $existingUser = User::where('email', $googleUser->email)->first();

        if ($existingUser) {
            // Store Google info in session for verification
            Session::put('google_auth', [
                'id' => $googleUser->id,
                'email' => $googleUser->email,
                'name' => $googleUser->name,
                'avatar' => $googleUser->avatar,
            ]);

            return redirect()->route('auth.google.verify');
        }

        // 3. New User - Store info in session and redirect to complete profile
        Session::put('google_auth', [
            'id' => $googleUser->id,
            'email' => $googleUser->email,
            'name' => $googleUser->name,
            'avatar' => $googleUser->avatar,
        ]);

        return redirect()->route('auth.google.complete');
    }

    /**
     * Show verification page for existing users.
     */
    public function showVerify()
    {
        if (!Session::has('google_auth')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyGoogleLink', [
            'email' => Session::get('google_auth')['email']
        ]);
    }

    /**
     * Handle verification and linking.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (!Session::has('google_auth')) {
            return redirect()->route('login');
        }

        $googleAuth = Session::get('google_auth');
        $user = User::where('email', $googleAuth['email'])->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors(['password' => 'Invalid password. Ownership could not be verified.']);
        }

        // Link and Login
        $user->update([
            'google_id' => $googleAuth['id'],
        ]);

        Auth::login($user);
        Session::forget('google_auth');

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Show complete profile page for new users.
     */
    public function showComplete()
    {
        if (!Session::has('google_auth')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/CompleteGoogleProfile', [
            'googleUser' => Session::get('google_auth')
        ]);
    }

    /**
     * Finalize registration.
     */
    public function complete(Request $request)
    {
        $request->validate([
            'use_google_name' => ['required', 'boolean'],
        ]);

        if (!Session::has('google_auth')) {
            return redirect()->route('login');
        }

        $googleAuth = Session::get('google_auth');

        $user = User::create([
            'name' => $request->use_google_name ? $googleAuth['name'] : explode('@', $googleAuth['email'])[0],
            'email' => $googleAuth['email'],
            'google_id' => $googleAuth['id'],
            'password' => null, // No password for Google signups initially
        ]);

        event(new Registered($user));

        Auth::login($user);
        Session::forget('google_auth');

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Handle linking from Profile settings.
     */
    public function link()
    {
        return Socialite::driver('google')->redirect();
    }
}
