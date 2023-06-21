<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', 'App\Http\Controllers\Auth\LoginController@login');
Route::post('/auth', 'App\Http\Controllers\Auth\LoginController@auth');
Route::post('/logout', 'App\Http\Controllers\Auth\LoginController@logout');

Route::post('/usuarios/obtenerInformacionUsuarioPorToken', 'App\Http\Controllers\LogisticaIntegral\UsuariosController@obtenerInformacionUsuarioPorToken');
Route::post('/usuarios/modificarUsuario', 'App\Http\Controllers\LogisticaIntegral\UsuariosController@modificarUsuario');
Route::post('/usuarios/validarContraseniaActual', 'App\Http\Controllers\LogisticaIntegral\UsuariosController@validarContraseniaActual');

Route::post('/socios/listaSocios', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerListaSocios');
Route::get('/socios/obtenerSociosGenerales', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosGenerales');
Route::get('/socios/obtenerSociosSelect', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerOpcionesSocios');
Route::post('/socios/registroNuevoSocio', 'App\Http\Controllers\LogisticaIntegral\SociosController@registroNuevoSocio');
Route::post('/socios/obtenerSociosEmpresas','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosEmpresas');
Route::post('/socios/generarEnlaceSocioEmpresa','App\Http\Controllers\LogisticaIntegral\SociosController@generarEnlaceSocioEmpresa');
Route::get('/socios/obtenerDetalleSocioPorId/{idSocio}','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerDetalleSocioPorId');
Route::get('/socios/obtenerDetalleEnlaceSocioEmpresa/{idEnlace}','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerDetalleEnlaceSocioEmpresa');
Route::get('/socios/obtenerSociosMensualidadesSelect', 'App\Http\Controllers\LogisticaIntegral\SociosController@obtenerSociosMensualidadesSelect');
Route::post('/socios/modificarSocio','App\Http\Controllers\LogisticaIntegral\SociosController@modificarSocio');
Route::get('/socios/obtenerDetalleSocioEmpresaPorId/{idSocioEmpresa}','App\Http\Controllers\LogisticaIntegral\SociosController@obtenerDetalleSocioEmpresaPorId');
Route::post('/socios/modificarEnlaceSocioEmpresa','App\Http\Controllers\LogisticaIntegral\SociosController@modificarEnlaceSocioEmpresa');

Route::get('/intermediarios/intermediariosSocios', 'App\Http\Controllers\LogisticaIntegral\IntermediariosController@obtenerIntermediariosSocios');
Route::post('/intermediarios/registrarIntermediario', 'App\Http\Controllers\LogisticaIntegral\IntermediariosController@registrarIntermediario');

Route::get('/empresas/obtenerEmpresasGenerales','App\Http\Controllers\LogisticaIntegral\EmpresasController@obtenerEmpresasGenerales');
Route::get('/empresas/obtenerEmpresasSelect','App\Http\Controllers\LogisticaIntegral\EmpresasController@obtenerEmpresasSelect');
Route::get('/empresas/obtenerEmpresasMensualidadesSelect','App\Http\Controllers\LogisticaIntegral\EmpresasController@obtenerEmpresasMensualidadesSelect');
Route::post('/empresas/registrarEmpresa','App\Http\Controllers\LogisticaIntegral\EmpresasController@registrarEmpresa');

Route::get('/mensualidades/obtenerMensualidadesPagadasSelect','App\Http\Controllers\LogisticaIntegral\MensualidadesController@obtenerMensualidadesPagadasSelect');
Route::post('/mensualidades/obtenerMensualidadesPagadasEmpresaSocios','App\Http\Controllers\LogisticaIntegral\MensualidadesController@obtenerMensualidadesPagadasEmpresaSocios');
Route::get('/mensualidades/obtenerMensualidadesPagarSelect','App\Http\Controllers\LogisticaIntegral\MensualidadesController@obtenerMensualidadesPagarSelect');
Route::post('/mensualidades/obtenerMensualidadesPagarPorMensualidad','App\Http\Controllers\LogisticaIntegral\MensualidadesController@obtenerMensualidadesPagarPorMensualidad');
Route::post('/mensualidades/pagarMensualidadEmpresaSocio','App\Http\Controllers\LogisticaIntegral\MensualidadesController@pagarMensualidadEmpresaSocio');

Route::get('/prestamos/obtenerSociosConRelacionEmpresas','App\Http\Controllers\LogisticaIntegral\PrestamosController@obtenerSociosConRelacionEmpresas');
Route::get('/prestamos/obtenerEmpresasSelectPorSocio/{idSocio}','App\Http\Controllers\LogisticaIntegral\PrestamosController@obtenerEmpresasSelectPorSocio');
Route::get('/prestamos/obtenerSociosConPrestamos','App\Http\Controllers\LogisticaIntegral\PrestamosController@obtenerSociosConPrestamos');
Route::post('/prestamos/obtenerPrestamosPorSociosYStatus','App\Http\Controllers\LogisticaIntegral\PrestamosController@obtenerPrestamosPorSociosYStatus');
Route::post('/prestamos/registroNuevoPrestamoSocio','App\Http\Controllers\LogisticaIntegral\PrestamosController@registroNuevoPrestamoSocio');
