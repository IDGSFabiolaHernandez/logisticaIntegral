<?php

namespace App\Services\LogisticaIntegral;

use App\Repositories\LogisticaIntegral\UsuariosRepository;

class UsuariosService
{
    protected $usuariosRepository;

    public function __construct(
        UsuariosRepository $UsuariosRepository
    )
    {
        $this->usuariosRepository = $UsuariosRepository;
    }

    public function obtenerInformacionUsuarioPorToken( $token ){
        return $this->usuariosRepository->obtenerInformacionUsuarioPorToken( $token['token'] );
    }
}
