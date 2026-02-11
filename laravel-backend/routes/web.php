<?php

use App\Http\Controllers\Admin\MaintenanceController;

Route::middleware(['auth','admin'])->prefix('admin')->group(function () {

    Route::get('/maintenance', [MaintenanceController::class, 'index'])->name('maintenance.index');

    Route::post('/maintenance/down', [MaintenanceController::class, 'down'])->name('maintenance.down');

    Route::post('/maintenance/up', [MaintenanceController::class, 'up'])->name('maintenance.up');

});
