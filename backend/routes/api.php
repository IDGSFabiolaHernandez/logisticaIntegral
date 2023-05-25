<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('auth/login', 'App\Http\Controllers\Auth\LoginController@login');
