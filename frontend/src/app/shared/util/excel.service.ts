import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { writeFile } from 'xlsx';
import { utils } from 'xlsx';
import { MensajesService } from 'src/app/services/mensajes/mensajes.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})

export class ExcelService {
    constructor(
        private mensajes: MensajesService
    ) {
    }

    exportarExcel(data: any[], columns: { [key: string]: string }, fileName: string): void {
        const columnNames: string[] = Object.values(columns);
        const columnKeys: string[] = Object.keys(columns);
        const filteredData = data.map((item) => {
          const filteredItem : any = {};
          for (const key of columnKeys) {
            filteredItem[key] = item[key];
          }
          return filteredItem;
        });
        
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([columnNames], { skipHeader: true });
        XLSX.utils.sheet_add_json(worksheet, filteredData, { skipHeader: true, origin: 'A2', header: columnKeys });
        
        // Agregar filtros a las columnas
        const range: XLSX.Range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        range.s.r = 0; // Establecer el índice de la primera fila (encabezados)
        range.s.c = 0; // Establecer el índice de la primera columna
        range.e.r = 0; // Establecer el índice de la última fila (encabezados)
        range.e.c = columnKeys.length - 1; // Establecer el índice de la última columna
        
        worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
        
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        this.saveExcelFile(excelBuffer, fileName);
    }
      
    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        const url: string = window.URL.createObjectURL(data);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.xlsx`;
        link.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove();
        }, 100);
        this.mensajes.mensajeGenericoToast('Excel Generado', 'success');
    }     
}