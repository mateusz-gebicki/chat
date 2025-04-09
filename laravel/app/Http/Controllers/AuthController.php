<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json(['token' => $token]);
    }

    public function me(Request $request): JsonResponse
    {
        \Log::info('Authorization Header:', [
            'header' => $request->header('Authorization'),
            'user' => auth()->user()
        ]);
        return response()->json(auth()->user());
    }
}
