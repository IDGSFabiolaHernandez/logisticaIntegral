<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\EmpresasRepository;
use Illuminate\Support\Facades\Log;

class EmpresasService
{
    protected $empresasRepository;
    public function __construct(
        EmpresasRepository $EmpresasRepository
    )
    {
        $this->empresasRepository = $EmpresasRepository;
    }

    public function empresasGenerales(){
        $listaEmpresas = $this->empresasRepository->empresasGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $listaEmpresas
            ]
        );
    }

    public function obtenerEmpresasSelect(){
        $empresasGenerales = $this->empresasRepository->empresasGenerales();
        $opcionesSelect = [];

        foreach( $empresasGenerales as $item ){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombre,
                'checked' => false
            ];

            array_push($opcionesSelect, $temp);
        }
        
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $opcionesSelect
            ]
        );
    }
}
