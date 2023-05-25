<?php

namespace App\Services\Auth;

use App\Repositories\Auth\LoginRepository;
use Illuminate\Support\Facades\Log;

class LoginService
{
    protected $loginRepository;

    public function __construct(
        LoginRepository $LoginRepository
    )
    {
        $this->loginRepository =$LoginRepository;
    }

    public function login( $credenciales ){
        $pkUsuario = $this->loginRepository->validarExistenciaUsuario( $credenciales['correo'], $credenciales['password'] );
        if(is_null($pkUsuario)){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer las credenciales no son correctas para poder ingresar',
                    'status' => 204
                ],
                200
            );
        }
        
        $usuarioActivo = $this->loginRepository->validarUsuarioActivo( $pkUsuario );

        if(is_null($usuarioActivo)){
            return response()->json(
                [
                    'mensaje' => 'Upss! Al parecer tu cuenta esta actualmente supendida',
                    'status' => 409
                ],
                200
            );
        }

        return response()->json(
            [
                'mensaje' => 'Bienvenido a Integración logística',
                'status' => 200
            ],
            200
        );
    }


}
