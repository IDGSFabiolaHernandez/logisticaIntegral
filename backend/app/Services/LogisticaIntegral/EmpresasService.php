<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\EmpresasRepository;

class EmpresasService
{
    protected $empresasRepository;
    public function __construct(
        EmpresasRepository $EmpresasRepository
    )
    {
        $this->empresasRepository = $EmpresasRepository;
    }

    public function obtenerListasEmpresas(){
        $listaEmpresas = $this->empresasRepository->obtenerListasEmpresas();
        return response()->json(
            [
                'mensaje' => 'Se consultó con éxito',
                'data' => $listaEmpresas
            ]
        );
    }
}
