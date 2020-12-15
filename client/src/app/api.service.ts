import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  async postAPIform (data) {
    let formData = new FormData()
    formData.append("data", data)
    // NOT WORKING DO NOT REFERENCE GO REFER TO DIGITALOCEAN CODE
    formData.append('image_file', (<HTMLInputElement>document.getElementById("image_file")).files[0])
    await this.http.post('http://localhost:3000/temperature', formData).toPromise()
  }
}
