import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { ToursService } from './tours.service';
import { ModalService } from '../_services';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css'],
  providers: [ToursService]
})
export class ToursComponent implements OnInit {
  closeResult: string;
  tours: any;
  tourID: any;
  tourStatus: string;
  editTourForm: FormGroup;
  position: string;
  tourData: any;

  constructor(private sessionStorageService:SessionStorageService, private router:Router, private toursService:ToursService,
    private modalService: ModalService, private formBuilder: FormBuilder) { 
  
  }

  ngOnInit() {
    var username = this.sessionStorageService.get('username');
    if(!username){
        this.router.navigate(['login']);
    }
    
    this.position = this.sessionStorageService.get('position');
    
    this.editTourForm = this.formBuilder.group({
            purpose:['', Validators.required],
            startDate:['', Validators.required],
            endDate:['', Validators.required],
            modeOfTravel:['', Validators.required],
            ticketCost:['', Validators.required],
            originCabFare:['', Validators.required],
            destinationCabFare:['', Validators.required],
            hotelCost:['', Validators.required],
            hotelReceipt:['', Validators.required],
            destinationConveyance:['', Validators.required],
            additionalInformation:['', Validators.required],
        });

    this.toursService.get_tours()
        .subscribe( data => {
            this.tours = data;
        }, err => {
            console.log(err)
        });
  }
  
    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    
    edit(tourID){
        
        this.toursService.get_tour(tourID)
                .subscribe( data => {
                   this.editTourForm.controls['purpose'].setValue(data['purpose']);
                   this.editTourForm.controls['startDate'].setValue(data['start_date']);
                   this.editTourForm.controls['endDate'].setValue(data['end_date']);
                   this.editTourForm.controls['modeOfTravel'].setValue(data['mode_of_travel']);
                   this.editTourForm.controls['ticketCost'].setValue(data['ticket_cost']);
                   this.editTourForm.controls['originCabFare'].setValue(data['origin_cab_fare']);
                   this.editTourForm.controls['destinationCabFare'].setValue(data['destination_cab_fare']);
                   this.editTourForm.controls['hotelCost'].setValue(data['hotel_cost']);
                   this.editTourForm.controls['destinationConveyance'].setValue(data['conveyance']);
                   this.editTourForm.controls['additionalInformation'].setValue(data['additional_information']);
                   this.tourID = data['id'];
                   this.tourStatus = data['status'];
                   this.modalService.open('edit-tour');
                }, err => {
                    console.log(err);
                });
               
                    
    }
    
    editSaveDraft(id){
        alert(id);
    }
    
    view(tourID){
        this.toursService.get_tour(tourID)
            .subscribe( data => {
                this.tourData = data;
                this.modalService.open('view-tour');
            }, err => {
                console.log(err)
            });
        
    }
    
    
  

}
