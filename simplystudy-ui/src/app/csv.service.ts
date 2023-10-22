import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  public importCSV(csvString: string): Array<any> {
    const lines = csvString.split('\n');

    if (lines.length < 2) {
      throw new Error("CSV data is not valid. It should have at least a header and one data row.");
    }

    const headers = lines[0].split(',');
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      let object: any = {};

      if (values.length !== headers.length) {
        throw new Error(`CSV data is not valid on line ${i + 1}. The number of columns doesn't match the header.`);
      }

      for (let j = 0; j < headers.length; j++) {
        let value: any = values[j].trim();

        if (value === '') {
          value = null;
        }

        object[headers[j].trim()] = value;
      }

      data.push(object);
    }

    return data;
  }
}
