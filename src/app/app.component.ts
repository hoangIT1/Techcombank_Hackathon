// // import { Component } from '@angular/core';
// // import { FormsModule } from '@angular/forms'; // Import FormsModule
// // import { CommonModule } from '@angular/common';
// // import * as plantumlEncoder from 'plantuml-encoder'; // Sử dụng plantuml-encoder

// // @Component({
// //   selector: 'app-root',
// //   standalone: true,
// //   templateUrl: './app.component.html',
// //   styleUrls: ['./app.component.css'],
// //   imports: [FormsModule, CommonModule]
// // })
// // export class AppComponent {
// //   imageLeftUrl: string | null = null;
// //   imageRightUrl: string | null = null;
// //   comparisonResult: string = '';

// //   // Properties to track zoom states for both images
// //   isZoomedInLeft = false;
// //   isZoomedInRight = false;

// //   // Toggle zoom in/out on image click
// //   toggleZoom(side: string) {
// //     if (side === 'left') {
// //       this.isZoomedInLeft = !this.isZoomedInLeft;
// //     } else if (side === 'right') {
// //       this.isZoomedInRight = !this.isZoomedInRight;
// //     }
// //   }

// //   onFileSelected(event: any, side: string) {
// //     const file = event.target.files[0];

// //     if (file && file.name.endsWith('.puml')) {
// //       const reader = new FileReader();
// //       reader.onload = (e) => {
// //         const result = e.target?.result as string;
// //         this.generateImageFromPUML(result, side);
// //       };
// //       reader.readAsText(file);
// //     } else {
// //       alert('Please upload a valid .puml file.');
// //     }
// //   }

// //   generateImageFromPUML(pumlContent: string, side: string) {
// //     const imageUrl = this.getPlantUMLImageUrl(pumlContent);
// //     console.log('Generated Image URL:', imageUrl);
// //     if (side === 'left') {
// //       this.imageLeftUrl = imageUrl;
// //       console.log(this.imageLeftUrl);
// //     } else if (side === 'right') {
// //       this.imageRightUrl = imageUrl;
// //     }
// //   }

// //   getPlantUMLImageUrl(pumlContent: string): string {
// //     console.log(pumlContent);
// //     // Sử dụng plantuml-encoder để mã hóa
// //     const encoded = plantumlEncoder.encode(pumlContent);
// //     return `https://www.plantuml.com/plantuml/png/${encoded}`;
// //   }

// //   compareImages() {
// //     if (this.imageLeftUrl && this.imageRightUrl) {
// //       this.comparisonResult = 'Images compared successfully!';
// //     } else {
// //       this.comparisonResult = 'Please upload both images before comparing.';
// //     }
// //   }
// // }


import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as plantumlEncoder from 'plantuml-encoder';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, CommonModule]
})
export class AppComponent {
  imageLeftUrl: string | null = null;
  imageRightUrl: string | null = null;
  comparisonResult: string = '';
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private initialTranslateX = 0;
  private initialTranslateY = 0;
  private scale = 1;

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
    if (side === 'left') {
      this.imageLeftUrl = imageUrl;
    } else if (side === 'right') {
      this.imageRightUrl = imageUrl;
    }
  }

  getPlantUMLImageUrl(pumlContent: string): string {
    const encoded = plantumlEncoder.encode(pumlContent);
    return `https://www.plantuml.com/plantuml/png/${encoded}`;
  }

  compareImages() {
    if (this.imageLeftUrl && this.imageRightUrl) {
      this.comparisonResult = 'Images compared successfully!';
    } else {
      this.comparisonResult = 'Please upload both images before comparing.';
    }
  }

  onZoom(event: WheelEvent, container: HTMLElement) {
    event.preventDefault();
    const scaleAmount = 0.1;
    this.scale += event.deltaY < 0 ? scaleAmount : -scaleAmount;
    this.scale = Math.min(Math.max(this.scale, 0.5), 3); // Limits zoom levels
    container.style.transform = `scale(${this.scale})`;
  }

  onDragStart(event: MouseEvent, container: HTMLElement) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    const computedStyle = window.getComputedStyle(container);
    const matrix = new DOMMatrixReadOnly(computedStyle.transform);
    this.initialTranslateX = matrix.m41;
    this.initialTranslateY = matrix.m42;
  }

  onDrag(event: MouseEvent, container: HTMLElement) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;
    container.style.transform = `translate(${this.initialTranslateX + dx}px, ${this.initialTranslateY + dy}px) scale(${this.scale})`;
  }

  onDragEnd() {
    this.isDragging = false;
  }
}

// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import * as plantumlEncoder from 'plantuml-encoder';
// import { ApiService } from './app.callAPI'; // Giả định bạn đã có ApiService

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
//   imports: [FormsModule, CommonModule]
// })
// export class AppComponent {
//   imageLeftUrl: string | null = null;
//   imageRightUrl: string | null = null;
//   comparisonResult: string = '';
//   private isDragging = false;
//   private startX = 0;
//   private startY = 0;
//   private initialTranslateX = 0;
//   private initialTranslateY = 0;
//   private scale = 1;

//   constructor(private apiService: ApiService) {}

//   onFileSelected(event: any, side: string) {
//     const file = event.target.files[0];
//     if (file && file.name.endsWith('.puml')) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         this.generateImageFromPUML(result, side);
//       };
//       reader.readAsText(file);
//     } else {
//       alert('Please upload a valid .puml file.');
//     }
//   }

//   generateImageFromPUML(pumlContent: string, side: string) {
//     const imageUrl = this.getPlantUMLImageUrl(pumlContent);
//     if (side === 'left') {
//       this.imageLeftUrl = imageUrl;
//     } else if (side === 'right') {
//       this.imageRightUrl = imageUrl;
//     }
//   }

//   getPlantUMLImageUrl(pumlContent: string): string {
//     const encoded = plantumlEncoder.encode(pumlContent);
//     return `https://www.plantuml.com/plantuml/png/${encoded}`;
//   }

//   // Tích hợp API vào nút Compare
//   compareImages() {
//     if (this.imageLeftUrl && this.imageRightUrl) {
//       // Gọi API để thực hiện so sánh
//       const requestBody = {
//         system: 'You are Claude, an AI assistant created by Anthropic...',
//         anthropic_version: 'bedrock-2023-05-31',
//         max_tokens: 1024,
//         messages: [
//           {
//             role: 'user',
//             content: [
//               {
//                 type: 'text',
//                 text: 'Compare two images.'
//               }
//             ]
//           }
//         ]
//       };

//       // Gọi API và cập nhật kết quả vào textarea
//       this.apiService.invokeAPI(requestBody).subscribe(
//         (response: any) => {
//           const textResponse = response.content[0]?.text;
//           this.comparisonResult = textResponse || 'Comparison completed successfully!';
//         },
//         (error: any) => {
//           this.comparisonResult = 'Error during comparison: ' + error.message;
//         }
//       );
//     } else {
//       this.comparisonResult = 'Please upload both images before comparing.';
//     }
//   }

//   onZoom(event: WheelEvent, container: HTMLElement) {
//     event.preventDefault();
//     const scaleAmount = 0.1;
//     this.scale += event.deltaY < 0 ? scaleAmount : -scaleAmount;
//     this.scale = Math.min(Math.max(this.scale, 0.5), 3); // Limits zoom levels
//     container.style.transform = `scale(${this.scale})`;
//   }

//   onDragStart(event: MouseEvent, container: HTMLElement) {
//     this.isDragging = true;
//     this.startX = event.clientX;
//     this.startY = event.clientY;
//     const computedStyle = window.getComputedStyle(container);
//     const matrix = new DOMMatrixReadOnly(computedStyle.transform);
//     this.initialTranslateX = matrix.m41;
//     this.initialTranslateY = matrix.m42;
//   }

//   onDrag(event: MouseEvent, container: HTMLElement) {
//     if (!this.isDragging) return;

//     const dx = event.clientX - this.startX;
//     const dy = event.clientY - this.startY;
//     container.style.transform = `translate(${this.initialTranslateX + dx}px, ${this.initialTranslateY + dy}px) scale(${this.scale})`;
//   }

//   onDragEnd() {
//     this.isDragging = false;
//   }
// }
