import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Module } from '../models/module.model';
import { ModuleService } from '../services/module.service';

@Component({
  selector: 'app-new-module',
  templateUrl: './new-module.component.html',
  styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent implements OnInit {

  module : Module;

  constructor(private moduleService: ModuleService, private router:Router) { }

  ngOnInit(): void {
    this.module = new Module();
  }

  createNewModule(moduleName: string, moduleDescription: string){
    let module = new Module();
    module.name = moduleName;
    module.description = moduleDescription;
    this.moduleService.createModule(module).subscribe((response:any)=>{
      console.log(response);
    });
    
    this.router.navigate(['/modules']);
    
  }

}
