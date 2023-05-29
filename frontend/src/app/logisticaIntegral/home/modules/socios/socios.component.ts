import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';
import Option from '../../../../shared/interfaces/options.interface';
import { SociosService } from 'src/app/logisticaIntegral/services/socios/socios.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})

export class SociosComponent implements OnInit, AfterViewInit {
	@ViewChild(DataTableDirective, {static: false})
	
	protected datatableElement!: DataTableDirective;
	protected dtOptions: DataTables.Settings = {};
	protected dtTrigger: Subject<any> = new Subject<any>();

	//{ value: 'option1', label: 'Opción 1', checked: true },
	protected opcionesSocios : Option[] = [
		{ value: '1', label: 'Opción 1', checked: true },
		{ value: '2', label: 'Opción 1', checked: true }
	];
	private sociosSeleccionados : any[] = [];
	protected listaSocios : any[] = [];

	private columnasTabla = [
		{title : '#', data : 'id'},
		{title : 'Socio', data : 'nombreSocio'},
		{title : 'Status Socio', data : 'status'},
		{title : 'Relación Empresas', data : 'curpSocio'},
		{title : 'CURP', data : 'rfcSocio'},
		{title : 'RFC', data : 'nombreIntermediario'},
		{title : 'Intermediario', data : 'numEmpresas'}
	];

	constructor (
		private mensajes : MensajesService,
		private apiSocios : SociosService
	) {

	}

	ngOnInit(): void {
		this.tableStart();
	}

	private tableStart () {
		this.dtOptions = {
			/*language: {
				url : "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
			}*/
		};
	}

	onSelectionChange(selectedOptions: Option[]) {
		this.sociosSeleccionados = selectedOptions;
	}

	consultarSociosPorSelect () : void {
		this.mensajes.mensajeEsperar();

		if ( this.sociosSeleccionados.length == 0 ) {
			this.mensajes.mensajeGenerico('Para continuar antes debe seleccionar al menos un Socio', 'info');
			return;
		}

		const arregloSocios = { socios : this.sociosSeleccionados.map(({value}) => value) };

		this.apiSocios.obtenerListaSocios(arregloSocios).subscribe(
			respuesta => {
				this.listaSocios = respuesta.data;
				this.mensajes.mensajeGenericoToast(respuesta.mensaje, 'success');
			}, error => {
				this.mensajes.mensajeGenerico('error', 'error');
			}
		);
	}

	ngAfterViewInit(): void {
		this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.columns().every(function () {
				const that: any = this;
				const inputElement = $('input', this.footer())[0] as HTMLInputElement;
				$(inputElement).on('keyup change', function () {
					if (that.search() !== inputElement.value) {
						that.search(inputElement.value).draw();
					}
				});
			});
		});
	}
}