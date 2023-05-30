<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\SociosRepository;
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
                'checked' => true
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
}
