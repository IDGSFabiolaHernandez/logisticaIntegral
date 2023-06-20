<?php

namespace App\Http\Controllers\LogisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\MensualidadesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MensualidadesController extends Controller
{
    protected $mensualidadesService;

    public function __construct(
        MensualidadesService $MensualidadesService
    )
    {
        $this->mensualidadesService = $MensualidadesService;
    }

    public function obtenerMensualidadesPagadasSelect(){
        try{
            return $this->mensualidadesService->obtenerMensualidadesPagadasSelect();
        } catch ( \Throwable $error ){
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

    public function obtenerMensualidadesPagadasEmpresaSocios( Request $request ){
        try{
            return $this->mensualidadesService->obtenerMensualidadesPagadasEmpresaSocios( $request->all() );
        } catch ( \Throwable $error ){
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

    public function obtenerMensualidadesPagarSelect () {
        try{
            return $this->mensualidadesService->obtenerMensualidadesPagarSelect();
        } catch ( \Throwable $error ){
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

    public function obtenerMensualidadesPagarPorMensualidad ( Request $request ) {
        try{
            return $this->mensualidadesService->obtenerMensualidadesPagarPorMensualidad( $request->all() );
        } catch ( \Throwable $error ){
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

    public function pagarMensualidadEmpresaSocio( Request $request){
        try{
            return $this->mensualidadesService->pagarMensualidadEmpresaSocio( $request->all() );
        } catch ( \Throwable $error ){
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
