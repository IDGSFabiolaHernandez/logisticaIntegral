<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblSesiones;

class UsuariosRepository
{
    public function obtenerInformacionUsuarioPorToken( $token ){
        $usuario = TblSesiones::select('usuarios.*', 'perfil.Perfil')
                              ->join('usuarios', 'usuarios.id', 'tblSesiones.FkTblUsuario')
                              ->join('perfil', 'perfil.id', 'usuarios.IdPerfil')
							  ->where('tblSesiones.Token', '=', $token);

        return $usuario->get();
    }
}