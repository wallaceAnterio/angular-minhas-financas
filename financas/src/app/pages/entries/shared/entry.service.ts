
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Entry } from './entry.model';


@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiPath: string = "api/entries";


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
    // Exemplificando
    // console.log(jsonData[0] as Entry) // faz um casting, não exibe qual é o tipo do objeto. mesmo fazendo casting, continua sendo um objeto genérico
    // console.log(Object.assign(new Entry(), jsonData[0])) // retorna um objeto do tipo Entry, que foi instanciado e foi preenchido com os valores do objeto


    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element)// criando uma constante entry, contendo um Objeto "Entry", prenchido com os dados que vem do servidor
      entries.push(entry)
    });
    return entries;
  }

  // Converte um objeto json para um objeto categories
  // Não converte um array, retorna apenas uma categoria
  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÂO => ", error)
    return throwError(error)
  }
}
