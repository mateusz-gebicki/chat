<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/v1/login', [AuthController::class, 'login']);

Route::get('/v1/auth', [AuthController::class, 'me'])->middleware('auth:api');

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized.'], 401);
})->name('login');
