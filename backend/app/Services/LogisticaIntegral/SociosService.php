<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\SociosRepository;

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

    public function obtenerSociosGenerales(){
        $sociosGenerales = $this->sociosRepository->obtenerSociosGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
                'data' => $sociosGenerales
            ]
        );
    }
}
