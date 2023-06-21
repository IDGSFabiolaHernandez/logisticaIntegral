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

    public function obtenerEmpresasGenerales(){
        $listaEmpresas = $this->empresasRepository->obtenerEmpresasGenerales();
        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $listaEmpresas
            ]
        );
    }

    public function obtenerEmpresasSelect(){
        $empresasGenerales = $this->empresasRepository->obtenerEmpresasGenerales();
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

    public function obtenerEmpresasMensualidadesSelect(){
        $empresasSelect = $this->empresasRepository->obtenerEmpresasMensualidadesSelect();
        $opcionesSelect = [];

        foreach($empresasSelect as $item){
            $temp = [
                'value' => $item->id,
                'label' => $item->nombreSocio,
                'checked' => false
            ];

            array_push($opcionesSelect,$temp);
        }

        return response()->json(
            [
                'mensaje' => 'Se consultaron las Empresas con éxito',
                'data' => $opcionesSelect
            ]
        );
    }
}
