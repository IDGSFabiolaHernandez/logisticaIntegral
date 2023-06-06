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

    public function registroNuevoSocio( Request $request ){
        try{
            return $this->sociosService->registroNuevoSocio( $request->all() );
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

    public function obtenerSociosEmpresas( Request $request ){
        try{
            return $this->sociosService->obtenerSociosEmpresas( $request->all() );
        }catch ( \Exception $error ){
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

    public function generarEnlaceSocioEmpresa(Request $request){
        try{
            return $this->sociosService->generarEnlaceSocioEmpresa( $request->all() );
        }catch ( \Exception $error ){
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

    public function obtenerDetalldeSocio($idSocio){
        try{
            return $this->sociosService->obtenerDetalldeSocio($idSocio);
        }catch( \Exception $error ){
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

    public function obtenerDetalleEnlaceSocioEmpresa($idEnlace){
        try{
            return $this->sociosService->obtenerDetalldeSocio($idEnlace);
        }catch( \Exception $error ){
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

    public function obtenerSociosMensualidadesSelect( Request $request ){
        try{
            return $this->sociosService->obtenerSociosMensualidadesSelect( $request->all() );
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

    public function obtenerDetalleSocioEmpresas($idSocioEmpresas){
        try{
            return $this->sociosService->obtenerDetalleSocioEmpresas($idSocioEmpresas);
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