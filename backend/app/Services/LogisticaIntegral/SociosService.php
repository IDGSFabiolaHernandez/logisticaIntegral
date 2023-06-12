<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\SociosRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosService
{
    protected $sociosRepository;
    protected $usuariosRepository;

    public function __construct(
        SociosRepository $SociosRepository,
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->sociosRepository = $SociosRepository;
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function obtenerListaSocios($socios){
        $listaSocios = $this->sociosRepository->obtenerListaSocios($socios['socios']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $listaSocios
            ]
        );
    }
    
    public function obtenerSociosGenerales(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $sociosGenerales
            ]
        );
    }

    public function obtenerOpcionesSocios(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        $opcionesSelect = [];

        foreach( $sociosGenerales as $item ){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect, $temp);
        }
        
        return response()->json(
            [
                'mensaje' => 'Se consultaron los Socios con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function registroNuevoSocio($datosSocios){
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocios['socio']);

        if( $validarSocio > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Socio con el mismo (Nombre, CURP o RFC). Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosSocios['token']);
            $this->sociosRepository->registroNuevoSocio($datosSocios['socio'], $usuario->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo Socio con éxito'      
            ],
            200
        );
    }

    public function obtenerSociosEmpresas($datosSociosEmpresas){
        $sociosEmpresasAmbos = $this->sociosRepository->obtenerSociosEmpresas($datosSociosEmpresas['socios'] ?? null, $datosSociosEmpresas['empresas'] ?? null);
        return response()->json(
            [
                'mensaje' => 'Se consultarón los enlaces Socios-Empresas con éxito',
                'data' => $sociosEmpresasAmbos
            ]
        );
    }

    public function generarEnlaceSocioEmpresa($datosSociosEmpresas){
        $datosSociosEmpresas = $datosSociosEmpresas['enlace'];
        $token = $datosSociosEmpresas['token'];

        $enlaceExistente = $this->sociosRepository->validarEnlaceExistente($datosSociosEmpresas['fkSocio'], $datosSociosEmpresas['fkEmpresa']);

        if($enlaceExistente > 0){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un enlace de este Socio con la misma empresa. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($token);
            $this->sociosRepository->registrarNuevoEnlaceSocioEmpresa($datosSociosEmpresas, $usuario->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo Enlace con éxito'      
            ],
            200
        );
    }

    public function obtenerDetalldeSocio($idSocio){
        $detalleSocio = $this->sociosRepository->obtenerDetalldeSocio($idSocio);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle de Socio con éxito',
                'data' => $detalleSocio
            ]
        );
    }

    public function obtenerDetalleEnlaceSocioEmpresa($idEnlace){
        $detalleEnlaceSocioEmpresa = $this->sociosRepository->obtenerDetalleEnlaceSocioEmpresa($idEnlace);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle del enlace Socio-Empresa con éxito',
                'data' =>  $detalleEnlaceSocioEmpresa
            ]
        );
    }

    public function obtenerSociosMensualidadesSelect(){
        $mensualidadesSelect = $this->sociosRepository->obtenerSociosMensualidadesSelect();
        $opcionesSelect = [];

        foreach( $mensualidadesSelect as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las Mensualidades con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function obtenerDetalleSocioEmpresas($idSocioEmpresas){
        $detalleSocioEmpresas = $this->sociosRepository->obtenerDetalleSocioEmpresas($idSocioEmpresas);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle del Socio-Empresas con éxito',
                'data' =>  $detalleSocioEmpresas
            ]
        );
    }
}
