<?php

namespace App\Repositories\LogisticaIntegral\pdfs;

use App\Models\TblMensualidadesSocios;

class PdfRepository
{
    public function generarPdfPagoMensualidad($idMensualidad){
        $generarPdf = TblMensualidadesSocios::select(
                                                  'mensualidadesSocios.mensualidad',
                                                  'mensualidadesSocios.fechaPago',
                                                  'mensualidadesSocios.cantidad',
                                                  'empresas.nombre',
                                                  'tblSocios.nombreSocio'
                                                )
                                                ->selectRaw('(select count(ms.id) from mensualidadesSocios as ms where ms.mensualidad = mensualidadesSocios.mensualidad and ms.id <= mensualidadesSocios.id) as contador')
                                                ->join('empresas','empresas.id','mensualidadesSocios.idEmpresa')
                                                ->join('tblSocios','tblSocios.id','mensualidadesSocios.idSocio')
                                                ->where('mensualidadesSocios.id',$idMensualidad);
                                
        return $generarPdf->get();
    }
}
