<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class MaintenanceController extends Controller
{
    public function index()
    {
        return view('admin.maintenance.index');
    }

    public function down()
    {
        Artisan::call('down', [
            '--message' => 'Site is under maintenance. Please check back soon.',
            '--retry' => 60
        ]);

        return back()->with('success', 'Website is now in Maintenance Mode');
    }

    public function up()
    {
        Artisan::call('up');

        return back()->with('success', 'Website is Live Now');
    }
}
