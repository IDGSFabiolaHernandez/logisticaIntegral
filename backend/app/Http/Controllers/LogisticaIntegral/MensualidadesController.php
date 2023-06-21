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

    public function obtenerMensualidadesSelect(){
        try{
            return $this->mensualidadesService->obtenerMensualidadesSelect();
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

    public function obtenerMensualidadesEmpresa( Request $request ){
        try{
            return $this->mensualidadesService->obtenerMensualidadesEmpresa( $request->all() );
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
