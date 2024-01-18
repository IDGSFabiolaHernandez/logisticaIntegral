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

    public function obtenerListaSociosPorBloque($bloque){
        try{
            return $this->sociosService->obtenerListaSociosPorBloque($bloque);
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

    public function obtenerRegistrosPorBloque(){
        try{
            return $this->sociosService->obtenerRegistrosPorBloque();
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

    public function obtenerSociosGenerales( Request $request ){
        try{
            return $this->sociosService->obtenerSociosGenerales( $request->all() );
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

    public function obtenerOpcionesSocios( Request $request ){
        try{
            return $this->sociosService->obtenerOpcionesSocios( $request->all() );
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

    public function registroNuevoSocio( Request $request ){
        try{
            return $this->sociosService->registroNuevoSocio( $request->all() );
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

    public function obtenerSociosEmpresas( Request $request ){
        try{
            return $this->sociosService->obtenerSociosEmpresas( $request->all() );
        }catch ( \Throwable $error ){
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
        }catch ( \Throwable $error ){
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

    public function obtenerDetalleSocioPorId($idSocio){
        try{
            return $this->sociosService->obtenerDetalleSocioPorId($idSocio);
        }catch( \Throwable $error ){
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

    public function obtenerDetalleSocioEspecial($idSocio){
        try{
            return $this->sociosService->obtenerDetalleSocioEspecial($idSocio);
        }catch( \Throwable $error ){
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
            return $this->sociosService->obtenerDetalleEnlaceSocioEmpresa($idEnlace);
        }catch( \Throwable $error ){
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

    public function modificarSocio( Request $request ){
        try{
            return $this->sociosService->modificarSocio( $request->all() );
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
    
    public function obtenerDetalleSocioEmpresaPorId($idSocioEmpresas){
        try{
            return $this->sociosService->obtenerDetalleSocioEmpresaPorId($idSocioEmpresas);
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

    public function modificarEnlaceSocioEmpresa( Request $request ){
        try{
            return $this->sociosService->modificarEnlaceSocioEmpresa( $request->all() );
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