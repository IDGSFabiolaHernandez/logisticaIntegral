<?php

namespace App\Http\Controllers\LogisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\PrestamosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrestamosController extends Controller
{
    protected $prestamosService;
    public function __construct(
        PrestamosService $PrestamosService
    )
    {
        $this->prestamosService = $PrestamosService;
    }

    public function obtenerSociosConRelacionEmpresas(){
        try{
            return $this->prestamosService->obtenerSociosConRelacionEmpresas();
        } catch ( \Exception $error ){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerEmpresasSelectPorSocio($idSocio){
        try{
            return $this->prestamosService->obtenerEmpresasPorSocioSelect($idSocio);
        } catch ( \Exception $error ){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerSociosConPrestamos(){
        try{
            return $this->prestamosService->obtenerSociosConPrestamos();
        } catch ( \Exception $error ){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }

    public function obtenerPrestamosPorSociosYStatus( Request $request){
        try{
            return $this->prestamosService->obtenerPrestamosPorSociosYStatus($request->all());
        } catch ( \Exception $error ){
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error interno'
                ],
                500
            );
        }
    }
}
