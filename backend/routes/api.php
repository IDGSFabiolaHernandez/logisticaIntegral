<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('auth/login', 'App\Http\Controllers\Auth\LoginController@login');

Route::post('socios/listaSocios', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerListaSocios');
Route::get('socios/obtenerSociosGenerales', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosGenerales');
Route::get('socios/obtenerSociosSelect', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerOpcionesSocios');
Route::post('socios/registroNuevoSocio', 'App\Http\Controllers\LogisticaIntegral\SociosController@registroNuevoSocio');
Route::post('socios/obtenerSociosEmpresas','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosEmpresas');
Route::post('socios/generarEnlaceSocioEmpresa','App\Http\Controllers\LogisticaIntegral\EmpresasController@generarEnlaceSocioEmpresa');
Route::get('socios/obtenerDetalldeSocio/{idSocio}','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerDetalldeSocio');
Route::get('socios/obtenerDetalleEnlaceSocioEmpresa/{idEnlace}','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerDetalleEnlaceSocioEmpresa');

Route::get('intermediarios/intermediariosSocios', 'App\Http\Controllers\LogisticaIntegral\IntermediariosController@obtenerIntermediariosSocios');

Route::get('empresas/obtenerEmpresasGenerales','App\Http\Controllers\LogisticaIntegral\EmpresasController@obtenerEmpresasGenerales');
Route::get('empresas/obtenerEmpresasSelect','App\Http\Controllers\LogisticaIntegral\EmpresasController@obtenerEmpresasSelect');