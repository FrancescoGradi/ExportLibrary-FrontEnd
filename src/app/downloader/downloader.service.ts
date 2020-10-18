import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor() { }

  public downloadFile(doc, selectedTemplate, toBeZipped) {
    const blob = this.b64toBlob(doc, 'application/octet-stream');
    const url = window.URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    if(toBeZipped) {
      anchor.download = selectedTemplate + '.zip';
    }
    else {
      anchor.download = selectedTemplate;
    }
    anchor.href = url;
    anchor.click();
  }

  public b64toBlob(b64Data, contentType, sliceSize=512) {

    const byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
