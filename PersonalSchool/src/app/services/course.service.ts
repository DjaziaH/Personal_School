import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private webRequestService : WebRequestService) { }

  getCourses(moduleId : string){
      return this.webRequestService.get('modules/'+moduleId+'/courses');
  }
  getCourse(moduleId :string , courseId : string){
    console.log('here')
    return this.webRequestService.get('modules/'+moduleId+'/courses/'+courseId);
  }

  createCourse(moduleId : string, course : Course){
    return this.webRequestService.post('modules/'+moduleId+'/courses',{ course });
  }
  deleteCourse(moduleId : string , courseId : string){
    return this.webRequestService.delete('modules/'+moduleId+'/courses/'+courseId);
  }
  editCourse(moduleId: string , courseId : string , title: string , objectif: string ){
    return this.webRequestService.put('modules/'+moduleId+"/courses/"+courseId , {title,objectif})
}
}
