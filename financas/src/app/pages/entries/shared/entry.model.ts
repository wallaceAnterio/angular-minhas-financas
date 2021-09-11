import { Category } from './../../categories/shared/category.model';

export class Entry {
  constructor(
    public id?: number,
    public name?: string,
    public desciption?: string,
    public type?: string, // para dizer se é uma despesa ou uma receita
    public amount?: string, // valor
    public date?: string,
    public paid?: boolean, // se foi pago ou não
    public categoryId?: number,
    public category?: Category
  ) { }


  // Objeto que verifica se o tipo é despesa ou receita
  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  };

  //Metodo que mostra se foi pago ou não
  get paidText(): string{
    return this.paid ? 'Pago' : 'Pendente'
  }
}
