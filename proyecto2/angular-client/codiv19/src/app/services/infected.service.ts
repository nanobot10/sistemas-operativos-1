import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class InfectedService {

  constructor(private http: HttpClient) { }

  getAllInfected() {
    return this.http.get(`${API_URL}/pacientes`);
  }

  getTop3Infected() {
    return this.http.get(`${API_URL}/pacientes/top-3`);
  }

  getLastCase() {
    return this.http.get(`${API_URL}/pacientes/last`);
  }

  getAges() {
    return this.http.get(`${API_URL}/pacientes/ages`);
  }

}
