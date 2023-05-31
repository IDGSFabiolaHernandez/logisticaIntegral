<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\IntermediariosRepository;

class IntermediariosService
{
    protected $intermediariosRepository;
    public function __construct(
        IntermediariosRepository $IntermediariosRepository
    )
    {
        $this->intermediariosRepository = $IntermediariosRepository;
    }

    public function obtenerIntermediariosSocios(){
        $intermediariosSocios = $this->intermediariosRepository->obtenerIntermediariosSocios();
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
                'data' => $intermediariosSocios
            ]
        );
    }
}
