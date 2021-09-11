import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiPath: string = 'api/categories/';


  constructor(
    private http: HttpClient,
  ) { }

  // Lista todas as categorias
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  // Retorna uma categoria expecifica pelo ID
  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  // Método responsável por criar uma categoria
  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  // Método responsável por atualizar uma categoria
  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category) // retorna o objeto category
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
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  // Converte um objeto json para um objeto categories
  // Não converte um array, retorna apenas uma categoria
  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÂO => ", error)
    return throwError(error)
  }
}
