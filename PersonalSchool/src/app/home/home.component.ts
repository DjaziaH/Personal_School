import { Component, OnInit } from '@angular/core';
import { Module } from '../models/module.model';
import { Course } from "../models/course.model";
import { ModuleService } from '../services/module.service';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { ContentServiceService } from '../services/content-service.service';
import { Content } from '../models/content.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modules : Module[];
  courses : Course[];
  contents : Content[];
  module : Module;
  editedModule : Module;
  course : Course;
  editedCourse : Course; 
  selectedModuleId : string;
  selectedCourseId : string;
  selectedContentId : string;
  
  constructor(private courseService : CourseService ,
              private moduleService : ModuleService,
              private contentService : ContentServiceService,
              private route: ActivatedRoute, 
              private router:Router) { }

  ngOnInit() {

    this.moduleService.getModules().subscribe((modules:Module[]) => this.modules = modules);
    console.log("Init");

    this.module = new Module();
    this.editedModule = new Module();
    this.course = new Course();
    this.editedCourse = new Course();
    
    
    this.route.params.subscribe(
      (params: Params) => {
         if (params.moduleId) {
          console.log("params.moduleId  : "+params.moduleId);
          this.selectedModuleId = params.moduleId;
          this.courseService.getCourses(params.moduleId).subscribe((courses: Course[]) => {
            this.courses = courses;
          })
          this.moduleService.getModuleById(this.selectedModuleId).subscribe((module: Module)=>{
            this.editedModule = module;
          
            if(params.courseId){
              this.selectedCourseId = params.courseId;
              console.log(" course Id :"+params.courseId)
              console.log("selected course Id :"+this.selectedCourseId)
              this.courseService.getCourse(params.moduleId, params.courseId).subscribe((course: Course)=>{
                this.editedCourse = course;
                console.log("the value of course : "+ course)
              })
              this.contentService.getContents(params.moduleId,params.courseId).subscribe((contents: Content[])=>{
                this.contents = contents;
              })
              if(params.contentId){
                this.selectedContentId = params.contentId;
                this.DeleteContent();
              }
            }  
          })
        } else {
          this.courses = undefined;
        }
      }
    );
    
  }

  /** *********************** Methods to Create objects ****************************** */
  createNewModule(){
    this.moduleService.createModule(this.module).subscribe((module:Module)=>{
      console.log(module);
      this.router.navigate(['/modules',module._id])

    });

  }
  createNewCourse(){
    console.log(this.selectedModuleId);
      this.courseService.createCourse(this.selectedModuleId,this.course).subscribe((course:Course)=>{
        console.log(course);
        this.router.navigate(['/modules/'+this.selectedModuleId+'/courses/'+course._id])
      });
  }

  createNewContent( title:string , type : string , link : string ){
    console.log('title : '+title+' link : '+ link + ' type : ')
    let content = new Content();
    content.title = title;
    content.type = type;
    content.link = link;

    console.log(this.selectedCourseId);
      this.contentService.createContent(this.selectedModuleId,this.selectedCourseId,content).subscribe((content:Content)=>{
        console.log(content);
        this.router.navigate(['/modules/'+this.selectedModuleId+'/courses/'+this.selectedCourseId])
      });
  }
  /** *********************** Methods to Delete objects ****************************** */

  DeleteModule(){
    this.moduleService.deleteModule(this.selectedModuleId).subscribe(() =>{
      console.log("module deleted : "+ this.selectedModuleId);
      this.router.navigate(['/home']);
      this.selectedModuleId = ""
      console.log("module  : "+ this.selectedModuleId);

    })
  }

  DeleteCourse(){
    this.courseService.deleteCourse(this.selectedModuleId,this.selectedCourseId).subscribe(() =>{
      console.log("Course deleted : "+ this.selectedCourseId);
      this.router.navigate(['/modules',this.selectedModuleId]);
      this.selectedCourseId = ""
      console.log("Course  : "+ this.selectedCourseId);

    })
}


DeleteContent(){
  this.contentService.deleteContent(this.selectedModuleId,this.selectedCourseId,this.selectedContentId).subscribe(() =>{
    console.log("Content deleted : "+ this.selectedContentId);
    this.router.navigate(['/modules/'+this.selectedModuleId+'/courses/'+this.selectedCourseId]);
    this.selectedContentId = ""
    console.log("Content  : "+ this.selectedContentId);

  })
}

  /** *********************** Methods to Edit objects ****************************** */

  editModule(){
    console.log(this.editedModule);
    this.moduleService.editModule(this.selectedModuleId, this.editedModule.name , this.editedModule.description ).subscribe(()=>{
      this.router.navigate(['/modules',this.selectedModuleId])
    })

  }
  editCourse(){
    console.log(this.editedCourse);
    this.courseService.editCourse(this.selectedModuleId,this.selectedCourseId, this.editedCourse.title , this.editedCourse.objectif ).subscribe(()=>{
      this.router.navigate(['/modules/'+this.selectedModuleId+'/courses/'+this.selectedCourseId]);
    })

  }
  editContent(title : string , type : string , link : string){
    this.contentService.editContent(this.selectedModuleId,this.selectedCourseId, this.selectedContentId ,title,type,link ).subscribe(()=>{
      this.router.navigate(['/modules/'+this.selectedModuleId+'/courses/'+this.selectedCourseId]);
    })

  }


}
