import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  form:FormGroup
  constructor(private fb: FormBuilder, private apiSvc:ApiService) { }

  ngOnInit(): void {
    this.createForm()
  }

  onSubmit() {
    console.info(this.form.value) 
    this.apiSvc.postAPIform(this.form.value)
  }

  private createForm() {
    this.form = this.fb.group({
      userName: this.fb.control('test', [Validators.required]),
      q1: this.fb.control('1', [Validators.required]),
      q2: this.fb.control('2', [Validators.required]),
      temperature: this.fb.control('3', [Validators.required]),
      image_file: this.fb.control('', [Validators.required])
    })
  }
}
