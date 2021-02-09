import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PatientService } from '../patient.service';
import { DisplayVal, PatientRecord, PatientViewRecord } from '../patient';
import {RoleEnum} from '../../utils';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {
  public patientID: any;
  public patientRecordHistory: Array<PatientViewRecord> = [];
  public data: any;
  headerNames = [
    new DisplayVal(PatientViewRecord.prototype.date, 'Date'),
    new DisplayVal(PatientViewRecord.prototype.changedBy, 'Last changed by'),
    new DisplayVal(PatientViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientViewRecord.prototype.lastName, 'Last Name'),
    new DisplayVal(PatientViewRecord.prototype.age, 'Age'),
    new DisplayVal(PatientViewRecord.prototype.bloodGroup, 'Blood Group'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.isPatient()) {
      this.headerNames.push(
        new DisplayVal(PatientViewRecord.prototype.address, 'Address'),
        new DisplayVal(PatientViewRecord.prototype.phoneNumber, 'Contact number'),
        new DisplayVal(PatientViewRecord.prototype.emergPhoneNumber, 'Emergency number')
      );
    }
    this.headerNames.push(
      new DisplayVal(PatientViewRecord.prototype.allergies, 'Allergies'),
      new DisplayVal(PatientViewRecord.prototype.diagnosis, 'Diagnosis'),
      new DisplayVal(PatientViewRecord.prototype.symptoms, 'Symptoms'),
      new DisplayVal(PatientViewRecord.prototype.treatment, 'Treatment'),
      new DisplayVal(PatientViewRecord.prototype.followUp, 'Followup duration')
    );
    this.route.params
      .subscribe((params: Params) => {
        this.patientID = params.patientId;
        this.refresh();
      });
  }

  public refresh(): void {
    this.patientService.getPatientHistoryByKey(this.patientID).subscribe(x => {
      this.data = x as Array<PatientRecord>;
      this.patientRecordHistory = this.data.map((y: PatientRecord) => new PatientViewRecord(y));
    });
  }

  public isPatient(): boolean {
    // TODO: remove admin from this condition at the end of web app development
    return this.authService.getRole() === RoleEnum.PATIENT || this.authService.getRole() === RoleEnum.ADMIN;
  }
}
