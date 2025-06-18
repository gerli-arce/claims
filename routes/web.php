<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BasicController;
use App\Http\Controllers\Api\ReclamacionController;

Route::get('/', [BasicController::class, 'index']);
Route::get('/api/ejecutivos/{sucursalId}', [BasicController::class, 'getEjecutivos']);

Route::post('/api/reclamaciones', [BasicController::class, 'setClaim']);

// Route::post('/api/reclamaciones', [ReclamacionController::class, 'store']);
// Route::get('/api/reclamaciones', [ReclamacionController::class, 'index']);
// Route::get('/api/reclamaciones/estadisticas', [ReclamacionController::class, 'estadisticas']);
// Route::get('/api/reclamaciones/{id}', [ReclamacionController::class, 'show']);
// Route::put('/api/reclamaciones/{id}', [ReclamacionController::class, 'update']);
