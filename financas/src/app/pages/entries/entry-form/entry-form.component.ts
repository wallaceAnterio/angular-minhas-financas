import { Component, OnInit, AfterContentChecked } from '@angular/core';

// Formulario
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Rotas
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from './../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr'

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  // Armazena se esta sendo criado, ou editado um recurso/categoria
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string // verifica o titulo da pagina editando/criando
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false // desativa o botao de enviar/salvar
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private activatRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction(); // verifica a ação atual
    this.buildEntryForm();// carrega o formulário de acordo com a ação em questão
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
  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]], // despesa ou receita
      categoryId: [null, [Validators.required]],

    });
  }

  private loadCategory() {
    if (this.currentAction == 'edit') {

      this.activatRoute.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))

      )
        .subscribe((entry) => {
          this.entry = entry
          console.log(entry)
          this.entryForm.patchValue(entry) // setando os valores da categoria, para o formulário
        }, (error) => alert('Ocorreu um erro no servidor, tente mais tarde.'));
    }
  }

  // Seta o titulo da página de acordo com a ação em questao
  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = "Cadastro de Novo Lançamento" // se tiver cadastrando, exiba esse titulo
    }
    else {
      const entryName = this.entry.name || "" // garante que ao começar o ciclo de vida do componente, tenha uma categoria já carregada
      this.pageTitle = "Editando Lançamento: " + entryName // se tiver editando, exiba esse titulo
    }
  }

  private createCategory() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value) // monta um objeto "category", de acordo com oque tem no formulário

    this.entryService.create(entry)// envia a categoia para o servidor, para ser criado uma categoria nova
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
      )

  }
  private updateCategory() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value) // cria um objeto category preenchido de acordo com os dados que estão no formulário.

    this.entryService.update(entry)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionsForError(error)
        )
  }

  private actionsForSuccess(entry?: Entry) {

    toastr.success("Solicitação processada com sucesso!")

    // redirecinamento/reload da pagina do componente
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", entry.id, "edit"]))// permanece na pagina de cadastro, porem com recurso de edição, já coms os dados cadastrados prontos para editar
    console.log(entry)


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
