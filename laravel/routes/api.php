<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/v1/login', [AuthController::class, 'login']);
Route::get('/v1/auth', [AuthController::class, 'me'])->middleware('auth:api');

Route::middleware(['auth:api', 'role:admin'])->get('/logs-proxy', function () {
    return response()->json(['access' => 'granted']);
});

Route::get('/v1/auth-check', function () {
    return response('', 204);
})->middleware('auth:api');
