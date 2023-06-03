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

    public function obtenerMensualidadesSelect () {
        $ultimoMes      = $this->mensualidadesRepository->obtenerMesMensualidades('ultimo');
        $recienteMes    = $this->mensualidadesRepository->obtenerMesMensualidades('reciente');

        if ( is_null($ultimoMes) ) {
            return response()->json(
                [
                    'mensaje' => 'No hay meses por mostrar',
                    'data' => []
                ]
            );
        }

        $mesesSelect    = $this->mensualidadesRepository->obtenerMesesPosterioresAUltimoMes($ultimoMes, $recienteMes);
        $opcionesSelect = [];

        foreach( $mesesSelect as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades con éxito',
                'data' => $opcionesSelect
            ]
        );
    }

    public function obtenerMensualidadesEmpresa($datosConsulta){
        $mensualidades = $this->mensualidadesRepository->obtenerMensualidadesEmpresa($datosConsulta['socios'] ?? null, $datosConsulta['empresas'] ?? null, $datosConsulta['mensualidades']);
        return response()->json(
            [
                'mensaje' => 'Se consultaron las mensualidades con éxito',
                'data' => $mensualidades
            ]
        );
    }
}
