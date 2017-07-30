'use strict';

angular.module('confusionApp')//, ['ngFileUpload'])

.controller('MainController', ['$rootScope','$scope','$state', 'studentFactory' ,'subjectFactory', function ($rootScope,$scope,$state, studentFactory,subjectFactory) {
	//$rootScope.baseURL="http://localhost:3000/";
	$rootScope.baseURL="https://collegeserver.mybluemix.net/";
	$scope.showHome=true;
	$scope.showStudents=false;
	$scope.showLibrary=false;
	$scope.HomeStyle = {"background-color":"#C8C8C8"};
	$scope.StudentStyle = {"background-color":'#888888'};
	$scope.LibraryStyle = {"background-color":'#888888'};
	$scope.showHomeFunc = function(){
		console.log('inside showHomeFunc');
		$scope.showHome=true;
		$scope.showStudents=false;
		$scope.showLibrary=false;
		$scope.HomeStyle = {"background-color":'#C8C8C8'};
		$scope.StudentStyle = {"background-color":'#888888'};
		$scope.LibraryStyle = {"background-color":'#888888'};
	};
	$scope.showStudentsFunc = function(){
		$scope.showHome=false;
		$scope.showStudents=true;
		$scope.showLibrary=false;
		$scope.HomeStyle = {"background-color":'#888888'};
		$scope.StudentStyle = {"background-color":'#C8C8C8'};
		$scope.LibraryStyle = {"background-color":'#888888'};
	};
	$scope.showLibraryFunc = function(){
		$scope.showHome=false;
		$scope.showStudents=false;
		$scope.showLibrary=true;
		$scope.HomeStyle = {"background-color":'#888888'};
		$scope.StudentStyle = {"background-color":'#888888'};
		$scope.LibraryStyle = {"background-color":'#C8C8C8'};
	};
}])

