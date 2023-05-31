<?php

namespace App\Http\Controllers\LogisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\EmpresasService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmpresasController extends Controller
{
    protected $empresasService;

    public function __construct(
        EmpresasService $EmpresasService
    )
    {
        $this->empresasService = $EmpresasService;
    }

    public function obtenerListasEmpresas(){
        try{
            return $this->empresasService->obtenerListasEmpresas();
        } catch (\Exception $error ){
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