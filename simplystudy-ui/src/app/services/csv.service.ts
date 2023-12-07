import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  public importCSV(csvString: string): Array<any> {
    const lines = csvString.split('\n');

    if (lines.length < 2) {
      throw new Error(
        'File is invalid. It should contain at least 2 lines. First line should be the header.',
      );
    }

    const headers = lines[0].split(',');
    const data: any[] = [];

    for (const line of lines) {
      const values = line.split(',');
      const object: any = {};

      if (values.length !== headers.length) {
        throw new Error('File is invalid on line: ' + line);
      }

      for (let j = 0; j < headers.length; j++) {
        let value: any = values[j].trim();

        value = value === '' ? (value = null) : value;

        object[headers[j].trim()] = value;
      }

      data.push(object);
    }

    return data;
  }
}
