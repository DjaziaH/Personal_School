import { Content } from '../models/content.model';
import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ContentServiceService {

  constructor(private webRequestService : WebRequestService) { }

  getContents(moduleId : string, courseId : string){
      return this.webRequestService.get('modules/'+moduleId+'/courses/'+courseId+'/contents');
  }
  getContent(moduleId :string , courseId : string, contentId : string){
    console.log('here')
    return this.webRequestService.get('modules/'+moduleId+'/courses/'+courseId+'/contents/'+contentId);
  }

  createContent(moduleId : string, courseId:string,  content : Content){
    return this.webRequestService.post('modules/'+moduleId+'/courses/'+courseId+'/contents',{ content });
  }
  deleteContent(moduleId : string , courseId : string , contentId : string){
    return this.webRequestService.delete('modules/'+moduleId+'/courses/'+courseId+'/contents/'+contentId);
  }
  editContent(moduleId: string , courseId : string , contentId : string , title: string , type: string , link : string ){
    return this.webRequestService.put('modules/'+moduleId+"/courses/"+courseId+'contents/'+contentId , {title,type,link})
}
}
