import { Injectable } from '@angular/core';
import {  WebRequestService} from "./web-request.service";
import { Module } from "../models/module.model";

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private webRequestService : WebRequestService) { }
  
  createModule(module : Module){
    return this.webRequestService.post('modules',{ module });
  }

  getModules() {
    return this.webRequestService.get('modules');
  }

  deleteModule(moduleId : string){
    var uri = 'modules/'+moduleId;
    return this.webRequestService.delete(uri);
  }

  editModule(moduleId: string, name: string , description: string ){
      return this.webRequestService.put('modules/'+moduleId,{name,description})
  }
  getModuleById(moduleId : string){
    return this.webRequestService.get('modules/'+moduleId);
  }
}
