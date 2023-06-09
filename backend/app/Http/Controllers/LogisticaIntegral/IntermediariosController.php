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
        } catch (\Exception $error){
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
