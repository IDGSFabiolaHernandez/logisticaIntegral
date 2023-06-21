<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\PrestamosRepository;
use App\Repositories\LogisticaIntegral\SociosRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosService
{
    protected $sociosRepository;
    protected $usuariosRepository;
    protected $prestamosRepository;

    public function __construct(
        SociosRepository $SociosRepository,
        UsuariosRepository $UsuariosRepository,
        PrestamosRepository $PrestamosRepository
    )
    {
        $this->sociosRepository = $SociosRepository;
        $this->usuariosRepository = $UsuariosRepository;
        $this->prestamosRepository = $PrestamosRepository;
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

    public function registroNuevoSocio($datosSocio){
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocio['socio']);

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
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosSocio['token']);
            $this->sociosRepository->registroNuevoSocio($datosSocio['socio'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo Socio con éxito'      
            ],
            200
        );
    }

    public function obtenerSociosEmpresas($datosSociosEmpresas){
        $socio    = $datosSociosEmpresas['socios'] ?? null;
        $empresas = $datosSociosEmpresas['empresas'] ?? null;

        if ($datosSociosEmpresas['datosPrestamo']) {
            $idDetalle = $datosSociosEmpresas['socios'][0];
            $socio    = $this->sociosRepository->obtenerSocioPorIdPrestamo($idDetalle);
            $empresas = $this->sociosRepository->obtenerEmpresasPorIdPrestamo($idDetalle);
        }

        $sociosEmpresasAmbos = $this->sociosRepository->obtenerSociosEmpresas($socio, $empresas);
        return response()->json(
            [
                'mensaje' => 'Se consultarón los enlaces Socios-Empresas con éxito',
                'data' => $sociosEmpresasAmbos
            ]
        );
    }

    public function generarEnlaceSocioEmpresa($datosSocioEmpresa){
        $token = $datosSocioEmpresa['token'];
        $datosSocioEmpresa = $datosSocioEmpresa['enlace'];

        $enlaceExistente = $this->sociosRepository->validarEnlaceExistente($datosSocioEmpresa['fkSocio'], $datosSocioEmpresa['fkEmpresa']);

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
            $this->sociosRepository->registrarNuevoEnlaceSocioEmpresa($datosSocioEmpresa, $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo enlace con éxito'      
            ],
            200
        );
    }

    public function obtenerDetalleSocioPorId($idSocio){
        $detalleSocio = $this->sociosRepository->obtenerDetalleSocioPorId($idSocio);
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

    public function modificarSocio ( $datosSocio ) {
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocio['socioModificado'], $datosSocio['idSocio']);

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
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datosSocio['token']);
            $this->sociosRepository->modificarSocio($datosSocio['socioModificado'], $datosSocio['idSocio'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se modificó el Socio con éxito'
            ],
            200
        );
    }

    public function obtenerDetalleSocioEmpresaPorId($idSocioEmpresa){
        $detalleSocioEmpresa = $this->sociosRepository->obtenerDetalleSocioEmpresaPorId($idSocioEmpresa);
        return response()->json(
            [
                'mensaje' => 'Se consultó el detalle del enlace Socio-Empresa con éxito',
                'data' =>  $detalleSocioEmpresa
            ]
        );
    }

    public function modificarEnlaceSocioEmpresa ( $datosSocioEmpresa ) {
        $token    = $datosSocioEmpresa['token'];
        $idEnlace = $datosSocioEmpresa['idEnlace'];
        $datosSocioEmpresa = $datosSocioEmpresa['enlace'];

        $enlaceExistente = $this->sociosRepository->validarEnlaceExistente($datosSocioEmpresa['fkSocio'], $datosSocioEmpresa['fkEmpresa'], $idEnlace);

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
            $this->sociosRepository->modificarEnlaceSocioEmpresa($datosSocioEmpresa, $idEnlace);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se actualizó el enlace con éxito'
            ],
            200
        );
    }
}
