<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblIntermediariosSocios;

class IntermediariosRepository
{
    public function obtenerIntermediariosSocios(){
        $intermediariosSocios = TblIntermediariosSocios::orderBy('nombreIntermediario','asc');

        return $intermediariosSocios->get();
    }
}
