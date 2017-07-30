'use strict';

angular.module('confusionApp', ['ui.router','ngResource','ngDialog','ngFileUpload'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
						templateUrl : 'views/Main.html',
                        controller  : 'MainController'
                        
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for student subject details
            .state('app.subject', {
                url:'subject',
                views: {
                    'content@': {
                        templateUrl : 'views/subjectdetail.html',
                        controller  : 'SubjectDetailController'                  
                    }
                }
            })
        
            // route for admin enter details
            .state('app.adddetail', {
                url:'adddetail',
                views: {
                    'content@': {
                        templateUrl : 'views/enterstudent.html',
                        controller  : 'EnterStudentController'                  
                    }
                }
            })
        
            // route for student general profile
            .state('app.profile', {
                url: 'profile',
                views: {
                    'content@': {
                        templateUrl : 'views/studentdetail.html',
                        controller  : 'StudentDetailController'
                   }
                }
            })
			
			// route for admin get details
            .state('app.getstudents', {
                url: 'getstudents',
                views: {
                    'content@': {
                        templateUrl : 'views/showStudents.html',
                        controller  : 'showStudentController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
