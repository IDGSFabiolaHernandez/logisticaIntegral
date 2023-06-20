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

    public function obtenerEmpresasGenerales(){
        try{
            return $this->empresasService->obtenerEmpresasGenerales();
        } catch (\Throwable $error ){
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

    public function obtenerEmpresasSelect( Request $request ){
        try{
            return $this->empresasService->obtenerEmpresasSelect( $request->all() );
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

    public function obtenerEmpresasMensualidadesSelect(){
        try{
            return $this->empresasService->obtenerEmpresasMensualidadesSelect();
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
