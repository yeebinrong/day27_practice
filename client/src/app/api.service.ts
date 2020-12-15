import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  async postAPIform (data) {
    let formData = new FormData()
    formData.append("data", JSON.stringify(data))
    await this.http.post('http://localhost:3000/temperature', formData).toPromise()
  }
}
