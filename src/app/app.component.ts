import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import * as pako from 'pako'; // Thư viện pako để nén nội dung

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule]
})
export class AppComponent {
  imageLeftUrl: string | null = null;
  imageRightUrl: string | null = null;
  comparisonResult: string = '';

  onFileSelected(event: any, side: string) {
    const file = event.target.files[0];

    if (file && file.name.endsWith('.puml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.generateImageFromPUML(result, side);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid .puml file.');
    }
  }

  generateImageFromPUML(pumlContent: string, side: string) {
    const imageUrl = this.getPlantUMLImageUrl(pumlContent);
    console.log('Generated Image URL:', imageUrl);
    if (side === 'left') {
      this.imageLeftUrl = imageUrl;
    } else if (side === 'right') {
      this.imageRightUrl = imageUrl;
    }
  }

  getPlantUMLImageUrl(pumlContent: string): string {
    // Nén nội dung bằng Deflate và mã hóa theo chuẩn PlantUML
    console.log(pumlContent)
    const compressed = pako.deflate(unescape(encodeURIComponent(pumlContent)), { level: 9 });
    const encoded = this.encode64(compressed);
    return `https://www.plantuml.com/plantuml/png/${encoded}`;
  }

  // Mã hóa Base64 đặc biệt của PlantUML
  encode64(data: Uint8Array): string {
    let r = '';
    let i = 0;
    while (i < data.length) {
      if (i + 2 === data.length) {
        r += this.append3bytes(data[i], data[i + 1], 0);
      } else if (i + 1 === data.length) {
        r += this.append3bytes(data[i], 0, 0);
      } else {
        r += this.append3bytes(data[i], data[i + 1], data[i + 2]);
      }
      i += 3;
    }
    return r;
  }

  append3bytes(b1: number, b2: number, b3: number): string {
    const c1 = b1 >> 2;
    const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
    const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
    const c4 = b3 & 0x3F;
    return (
      this.encode6bit(c1 & 0x3F) +
      this.encode6bit(c2 & 0x3F) +
      this.encode6bit(c3 & 0x3F) +
      this.encode6bit(c4 & 0x3F)
    );
  }

  encode6bit(b: number): string {
    if (b < 10) {
      return String.fromCharCode(48 + b);
    }
    b -= 10;
    if (b < 26) {
      return String.fromCharCode(65 + b);
    }
    b -= 26;
    if (b < 26) {
      return String.fromCharCode(97 + b);
    }
    b -= 26;
    if (b === 0) {
      return '-';
    }
    if (b === 1) {
      return '_';
    }
    return '?';
  }

  compareImages() {
    if (this.imageLeftUrl && this.imageRightUrl) {
      this.comparisonResult = 'Images compared successfully!';
    } else {
      this.comparisonResult = 'Please upload both images before comparing.';
    }
  }
}
