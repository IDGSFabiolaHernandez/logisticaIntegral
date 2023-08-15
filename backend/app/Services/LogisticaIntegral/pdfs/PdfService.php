<?php

namespace App\Services\LogisticaIntegral\pdfs;

use App\Repositories\LogisticaIntegral\pdfs\PdfRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PdfService
{
    protected $pdfRepository;

    public function __construct(
        PdfRepository $PdfRepository
    )
    {
        $this->pdfRepository = $PdfRepository;
    }

    public function generarPdfPagoMensualidad($idMensualidad){
        $generarPdf = $this->pdfRepository->generarPdfPagoMensualidad($idMensualidad);

        foreach ($generarPdf as $item) {
            $fecha = Carbon::parse($item->mensualidad)->locale('es')->isoFormat('MMM-YYYY ');
            $item->folio = "MSL-".$fecha.$item->contador;
            $item->folio = strtoupper(str_replace('.','',$item->folio));
            $item->mensualidad = Carbon::parse($item->mensualidad)->locale('es')->isoFormat('MMMM YYYY');
            $item->fechaPago = Carbon::parse($item->fechaPago)->locale('es')->isoFormat('dddd, D [de] MMMM [de] YYYY');
            $item->cantidadEscrita = $this->ntw($item->cantidad);
            $item->cantidad = number_format($item->cantidad,2);
        }

        return $generarPdf[0];
    }

    public function ntw($numero){
        if($numero == 0){
            return 'CERO';
        }
        
        $unidades = array('', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE', 'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE');
        $decenas = array('', '', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA');
        $centenas = array('', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS');

        $numero = (int)$numero;

        if ($numero < 20) {
            return $unidades[$numero];
        } elseif ($numero < 100) {
            return $decenas[floor($numero / 10)] . ($numero % 10 != 0 ? ' Y ' . $unidades[$numero % 10] : '');
        } elseif ($numero < 1000) {
            return $centenas[floor($numero / 100)] . ($numero % 100 != 0 ? ' ' . $this->ntw($numero % 100) : '');
        } elseif ($numero < 1000000) {
            return $this->ntw(floor($numero / 1000)) . ' MIL' . ($numero % 1000 != 0 ? ' ' . $this->ntw($numero % 1000) : '');
        }
    }
}
