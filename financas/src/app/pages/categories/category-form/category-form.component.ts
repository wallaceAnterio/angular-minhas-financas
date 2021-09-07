import { Component, OnInit, AfterContentChecked } from '@angular/core';

// Formulario
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Rotas
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr'

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  // Armazena se esta sendo criado, ou editado um recurso/categoria
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string // verifica o titulo da pagina editando/criando
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false // desativa o botao de enviar/salvar
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private activatRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction(); // verifica a ação atual
    this.buildCategoryForm();// carrega o formulário de acordo com a ação em questão
    this.loadCategory(); // carrega a categoria, de acordo com a ação em questão
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  // Método responsǘel por enviar o formulário
  submitForm() {
    this.submittingForm = true; // desbloquei o botão, ao enviar o formulário

    if (this.currentAction == "new") {
      this.createCategory();
    }
    else {
      this.currentAction = "edit"
      this.updateCategory();
    }
  }

  // MÈTODOS PRIVADOS
  // Define a ação atual do formulário
  private setCurrentAction() {
    if (this.activatRoute.snapshot.url[0].path == "new") {
      this.currentAction = "new"
    }
    else {
      this.currentAction = "edit"
    }
  }

  // Definindo o formulário de categoria
  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {

      this.activatRoute.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))

      )
        .subscribe((category) => {
          this.category = category
          console.log(category)
          this.categoryForm.patchValue(category) // setando os valores da categoria, para o formulário
        }, (error) => alert('Ocorreu um erro no servidor, tente mais tarde.'));
    }
  }

  // Seta o titulo da página de acordo com a ação em questao
  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Nova Categoria" // se tiver cadastrando, exiba esse titulo
    }
    else {
      const categoryName = this.category.name || "" // garante que ao começar o ciclo de vida do componente, tenha uma categoria já carregada
      this.pageTitle = "Editando categoria: " + categoryName // se tiver editando, exiba esse titulo
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value) // monta um objeto "category", de acordo com oque tem no formulário

    this.categoryService.create(category)// envia a categoia para o servidor, para ser criado uma categoria nova
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )

  }
  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value) // cria um objeto category preenchido de acordo com os dados que estão no formulário.

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
        )
  }

  private actionsForSuccess(category?: Category) {

    toastr.success("Solicitação processada com sucesso!")

    // redirecinamento/reload da pagina do componente
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, "edit"]))// permanece na pagina de cadastro, porem com recurso de edição, já coms os dados cadastrados prontos para editar
    console.log(category)


  }

  private actionsForError(error) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!")

    this.submittingForm = false; // desativa o btn de enviar

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).erros;
    }
    else {
      this.serverErrorMessages = ["Falha na cominicação com o servidor. Por favor, tente mais tarde."]
    }
  }
}
