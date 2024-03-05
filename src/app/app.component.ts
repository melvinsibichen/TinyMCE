import { Component, ViewChild, ElementRef } from '@angular/core';
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
    content_style: 'body{font-family:Helvetica,Arial,sans-serif; font-size:16px}'
  };


  @ViewChild('contentToConvert') contentToConvert!: ElementRef;

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


  export() {
    console.log(this.htmlContent);
    const blob = new Blob([this.htmlContent], { type: 'text/html' });
    const anchor = document.createElement('a');
    anchor.download = 'exported_content.html';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
    anchor.remove();
  }

}
