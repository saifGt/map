import { Component , OnInit, TemplateRef, ViewChild} from '@angular/core';
import { MapBDService } from '../map-bd.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { AuthenticationService } from '../auth.service';


@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss'],
  providers :[MapBDService]
})
export class UserLogComponent {
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  changedPW : boolean = false;
  error = "";
  returnUrl!: string;
  page: number = 0;
  size: number = 20;
  role!: string;
  toast!: false;
  nbrCnx:Number | undefined;

  // set the current year
  year: number = new Date().getFullYear();

  changePassword: boolean = false;
  changePasswordForm!: FormGroup;
  @ViewChild("content") content!: TemplateRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      codeEtablissementActuel: ["", [Validators.required, Validators.min(9)]],
      motdepasse: ["", [Validators.required, Validators.min(5)]],
    });

  }
  mustMatch(identifiantKey: string, motdepasseKey: string) {
    return (group: FormGroup) => {
      const identifiantInput = group.controls[identifiantKey];
      const motdepasseInput = group.controls[motdepasseKey];
      if (identifiantInput.value !== motdepasseInput.value) {
        return motdepasseInput.setErrors({ mustMatch: true });
      }
      return null;
    };
  }

  get f() {
    return this.loginForm.controls;
  }

  get form() {
    return this.changePasswordForm.controls;
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: "md", centered: true });
  }

  onSubmit() {
    this.submitted = true;

    this.authenticationService
      .login(
        this.loginForm.get("codeEtablissementActuel")?.value,
        this.loginForm.get("motdepasse")?.value
      )
      .subscribe((data: AuthResponse) => {
        this.nbrCnx=data.nombreDeConnexion
        console.log(this.nbrCnx)
        if (data.connected) {
          
          if (data.roleUser) {
            localStorage.setItem("roleUser", data.roleUser);
            localStorage.setItem("codeCre", data.codeCre ?? "");
            localStorage.setItem("connected", data.connected);
            localStorage.setItem("codeEtablissementActuel",data.codeEtablissement ?? "");
            localStorage.setItem("nomEtablissementActuel",data.nomEtablissement ?? "");
          }
          if (data.roleUser?.toLowerCase().includes("super_admin")) {
            localStorage.setItem("codeEtablissementActuel", "الوزارة");
            localStorage.setItem("nomEtablissementActuel", "الوزارة");
            this.router.navigateByUrl("/pyramid");
          } else if (! this.changedPW &&this.nbrCnx==1  ) {
           if(data.nombreDeConnexion)
            this.openModal(this.content);
         
            if (data.codeEtablissement && data.nomEtablissement) {
              localStorage.setItem(
                "codeEtablissementActuel",
                data.codeEtablissement
              );
              localStorage.setItem(
                "nomEtablissementActuel",
                data.nomEtablissement
              );
            }
          }
        
          this.role = localStorage.getItem("roleUser") ?? "";
          if (this.role == "SUPER_ADMIN") {
            this.router.navigateByUrl("/pyramid/user");
          }
          if (this.role == "GESTIONNAIRE_CRE" && (this.changedPW ||this.nbrCnx != 1 )) {
            this.router.navigateByUrl("/pyramid/etablissements");
          }
          if (this.role == "GESTIONNAIRE_ETABLISSEMENT" && (this.changedPW ||this.nbrCnx != 1)) {
            this.router.navigateByUrl("/pyramid/employes");
          }
        } else {
          Swal.fire({
            title: "خطأ",
            icon: "error",
            confirmButtonText: "حسناً",
          });
        }
      });
  }

  onSubmitNewPassword() {
    this.changedPW = true
    this.authenticationService
      .changePwd(
        this.changePasswordForm.value,
        this.loginForm.get("codeEtablissementActuel")?.value
      )
      .subscribe(() => {
        Swal.fire({
          title: "تم تحديث كلمة المرور بنجاح",
          icon: "success",
          confirmButtonText: "حسناً", 
        }).then(() => {
          this.modalService.dismissAll();
          this.loginForm.patchValue({
            motdepasse: "",
          });
        });
      });
  }

  private matchPasswords(password: string) {
    return (control: AbstractControl) => {
      if (!control || !control.parent) {
        return null;
      }
      return control.parent.get(password)?.value === control.value
        ? null
        : { mismatch: true };
    };
  }
}

