<?php

namespace App\Http\Controllers\LogisticaIntegral\pdfs;

use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PagoMensualidadController extends Controller
{
    public function generarPdf(){
        $contenido = view('prueba')->render();

        $pdf = new Dompdf();
        $pdf->loadHtml($contenido);
        $pdf->setPaper('A4');
        $pdf->render();

        /*$salida = $pdf->output();
        $path = storage_path('pagoMensualidad.pdf');
        file_put_contents($path,$salida);

        return response()->json(
            [
                'mensaje' => 'Se generó el PDF'
            ],
            200
        );*/

        return $pdf->stream('pagoMensualidad.pdf');
    }
}
