<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\IntermediariosRepository;
use App\Repositories\LogisticaIntegral\UsuariosRepository;
use Illuminate\Support\Facades\DB;

class IntermediariosService
{
    protected $intermediariosRepository;
    protected $usuariosRepository;

    public function __construct(
        IntermediariosRepository $IntermediariosRepository,
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->intermediariosRepository = $IntermediariosRepository;
        $this->usuariosRepository = $UsuariosRepository;
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

    public function registrarIntermediario ( $datos ) {
        $validaIntermediario = $this->intermediariosRepository->validarIntermediarioExistente( $datos['intermediario'] );

        if( $validaIntermediario > 0 ){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer ya existe un Intermediario con el mismo nombre. Por favor validar la información',
                    'status' => 409
                ],
                200
            );
        }

        DB::beginTransaction();
            $usuario = $this->usuariosRepository->obtenerInformacionUsuarioPorToken($datos['token']);
            $this->intermediariosRepository->registrarIntermediario($datos['intermediario'], $usuario[0]->id);
        DB::commit();

        return response()->json(
            [
                'mensaje' => 'Se registró el nuevo Intermediario con éxito'      
            ],
            200
        );
    }
}