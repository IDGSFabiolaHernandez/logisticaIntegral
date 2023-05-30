<?php

namespace App\Http\Controllers\LogisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\SociosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SociosController extends Controller
{
    protected $sociosService;

    public function __construct(
        SociosService $SociosService
    )
    {
        $this->sociosService = $SociosService;
    }

    public function obtenerListaSocios( Request $socios ){
        try{
            return $this->sociosService->obtenerListaSocios( $socios->all() );
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

    public function obtenerSociosGenerales( Request $request ){
        try{
            return $this->sociosService->obtenerSociosGenerales( $request->all() );
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

    public function obtenerOpcionesSocios( Request $request ){
        try{
            return $this->sociosService->obtenerOpcionesSocios( $request->all() );
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
