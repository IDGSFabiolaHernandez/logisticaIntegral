<?php

namespace App\Http\Controllers\logisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\IntermediariosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IntermediariosController extends Controller
{
    protected $intermediariosService;

    public function __construct(
        IntermediariosService $intermediariosService
    )
    {
        $this->intermediariosService = $intermediariosService;
    }

    public function obtenerIntermediariosSocios(){
        try{
            return $this->intermediariosService->obtenerIntermediariosSocios();
        } catch (\Throwable $error){
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

    public function registrarIntermediario( Request $request ){
        try{
            return $this->intermediariosService->registrarIntermediario( $request->all() );
        } catch (\Throwable $error){
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