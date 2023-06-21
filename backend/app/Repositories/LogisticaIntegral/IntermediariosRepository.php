<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblIntermediariosSocios;
use Carbon\Carbon;

class IntermediariosRepository
{
    public function obtenerIntermediariosSocios(){
        $intermediariosSocios = TblIntermediariosSocios::orderBy('nombreIntermediario','asc');

        return $intermediariosSocios->get();
    }

    public function validarIntermediarioExistente ( $datosIntermediario, $idIntermediario = 0 ) {
        $intermediario = TblIntermediariosSocios::where([
                                                      ['nombreIntermediario', 'like', $datosIntermediario['nombreIntermediario'].'%'],
                                                      ['id', '!=', $idIntermediario]
                                                  ]);

        return $intermediario->count();
    }

    public function registrarIntermediario ( $datosIntermediario, $idUsuario ) {
        $registro = new TblIntermediariosSocios;
        $registro->nombreIntermediario = $this->trimValidator($datosIntermediario['nombreIntermediario']);
        $registro->fkUsuarioAlta       = $idUsuario;
        $registro->activo              = 1;
        $registro->fechaAlta           = Carbon::now();
        $registro->save();
    }

    public function trimValidator ( $value ) {
		return $value != null && trim($value) != '' ? trim($value) : null;
	}
}