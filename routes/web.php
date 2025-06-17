<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BasicController;

Route::get('/', [BasicController::class, 'index']);
Route::get('/api/ejecutivos/{sucursalId}', [BasicController::class, 'getEjecutivos']);
