import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NotifierService } from '../shared/services/notifier.service';
import { Department } from './models/department.model';
import { DepartmentService } from './services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit {
  departments$: Observable<Department[]>;
  form: FormGroup;

  constructor(
    private notifierService: NotifierService,
    private departmentService: DepartmentService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl(),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      phone: new FormControl('', [Validators.required]),
    });

    this.departments$ = this.departmentService.getAll();
  }

  get modalTitle(): string {
    return this.id?.value ? 'Atualização' : 'Cadastro';
  }

  get id(): AbstractControl | null {
    return this.form.get('id');
  }

  get name(): AbstractControl | null {
    return this.form.get('name');
  }

  get phone(): AbstractControl | null {
    return this.form.get('phone');
  }

  async save(modal: TemplateRef<any>, department?: Department) {
    this.form.reset();

    if (department) {
      this.form.setValue(department);
    }

    try {
      await this.modalService.open(modal).result;

      if (this.form.dirty && this.form.valid) {
        if (department) {
          await this.departmentService.update(this.form.value);
          this.notifierService.success('Departamento atualizado com sucesso!');
        } else {
          await this.departmentService.insert(this.form.value);
          this.notifierService.success('Departamento adicionado com sucesso!');
        }
      } else {
        this.notifierService.error('O formulário deve ser preenchido corretamente.');
      }
    } catch (err) {
      if (err != 'close' && err != 0 && err != 1) {
        this.notifierService.error('Erro ao executar ação.');
      }
    }
  }

  async delete(department: Department) {
    try {
      this.departmentService.delete(department);
      this.notifierService.success('Departamento excluído com sucesso');
    } catch (error) {
      this.notifierService.error('Erro ao deletar departamento.');
    }
  }
}
