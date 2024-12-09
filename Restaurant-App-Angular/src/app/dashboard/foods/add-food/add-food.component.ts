import {Component, inject} from '@angular/core';
import {NzModalComponent, NzModalContentDirective, NzModalFooterDirective, NzModalService} from 'ng-zorro-antd/modal';
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
import {NzInputDirective,} from 'ng-zorro-antd/input';
import {Observable, Observer, Subject,} from 'rxjs';
import {NzUploadChangeParam, NzUploadComponent, NzUploadFile} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FoodBackendService} from '../food-backend.service';
import {CreateEmployee} from '../food.interface';


const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


@Component({
  selector: 'app-add-food',
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
    NzDatePickerComponent,
    NzSelectComponent,
    NzOptionComponent,
  ],
  templateUrl: './add-food.component.html',
  styleUrl: './add-food.component.css'
})

export class AddFoodComponent {
  backendService = inject(FoodBackendService);
  responsive = inject(BreakpointObserver);

  modalWidth = "80vw"

  handleOk(): void {
    if (this.validateForm.status === "INVALID") {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i as keyof typeof this.validateForm.controls].markAsDirty();
        this.validateForm.controls[i as keyof typeof this.validateForm.controls].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === "VALID") {
      this.backendService.isSendingRequest.set(true);
      setTimeout(() => {
        this.backendService.isSendingRequest.set(false);
        this.handleCancel();
        this.backendService.triggerRefresh.set(true);
      }, 1000);
    }

  }

  handleCancel() {
    this.fileList = [];
    this.image = '';
    this.imageB64 = '';
    this.validateForm.reset();
    this.backendService.showAddModal.set(false);
  }

  //FORM SECTION
  fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    foodName: this.fb.control('', [Validators.required], [this.nameValidator]),
    description: this.fb.control('', [Validators.required], [this.fakeVal]),
    price: this.fb.control('', [Validators.required], [this.middleNameValidator]),
    discountType: this.fb.control({value: 'None', disabled: false}, [Validators.nullValidator]),
    discountAmount: this.fb.control({value: '0', disabled: true}, [Validators.nullValidator], [this.isNumberValidator]),
    discountedPrice: this.fb.control({value: '0', disabled: true}, [Validators.nullValidator], [this.isNumberValidator]),
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit() {
    // this.validateForm.controls.discountType.setValue('None');
    // this.validateForm.controls.discountAmount.disable();
    // this.validateForm.controls.discountedPrice.disable();

    this.responsive.observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        this.modalWidth = "100vw";
        if (result.matches) {
          this.modalWidth = "80vw";
        } else {
          this.modalWidth = "100vw";
        }
      });
    this.validateForm.controls.discountType.valueChanges.subscribe(
      (value) => {
        if (value === 'None') {
          this.validateForm.controls.discountAmount.disable();
          this.validateForm.controls.discountedPrice.disable();
        } else {
          if (value === 'Flat') {
            this.validateForm.controls.discountAmount.
          }
          this.validateForm.controls.discountAmount.enable();
          this.validateForm.controls.discountedPrice.enable();
        }
      }
    )
  }

  // Validators
  fakeVal(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        observer.next(null);
        observer.complete();
      }, 500);
    });
  }

  // Validators
  middleNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length > 0 && !/^[a-zA-Z ]+$/.test(control.value)) {
          observer.next({error: true, notAplhaNum: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }

  isNumberValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length > 0 && !/^[+-]?\d+(\.\d+)?$/.test(control.value)) {
          observer.next({error: true, isNotNum: true});
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
          observer.next({error: true, notAplhaNum: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }

  phoneNumberValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!/^(?:\+8801[3-9]|01[3-9])\d{8}$/.test(control.value)) {
          observer.next({error: true, isNotNumeric: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }

  nidNumberValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!/^\d{4,}$/.test(control.value)) {
          observer.next({error: true, isNotNumeric: true});
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
  image = ''
  imageB64 = ''
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;


  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  date: any;


  beforeUpload(file: NzUploadFile, fileList: NzUploadFile[]): boolean {
    return true;
  }

  onChange(event: NzUploadChangeParam) {
    const reader = new FileReader();
    if (event.file.originFileObj) {
      reader.onloadend = () => {
        this.imageB64 = reader.result as string;
        this.image = event.file.uid + event.file.name;
      }
      reader.readAsDataURL(event.file.originFileObj);
    }

    if (event.type !== 'removed') {
      this.image = "";
      this.imageB64 = "";
    }

    if (event.type === "error") {
      event.file.error.statusText = "Employee Image";
      event.file.error.status = "200";
    }
  }

  protected readonly toString = toString;
}
