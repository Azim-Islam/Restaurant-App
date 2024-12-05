import {Component, inject} from '@angular/core';
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from 'ng-zorro-antd/modal';
import {EmployeeBackendService} from '../employee-backend.service';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import {
  AbstractControl, FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzInputDirective, } from 'ng-zorro-antd/input';
import {Observable, Observer, Subject, } from 'rxjs';
import {NzUploadComponent, NzUploadFile} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });




@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    NzModalComponent,
    NzButtonComponent,
    NzModalFooterDirective,
    NzFormItemComponent,
    NzFormDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzColDirective,
    NzInputDirective,
    NzRowDirective,
    NzModalContentDirective,
    FormsModule,
    NzUploadComponent,
    NzIconDirective,
  ],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})

export class AddEmployeeComponent {

  backendService = inject(EmployeeBackendService);
  // isVisible = computed(() => this.backendService.showAddModal);

  handleOk(): void {
    this.backendService.isSendingRequest.set(true);
    setTimeout(() => {
      this.backendService.isSendingRequest.set(false);
      this.handleCancel();
    }, 3000);
  }

  handleCancel() {
    this.validateForm.reset();
    this.backendService.showAddModal.set(false);
  }

  //FORM SECTION
  fb= inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    firstName: this.fb.control('', [Validators.required], [this.nameValidator]),
    middleName: this.fb.control('',[Validators.nullValidator], [this.middleNameValidator]),
    lastName: this.fb.control('', [Validators.required], [this.nameValidator]),
    spouseName: this.fb.control('', [Validators.required], [this.nameValidator]),
    fatherName: this.fb.control('', [Validators.required], [this.nameValidator]),
    motherName: this.fb.control('', [Validators.required], [this.nameValidator]),
    designation: this.fb.control('', [Validators.required], [this.nameValidator]),
    email: this.fb.control('', [Validators.required, Validators.email]),
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.validateForm.markAsTouched();
    this.validateForm.markAsPending();
    this.validateForm.markAsDirty()
  }

  // Validators
  middleNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length > 0 && !/^[a-zA-Z ]+$/.test(control.value)) {
          observer.next({ error: true, notAplhaNum: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }
  nameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!/^[a-zA-Z ]+$/.test(control.value)) {
          observer.next({ error: true, notAplhaNum: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }


  submitForm() {

  }


  //File Upload Section

  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  beforeUpload =  (file: NzUploadFile) => {
    this.fileList = this.fileList.concat([file]);
    const myReader = new FileReader();
    myReader.readAsDataURL(file as any);
    myReader.onloadend = (e) => {
      if (!file['preview']) {
        file['preview'] = myReader.result;
        this.previewImage = file['preview'];
      }
    };
    return false;
  };

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    console.log(file);
    if (!file['preview']) {

      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file['preview'];
    this.previewVisible = true;
  };
}
