<?php

namespace App\Repositories\Auth;

use App\Models\TblUsuarios;
use Illuminate\Support\Facades\Log;

class LoginRepository
{
    
    public function validarExistenciaUsuario( $correo, $password ){
        $usuario = TblUsuarios::select('id')
                                ->where([
                                    ['correo',$correo],
                                    ['clave_decrypt',$password]
                                ]);
        return $usuario->get()[0]->id ?? null;
    }

    public function validarUsuarioActivo( $pkUsuario ){
        $usuario = TblUsuarios::where([
                                 ['id',$pkUsuario],
                                 ['activo',1]
                              ]);
        return $usuario->count() > 0;
    }

    public function obtenerDatosUsuarioPorID( $id ){
        $usuario = TblUsuarios::where('id', $id);

        return $usuario->get();
    }
}