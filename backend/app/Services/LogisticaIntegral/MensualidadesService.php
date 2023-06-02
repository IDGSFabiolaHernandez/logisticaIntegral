<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\MensualidadesRepository;
use Illuminate\Support\Facades\Log;

class MensualidadesService
{
    protected $mensualidadesRepository;
    public function __construct(
        MensualidadesRepository $MensualidadesRepository
    )
    {
        $this->mensualidadesRepository = $MensualidadesRepository;
    }

    public function obtenerMensualidadesEmpresa($datosMensualidades){
        $mensualidadesEmpresa = $this->mensualidadesRepository->obtenerMensualidadesEmpresa($datosMensualidades['socios'],$datosMensualidades['mensualidades']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Mensualidades con éxito',
                'data' => $mensualidadesEmpresa
            ]
        );
    }
}
