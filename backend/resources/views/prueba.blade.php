<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pago Mensualidad</title>

    <style>
        * {
            margin: 0px !important;
            padding: 0px !important;
            font-family: "Nunito", sans-serif !important;
        }

        .container {
            margin-top: 35px !important;
            margin-left: 50px !important;
            margin-right: 50px !important;
            margin-bottom: 40px !important;
        }

        .h1 {
            font-size: 16px !important;
            margin-bottom: 0 !important;
            color: #012970 !important;
        }

        .h2 {
            font-size: 14px !important;
            margin-bottom: 0 !important;
            color: black !important;
        }

        .alginRight { text-align: right !important; }
        .alginCenter { text-align: center !important; }

        .firmaStyle {
            margin-top: 40px !important;
            color: black !important;
        }

        [class*="col-"] {
            float: left !important;
        }

        .mrg-10 {
            margin-top: -10px !important;
        }

        .mrg-20 {
            margin-top: -20px !important;
        }

        .col-1 {width: 8.33% !important;}
        .col-2 {width: 16.66% !important;}
        .col-3 {width: 25% !important;}
        .col-4 {width: 33.33% !important;}
        .col-5 {width: 41.66% !important;}
        .col-6 {width: 50% !important;}
        .col-7 {width: 58.33% !important;}
        .col-8 {width: 66.66% !important;}
        .col-9 {width: 75% !important;}
        .col-10 {width: 83.33% !important;}
        .col-11 {width: 91.66% !important;}
        .col-12 {width: 100% !important;}

        .tittleRecibo {
            background-color: #EDF5FF !important;
            border-radius: 3px !important;
        }

        .hrsp-gray {
            color: gray !important;
            background-color: gray !important;
            font-weight: bold !important;
        }

        .hrsp-black {
            color: black !important;
            background-color: black !important;
            font-weight: bold;
        }
    </style>
</head>
<body class="container">
    <!--Header-->
    <div class="col-6">
        <b class="h1 tittleRecibo">RECIBO DE DINERO</b>
    </div>

    <div class="col-6 alginRight">
        <b class="h2">FOLIO:</b> <span class="h2">MSL-JUL-2023 80</span>
    </div>

    <!--Fecha pago-->
    <br><br>
    <div class="col-12 alginRight">
        <b class="h2">FECHA:</b> <span class="h2">jueves, 10 de agosto de 2023</span>
    </div>

    <!--Cantidad pago-->
    <br><br>
    <div class="col-12 mrg-20">
        <b class="h2">BUENO POR:</b> <span class="h2">$5,000.00</span>
    </div>

    <br>
    <div class="col-12 alginCenter mrg-10">
        <b class="h2">CINCO MIL 00/100 MN</b></span>
    </div>

    <!--Detalle Pago-->
    <br>
    <div class="col-2 alginRight">
        <b class="h2">EMPRESA:&nbsp;&nbsp;</b><br>
        <b class="h2">RL:&nbsp;&nbsp;</b>
    </div>
    <div class="col-9">
        <span class="h2">MEGA PROYECTOS</span>
        <hr class="hrsp-gray">
        <span class="h2">GREGORIO JARRA CUATE</span>
        <hr class="hrsp-gray">
    </div>

    <!--Socio-->
    <br><br><br>
    <div class="col-2">&nbsp;</div>
    <div class="col-8 alginCenter">
        <h3 class="h1">GREGORIO JARRA CUATE</h3>
        <h3 class="h2">AGOSTO 2023</h3>
        <br><br>
        <hr class="hrsp-black">
        <br>
        <h3 class="h2 mrg-10"><b>RECIBIÓ (NOMBRE Y FIRMA)</b></h3>
    </div>
    <div class="col-2 alginCenter">
        <br><br><br>
        <h3 class="h2"><b>ENTREGÓ</b></h3>
        <span class="h2">ROSARIO</span>
    </div>
</body>
</html>