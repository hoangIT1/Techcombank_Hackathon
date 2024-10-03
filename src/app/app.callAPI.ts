import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as aws4 from 'aws4'; // Thêm aws4 để ký yêu cầu

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private accessKeyId = 'xxx'; // Thay bằng AccessKey thực tế
  private secretAccessKey = 'xxx'; // Thay bằng SecretKey thực tế
  private region = 'ap-northeast-1'; // Region thực tế
  private service = 'bedrock'; // Tên dịch vụ AWS

  constructor(private http: HttpClient) {}

  // Ký yêu cầu với AWS Signature v4 sử dụng aws4
  signRequest(requestBody: any): any {
    const options = {
      host: 'bedrock-runtime.ap-northeast-1.amazonaws.com',
      path: '/model/anthropic.claude-3-5-sonnet-20240620-v1:0/invoke',
      method: 'POST',
      service: this.service,
      region: this.region,
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Ký yêu cầu với aws4
    aws4.sign(options, {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });

    return options;
  }

  // Gửi yêu cầu tới API
  invokeAPI(requestBody: any): Observable<any> {
    const signedRequest = this.signRequest(requestBody);
    const headers = new HttpHeaders(signedRequest.headers);

    return this.http.post(`https://${signedRequest.host}${signedRequest.path}`, requestBody, { headers });
  }
}
