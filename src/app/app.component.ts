import { Component, ViewChild, ElementRef } from '@angular/core';
import { saveAs } from 'file-saver';
import * as docx from 'docx';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tinymce';
  htmlContent = '';

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    branding: false,
    promotion: false,
    statusbar: false,

    plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'prewiew', 'anchor', 'pagebreak',
      'searchplace', 'wordcount', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
      'table', 'emoticons', 'template', 'codesample', 'searchreplace', 'visualchars', 'colorpicker'
    ],

    toolbar: 'insertfile undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify |' +
      'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
      'forecolor backcolor emoticons',

    menubar: 'favs file edit view insert format tools table',
    content_style: 'body{padding-left :30px}'
  };


  @ViewChild('contentToConvert') contentToConvert!: ElementRef;


  //export as text.html
  export() {
    console.log(this.htmlContent);
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const anchor = document.createElement('a');
    anchor.download = 'myfile.html';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
    anchor.remove();
  }


  //export as text.docx
  exportdoc() {
    console.log(this.htmlContent);
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.htmlContent;
    const plainTextContent = tempElement.textContent || tempElement.innerText;
    const blob = new Blob([plainTextContent], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = 'myfile.doc';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
    anchor.remove();
  }


  //export htmlcode as pdfimage
  exporthtmlAsPDF() {
    const element = this.contentToConvert.nativeElement;
    const opt = {
      margin: 0.5,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  }


  //export htmlcode as word
  exportAsWord() {
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun(this.htmlContent)
            ]
          })
        ]
      }]
    });

    docx.Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'myfile.docx');
    });
  }

  //import file
  importFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      // Interpret binary data as text using UTF-8 encoding
      this.htmlContent = reader.result as string;
    };

    if (file) {
      if (file.name.endsWith('.docx') || file.name.endsWith('.xlsx')) {
        reader.readAsText(file);
      } else {
        console.error('Unsupported file format. Please select a .docx or .xlsx file.');
      }
    }
  }


}