//admin add
.controller('EnterStudentController', ['$scope', '$rootScope' ,'$state', '$timeout', 'studentFactory' ,'subjectFactory', 'Upload', '$window' ,function ($scope ,$rootScope ,$state,$timeout , studentFactory,subjectFactory ,Upload, $window) {

	$scope.showStudAlertSuccess=false;
	$scope.showStudAlertWarn=false;
	$scope.AddSubAlertSuccess=false;
	$scope.AddSubAlertWarn=false;
	$scope.DelSubAlertSuccess=false;
	$scope.DelSubAlertWarn=false;
	$scope.DelStudAlertSuccess=false;
	$scope.DelStudAlertWarn=false;
	$scope.student={
		_id: "",
        name: "",
        branch: "",
        sem: "",
        year_of_join: ""
	};
	//Add Student
	$scope.addStudent =function (){
		console.log('inside addStudent');
		/*console.log('$scope.addStudentFrom.file.$valid:');
		console.dir($scope.addStudentFrom.file.$valid);
		console.log('$scope.student.file:');
		console.dir($scope.student.file);
		if ($scope.addStudentFrom.file.$valid && $scope.student.file) {
			console.log('inside file valid');
			$scope.upload($scope.student.file);
		}*/
		var res=studentFactory.save($scope.student).$promise.then(
            function (response) {
				console.log('added student succesfuly');
				$scope.showStudAlertSuccess=true; 
				$timeout(function () { $scope.showStudAlertSuccess = false; }, 3000); 
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
				console.log('failed to add student');
				$scope.showStudAlertWarn=true; 
				$timeout(function () { $scope.showStudAlertWarn = false; }, 3000); 
            }
        );
		console.log('res:');
		console.dir(res);
		$scope.student={
		_id: "",
        name: "",
        branch: "",
        sem: "",
        year_of_join: "",
		file: "",
		};
		$scope.addStudentFrom.$setPristine();
	};
	$scope.subject = {
		name:"",
		attendance:"",
		marks:""
    };

	$scope.showModify = false;
	$scope.showAddSub = false;
	$scope.addModStudReg;
	$scope.addModStudent;
	//show ModifySubjectsForm
 	$scope.addModStud = function() {
		console.log('addModStudReg:'+$scope.addModStudReg);
		$scope.fetchStudent=studentFactory.get({id : $scope.addModStudReg})
        .$promise.then(
            function (response,respHeader) {
				console.log('resp header:');
				console.dir(respHeader);
				console.log('inside addModStud function');
				$scope.showAddSub = false;
				$scope.showModify = true;
				$scope.addModStudent=response;//[0];
				console.log('response:');
				console.dir(response);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
				$scope.showModify = false;
            }
        );
	};
	//show addSubject form
	$scope.addSubject = function(){
		$scope.showModify = false;
		$scope.showAddSub = true;
	};
	$scope.forms = {};
	//add new subject
	$scope.addSubjectDetail = function () {

		subjectFactory.save({id: $scope.addModStudReg}, $scope.subject).$promise.then(
            function (response) {
				console.log('added subject succesfuly');
				$scope.AddSubAlertSuccess=true; 
				$timeout(function () { $scope.AddSubAlertSuccess = false; }, 3000); 
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
				console.log('failed to add student');
				$scope.AddSubAlertWarn=true; 
				$timeout(function () { $scope.AddSubAlertWarn = false; }, 3000); 
            }
        );

		//$state.go($state.current, {}, {reload: true});
		
		$scope.forms.addSubjectForm.$setPristine();

		$scope.subject = {
		name:"",
		attendance:"",
		marks:""
		};
    };
	//modifies subject details
	$scope.ModStudSubj = function(subs){
		console.log('subs');
		console.dir(subs);
		var subjson={};
		subjson.attendance=subs.attendance;
		subjson.marks=subs.marks;
		subjson.name=subs.name;
		console.log('subject json created:');
		console.dir(subjson);
		console.log('type of subject:'+ typeof $scope.subject);
		subjectFactory.update({id: $scope.addModStudReg, subjectId: subs._id}, JSON.stringify(subjson));
		//subjectFactory.update({id: $scope.addModStudReg, subjectId: subId}, $scope.subject);
	};
	//remove subject details
	$scope.DelStudSubj = function(subs){
		var subjson={};
		subjson.attendance=subs.attendance;
		subjson.marks=subs.marks;
		subjson.name=subs.name;
		subjectFactory.remove({id: $scope.addModStudReg, subjectId: subs._id}, JSON.stringify(subjson)).$promise.then(
            function (response) {
				$scope.addModStudent=response;//[0];
				console.log('deleted subject succesfuly');
				$scope.DelSubAlertSuccess=true; 
				$timeout(function () { $scope.DelSubAlertSuccess = false; }, 3000); 
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
				console.log('failed to delete subject');
				$scope.DelSubAlertWarn=true; 
				$timeout(function () { $scope.DelSubAlertWarn = false; }, 3000); 
            }
        );
	};
	//delete student
	$scope.DeleteStud = function(){
		studentFactory.remove({id : $scope.DelStudReg})
        .$promise.then(
            function (response) {
				console.log('deleted student succesfuly');
				$scope.DelStudAlertSuccess=true; 
				$timeout(function () { $scope.DelStudAlertSuccess = false; }, 3000); 
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
				console.log('failed to delete student');
				$scope.DelStudAlertWarn=true; 
				$timeout(function () { $scope.DelStudAlertWarn = false; }, 3000); 
            }
        );
	};

	$scope.upload = function($file) {
		console.log('upload');
		var file=$file;
    //$files: an array of files selected, each file has name, size, and type.
    //for (var i = 0; i < $files.length; i++) {
      /*var file = $file;//$files[i];
      $scope.upload = $upload.upload({
        url: 'server/upload/url', //upload.php script, node.js route, or servlet url
        data: {myObj: $scope.myModelObj},
        file: file,
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      });*/
    //}
		/*var uploadUrl = "/multer";
        var fd = new FormData();
        fd.append('file', $file);

        $http.post(uploadUrl,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
          console.log("success!!");
        })
        .error(function(){
          console.log("error!!");
        });*/
		//uploadFactory.uploadFile();
		Upload.upload({
                url: $rootScope.baseURL+"upload",//'http://localhost:3000/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
	};
	
}])

//admin shhow
.controller('showStudentController', ['$scope', 'studentFactory' ,'AuthFactory' , function ($scope, studentFactory,AuthFactory) {

	$scope.showStudents=false;
    $scope.message = "Loading ...";
	$scope.sem=0;
	$scope.branch=0;
	$scope.studentsQuery=studentFactory.query()
        .$promise.then(
            function (response) {
                $scope.students = response;
				$scope.showStudents=true;
				console.log('student', $scope.students);
				console.dir($scope.students);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	/*$scope.SemSelect =function(){
		$scope.studentsQuery=studentFactory.query()
        .$promise.then(
            function (response) {
                $scope.students = response;
				$scope.showStudents=true;
				console.log('student', $scope.students);
				console.dir($scope.students);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
	}*/
}])

//student profile
.controller('StudentDetailController', ['$rootScope','$scope', 'studentFactory' ,'AuthFactory' , function ($rootScope,$scope, studentFactory,AuthFactory) {
    $scope.showDish = false;
	$scope.showStudent=false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
	$scope.profileimage = false;//$rootScope.baseURL+"f.jpg";//"/uploads/f.jpg";
	//
	var regNo=AuthFactory.getUsername();
	console.log('regNo', regNo);
	$scope.students=studentFactory.get({id : regNo})
        .$promise.then(
            function (response) {
                var students = response;
				console.log('students');
				console.dir(students);
                $scope.student = students;//[0];//students[regNo-1];
				$scope.showStudent=true;
				console.log('student', $scope.student);
				console.dir($scope.student);
				$scope.profileimage=$rootScope.baseURL+regNo+".JPG";
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
}])

//student attendance
.controller('SubjectDetailController', ['$scope', 'studentFactory' ,'AuthFactory' ,  function ($scope, studentFactory,AuthFactory) {

	$scope.showStudent=false;
	var regNo=AuthFactory.getUsername();
	$scope.students=studentFactory.get({id : regNo})
        .$promise.then(
            function (response) {
                var students = response;
				console.log('student in SubjectDetailController');
				console.dir(students);
                $scope.student = students;//[0];
				$scope.showStudent=true;
				//console.log('student', $scope.student);
				//console.dir($scope.student);
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

	$scope.isAdmin = false;
    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
		$scope.isAdmin = AuthFactory.CheckAdmin();
		console.log('isAdmin-->'+$scope.isAdmin);
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
		$state.go('app');
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
		$scope.isAdmin = AuthFactory.CheckAdmin();
		console.log('isAdmin-->'+$scope.isAdmin);
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
		$scope.isAdmin = AuthFactory.CheckAdmin();
		console.log('isAdmin-->'+$scope.isAdmin);
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;