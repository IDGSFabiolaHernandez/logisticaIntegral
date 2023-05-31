<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\SociosRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosService
{
    protected $sociosRepository;

    public function __construct(
        SociosRepository $SociosRepository
    )
    {
        $this->sociosRepository = $SociosRepository;
    }

    public function obtenerListaSocios($socios){
        $listaSocios = $this->sociosRepository->obtenerListaSocios($socios['socios']);
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
                'data' => $listaSocios
            ]
        );
    }
    //revisar
    public function obtenerSociosGenerales(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
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
                'mensaje' => 'Se consultó con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function registroNuevoSocio($datosSocios){
        $validarSocio = $this->sociosRepository->validarSocioExistente($datosSocios);

        if($validarSocio > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Socio con el mismo (Nombre, CURP o RFC). Por favor de validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $this->sociosRepository->registroNuevoSocio($datosSocios);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registro el Socio con éxito'      
            ],
            200
        );
    }

    public function obtenerSociosEmpresas($datosSociosEmpresas){
        $sociosEmpresasAmbos = $this->sociosRepository->obtenerSociosEmpresas($datosSociosEmpresas['socios'] ?? null, $datosSociosEmpresas['empresas'] ?? null);
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
                'data' => $sociosEmpresasAmbos
            ]
        );
    }
}
