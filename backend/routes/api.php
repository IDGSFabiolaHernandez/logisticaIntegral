<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('auth/login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('socios/listaSocios', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerListaSocios');
Route::get('socios/sociosGenerales', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosGenerales');