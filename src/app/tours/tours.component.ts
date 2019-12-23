import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { ToursService } from './tours.service';
import { ModalService } from '../_services';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css'],
  providers: [ToursService, DatePipe]
})
export class ToursComponent implements OnInit {
  closeResult: string;
  tours: any;
  tourID: any;
  tourStatus: string;
  editTourForm: FormGroup;
  createTourForm: FormGroup;
  approveTourForm: FormGroup;
  position: string;
  tourData: any;
  approvingManagers: any;
  userID: any;
  today: string;
  
  constructor(private sessionStorageService:SessionStorageService, private router:Router, private toursService:ToursService,
    private modalService: ModalService, private formBuilder: FormBuilder, private datePipe:DatePipe) { 
  
  }

  ngOnInit() {
    var username = this.sessionStorageService.get('username');
    if(!username){
        this.router.navigate(['login']);
    }
    
    this.userID = this.sessionStorageService.get('userid');
    this.position = this.sessionStorageService.get('position');
    
    this.toursService.get_approving_managers()
        .subscribe(data => {
            this.approvingManagers = data;
        }, err => {
            console.log(err);
        });


        
    this.today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    
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
            approvingManager:['', Validators.required],
        });
        
    this.createTourForm = this.formBuilder.group({
            purpose:['', Validators.required],
            startDate:[this.today, Validators.required],
            endDate:['', Validators.required],
            modeOfTravel:['', Validators.required],
            ticketCost:['', Validators.required],
            originCabFare:['', Validators.required],
            destinationCabFare:['', Validators.required],
            hotelCost:['', Validators.required],
            hotelReceipt:['', Validators.required],
            destinationConveyance:['', Validators.required],
            approvingManager:['', Validators.required],
        });
        
    this.approveTourForm = this.formBuilder.group({
            status:[''],
            remarks:[''],
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
               if(data['approving_manager']){
                this.editTourForm.controls['approvingManager'].setValue(data['approving_manager']['id']);
               }
               this.tourID = data['id'];
               this.tourStatus = data['status'];
               this.modalService.open('edit-tour');
            }, err => {
                console.log(err);
            });
               
                    
    }
    
    editSubmit(id, status){
        var purpose = this.editTourForm.controls['purpose'].value;
        var startDate = this.editTourForm.controls['startDate'].value;
        var endDate = this.editTourForm.controls['endDate'].value;
        var modeOfTravel = this.editTourForm.controls['modeOfTravel'].value;
        var ticketCost = this.editTourForm.controls['ticketCost'].value;
        var originCabFare = this.editTourForm.controls['originCabFare'].value;
        var destinationCabFare = this.editTourForm.controls['destinationCabFare'].value;
        var hotelCost = this.editTourForm.controls['hotelCost'].value;
        var conveyance = this.editTourForm.controls['destinationConveyance'].value;
        var additionalInformation = this.editTourForm.controls['additionalInformation'].value;
        var approvingManagerID = this.editTourForm.controls['approvingManager'].value;
        
        var tour_data = {
            purpose:purpose,
            start_date:startDate,
            end_date:endDate,
            mode_of_travel:modeOfTravel,
            ticket_cost:ticketCost,
            origin_cab_fare:originCabFare,
            destination_cab_fare:destinationCabFare,
            hotel_cost:hotelCost,
            conveyance:conveyance,
            additional_information:additionalInformation,
        }   
        
        if(status=='submitted'){
            tour_data['status'] = 'Submitted'
        }
        
        if(approvingManagerID){
            tour_data['approving_manager_id'] = approvingManagerID
        }

        this.toursService.edit_tour(id, tour_data)
            .subscribe( data => {
                console.log(data);
                this.modalService.close('edit-tour');
                this.ngOnInit();
            }, err => {
                console.log(err);
            });
    }
    
    createSubmit(status){
        var purpose = this.createTourForm.controls['purpose'].value;
        var startDate = this.createTourForm.controls['startDate'].value;
        var endDate = this.createTourForm.controls['endDate'].value;
        var modeOfTravel = this.createTourForm.controls['modeOfTravel'].value;
        var ticketCost = this.createTourForm.controls['ticketCost'].value;
        var originCabFare = this.createTourForm.controls['originCabFare'].value;
        var destinationCabFare = this.createTourForm.controls['destinationCabFare'].value;
        var hotelCost = this.createTourForm.controls['hotelCost'].value;
        var conveyance = this.createTourForm.controls['destinationConveyance'].value;
        var approvingManagerID = this.createTourForm.controls['approvingManager'].value;
        var tour_data = {
            purpose:purpose,
            start_date:startDate,
            end_date:endDate,
            mode_of_travel:modeOfTravel,
            ticket_cost:ticketCost,
            origin_cab_fare:originCabFare,
            destination_cab_fare:destinationCabFare,
            hotel_cost:hotelCost,
            conveyance:conveyance,
            status:'Draft',
        }   
        
        if(status == 'submitted'){
            tour_data['status'] = 'Submitted';
        }
        if(approvingManagerID){
            tour_data['approving_manager_id'] = approvingManagerID
        }

        this.toursService.create_tour(tour_data)
            .subscribe( data => {
                console.log(data);
                this.modalService.close('create-tour');
                this.ngOnInit();
            }, err => {
                console.log(err);
            });
    }
    
    approveSubmit(id){
        var status = this.approveTourForm.controls['status'].value;
        var remarks = this.approveTourForm.controls['remarks'].value;
        var date = new Date();
        var datetime = this.datePipe.transform(date, 'yyyy-MM-dd hh:mm:ss');
        
        var tour_data = {
            feedback_date:datetime
        }
        
        if(status){
            tour_data['status'] = status;
        }
        
        if(remarks){
            tour_data['remarks'] = remarks;
        }
        
        if(this.position == 'Finance Manager'){
            tour_data['financial_manager_id'] = this.userID;
        }
        
        
        this.toursService.edit_tour(id, tour_data)
            .subscribe( data => {
                console.log(data);
                this.modalService.close('approve-tour');
                this.ngOnInit();
            }, err => {
                console.log(err);
            });
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
    
    create(){
        this.modalService.open('create-tour');
    }
    
    
    approve(id){
        this.toursService.get_tour(id)
            .subscribe( data => {
                this.tourData = data;
                this.approveTourForm.controls['status'].setValue(data['status']);
                this.approveTourForm.controls['remarks'].setValue(data['remarks']);
                this.modalService.open('approve-tour');
            }, err => {
                console.log(err)
            });
    }
    
    submitToFinance(id){
        var tour_data = {
            status:'Submitted to Finance'
        }
        
        this.toursService.edit_tour(id, tour_data)
            .subscribe( data => {
                console.log(data);
                this.ngOnInit();
            }, err => {
                console.log(err);
            });
        
        
    }
    

}
