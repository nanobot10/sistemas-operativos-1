import { Component, OnInit } from '@angular/core';
import { InfectedService } from './services/infected.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'codiv19';

  infected: any[] = [];
  top3: any[] = [];

  top3Chart: any = null;

  constructor(private infectedService: InfectedService) {
  }

  ngOnInit() {
    this.infectedService.getAllInfected()
      .subscribe( (res: any) => {
        console.log(res);
        this.infected = res.pacientes;
      });
    this.infectedService.getTop3Infected()
      .subscribe( (res: any) => {
        console.log(res);
        this.top3 = res.pacientes;
        this.createTop3Pie();
      });

     
  }

  createTop3Pie() {

    console.log(this.top3.map( item => {return item._id} ));
    console.log(this.top3.map( item => {return item.total})); 
    this.top3Chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.top3.map( item => {return item._id} ),
        datasets: [{
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: this.top3.map( item => {return item.total})
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Predicted world population (millions) in 2050'
        }
      }
  });
  }


}
