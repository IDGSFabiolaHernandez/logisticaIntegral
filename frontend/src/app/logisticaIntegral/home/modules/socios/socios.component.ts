import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  
  protected datatableElement!: DataTableDirective;
  protected dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      columns: [
        {
          title : '#',
          data : 'id'
        }, {
          title : 'Socio',
          data : 'socio'
        }, {
          title : 'Status Socio',
          data : 'statusSocio'
        }, {
          title : 'Relación Empresas',
          data : 'relacionEmpresas'
        }, {
          title : 'CURP',
          data : 'curp'
        }, {
          title : 'RFC',
          data : 'rfc'
        }, {
          title : 'Intermediario',
          data : 'intermediario'
        }
      ],
      /*language: {
        url : "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      }*/
    };
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
