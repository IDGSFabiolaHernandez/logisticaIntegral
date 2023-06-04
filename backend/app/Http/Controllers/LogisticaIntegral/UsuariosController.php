<?php

namespace App\Http\Controllers\LogisticaIntegral;

use App\Http\Controllers\Controller;
use App\Services\LogisticaIntegral\UsuariosService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsuariosController extends Controller
{
    protected $usuariosService;

    public function __construct(
        UsuariosService $UsuariosService
    )
    {
        $this->usuariosService = $UsuariosService;    
    }

    public function obtenerInformacionUsuarioPorToken( Request $request ){
        try{
            return $this->usuariosService->obtenerInformacionUsuarioPorToken( $request->all() );
        } catch( \Exception $error ) {
            Log::alert($error);
            return response()->json(
                [
                    'error' => $error,
                    'mensaje' => 'Ocurrió un error al consultar' 
                ], 
                500
            );
        }
    }
}
