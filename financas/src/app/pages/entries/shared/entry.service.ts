
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Entry } from './entry.model';


@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = 'api/categories';


  constructor(
    private http: HttpClient,
  ) { }

  // Lista todas as categorias
  getAll(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  // Retorna uma categoria expecifica pelo ID
  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  // Método responsável por criar uma categoria
  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  // Método responsável por atualizar uma categoria
  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry) // retorna o objeto category
    )
  }

  // Método responsável por deletar uma categoria
  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  // Metodos privados
  // converte um array de objeto json, para um array de objeto categories
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(element => entries.push(element as Entry));
    return entries;
  }

  // Converte um objeto json para um objeto categories
  // Não converte um array, retorna apenas uma categoria
  private jsonDataToEntry(jsonData: any): Entry {
    return jsonData as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÂO => ", error)
    return throwError(error)
  }
}
