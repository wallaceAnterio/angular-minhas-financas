import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDatabase implements InMemoryDbService {

  // BackEnd simulado em memória
  createDb() {
    const categories = [
      { id: 1, name: 'Lazer', description: 'Cinemas, parques, praias, etc' },
      { id: 2, name: 'Saúde', description: 'Plano de saúdes e remédios' },
      { id: 3, name: 'Salario', description: 'Recebimento de salário' },
      { id: 4, name: 'Moradia', description: 'Pagamentos de Contas da Casa' },
      { id: 5, name: 'Freelas', description: 'Trabalhos como freelancer' },

    ];
    return { categories }
  }

}
