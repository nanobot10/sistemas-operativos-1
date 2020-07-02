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
  ages: any[] = [];
  lastCase: any;

  top3Chart: any = null;
  barChart: any = null;
  page: number = 0;

  constructor(private infectedService: InfectedService) {
  }

  ngOnInit() {
    this.infectedService.getAllInfected(this.page)
      .subscribe( (res: any) => {
        this.infected = res.pacientes;
      });
    this.infectedService.getTop3Infected()
      .subscribe( (res: any) => {
        this.top3 = res.pacientes;
        this.createTop3Pie();
      });
    this.infectedService.getLastCase()
      .subscribe( (res: any) => {
        this.lastCase = res.paciente;
      });
    this.infectedService.getAges()
    .subscribe( (res: any) => {
      this.ages = res.pacientes;
      this.createBarChart();
    }); 
  }

  createTop3Pie() {
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
          text: 'Top 3 Departamentos con Coronavirus'
        }
      }
  });
  }

  createBarChart() {

    console.log(this.ages.map( item => {return item.age} ));
    console.log(this.ages.map( item => {return item.value})); 
    this.barChart =  new Chart('barChart', {
        type: 'horizontalBar',
        data: {
          labels: this.ages.map( item => {return item.age} ),
          datasets: [
            {
              label: "Personas",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: this.ages.map( item => {return item.value})
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Edades Afectadas'
          }
        }
    });
  }


  previous() {    
    this.page--;
    if(this.page < 0) {
      this.page = 0;
    }
    this.infectedService.getAllInfected(this.page)
      .subscribe( (res: any) => {
        this.infected = res.pacientes;
      });
  }

  next() {
    if(this.infected.length > 0){
      this.page++;
    }
    this.infectedService.getAllInfected(this.page)
      .subscribe( (res: any) => {
        this.infected = res.pacientes;
      });
  }


}
