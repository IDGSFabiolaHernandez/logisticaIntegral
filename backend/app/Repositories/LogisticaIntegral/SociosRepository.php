<?php

namespace App\Repositories\LogisticaIntegral;

use App\Models\TblSocios;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SociosRepository
{
    public function obtenerListaSocios($socios){
        $listaSocios = TblSocios::select(
                                    'tblSocios.id',
                                    'tblSocios.nombreSocio',
                                    'tblSocios.status',
                                    'tblIntermediariosSocios.nombreIntermediario',
                                )
                                ->selectRaw('COALESCE(ne.numEmpresas, 0) AS numEmpresas')
                                ->join('tblIntermediariosSocios', 'tblIntermediariosSocios.id', 'tblSocios.fkIntermediario')
                                ->leftJoin(DB::raw('(SELECT fkSocio, COUNT(*) AS numEmpresas FROM tblSociosEmpresas GROUP BY fkSocio) ne'), 'ne.fkSocio', '=', 'tblSocios.id')
                                ->whereIn('tblSocios.id', $socios);

        return $listaSocios->get();
    }
}