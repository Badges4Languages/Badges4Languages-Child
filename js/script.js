/*
	This is the file that contain my JS functions.
*/

//Toggle button to display or not (by clicking) the search form in the archive badge page
function toggle_filter_form() {
    var x = document.getElementById("filter-form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

//Toggle button to display or not (by clicking) the form to add a new passport in the archive passport page
function toggle_passport_form() {
    var x = document.getElementById("add-passport-form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

/////////////////////////
//       PASSPORT      //
/////////////////////////

//Add a new passport
var btnAddPassport = "#new-passport-form";
jQuery(document).on("submit", btnAddPassport, function (event) {
    jQuery(btnAddPassport).prop('disabled', true);
    event.preventDefault();

    //Get all the information from the add a passport form
    var title = jQuery("#passportTitle").val();
    var userID = jQuery("#user").val();
    var e = document.getElementById("passportLanguage");
	var language = e.options[e.selectedIndex].value;
	var functionUrl = ajax_function_path.ajaxFunctionURL;

	//Check if the title is set
	if( title == '' ){
		jQuery("#error-content").html('Please enter a title.');
	} 
	//Check if a language is selected
	else if( language == 'Select' ){
		jQuery("#error-content").html('Please select a language.');
	} 
	//Check if a user is well logged in
	else if( userID == null ){
		jQuery("#error-content").html('No user.');
	} else{
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/passport-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'insert_passport',
		    	passportTitle: title, 
		    	passportLanguage: language,
		    	passportStudent: userID
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We redirect to the single passport just created
                	window.location.href = obj.redirectLink;
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		});
	}
});

//Save the passport
var btnSavePassport = "#save-passport-form";
jQuery(document).on("submit", btnSavePassport, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnSavePassport).prop('disabled', true);
    event.preventDefault();

    //Get all the information from the update a passport form
    var e = document.getElementsByName("passport[]");
    var checkedValues = [];
    var id = jQuery("#postID").val();
    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This passport doesn\'t exist.');
	} else {

		//Get the checked checkbox in the form
		for(var i=0; e[i]; ++i){
	        if(e[i].checked){
	      		checkedValues.push( e[i].value );
	      	}
		}

		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/passport-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'update_passport',
		    	passportChecked: checkedValues, 
		    	post: id
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We refresh the page to display the right results
                	location.reload();
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		});


	}  
});

//Delete the passport
var btnDeletePassport = "#delete-passport-form";
jQuery(document).on("submit", btnDeletePassport, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnDeletePassport).prop('disabled', true);
    event.preventDefault();

    //Get all the information necessary to delete a passport
    var id = jQuery("#postID").val();
    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This passport doesn\'t exist.');
	} else {
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/passport-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'delete_passport',
		    	post: id
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We redirect to the archive passport page
                	window.location.href = obj.redirectLink;
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		});


	}  
});

//Upload thumbnail's passport
var btnThumbnailPassport = "#thumbnail-passport-form";
jQuery(document).on("submit", btnThumbnailPassport, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnThumbnailPassport).prop('disabled', true);
    event.preventDefault();

    //Get all the information to upload a new passport thumbnail
    var id = jQuery("#postID").val();
    var files = document.getElementById('thumbnail').files

    //Create a FormData to pass data to ajax file (necessary to pass the file uploaded)
    var data = new FormData();
    jQuery.each(files, function(key, value)
    {
        data.append(key, value);
    });
    data.append("functionname", "passport_thumbnail");
    data.append("post", id); 

    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This passport doesn\'t exist.');
	} 
	//Check if a file is well selected
	else if (typeof files == 'undefined' || files.length <= 0) {
		jQuery("#error-content").html('Please select a file.');
	} else {
		jQuery("#result_upload_files").html("Please wait. Uploading...");
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/passport-ajax.php",
		    dataType: 'json',
		    data: data,
		    cache: false,
		    processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We refresh the page to display the right thumbnail
                    location.reload();
	            }
	            else {
	                jQuery("#result_upload_files").html(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#result_upload_files").html("AJAX ERROR");
       		}
		});

	}  
});

//Delete thumbnail's portfolio
var btnDeleteThumbnailPortfolio = "#delete_thumbnail_portfolio_button";
jQuery(document).on("click", btnDeleteThumbnailPortfolio, function (event) {
	thumb_name = jQuery("#thumbnail_name").val();
	thumb_id = jQuery("#thumbnail_id").val();
	var data = new FormData();

	data.append("functionname", "action_delete_thumb");
	data.append("thumbnail_name", thumb_name);
	data.append("thumbnail_id", thumb_id);

	var functionUrl = ajax_function_path.ajaxFunctionURL;

	jQuery.ajax({
	    url: functionUrl+"/passport-ajax.php",
	    type: 'POST',
	    data: data,
	    cache: false,
	    dataType: 'json',
	    processData: false, // Don't process the files
	    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	    success: function(data, textStatus, jqXHR)
	    {
	        if(typeof data.error === 'undefined')
	        {
	            location.reload();
	        }
	        else
	        {
	            // Handle errors here
	            jQuery("#result_upload_thumbnail").html(data.error);
	        }
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	        // Handle errors here
	        console.log('ERRORS: ' + textStatus);
	        jQuery("#result_upload_thumbnail").html('AJAX ERROR');
	    }
	});
});

//////////////////////////////
//  TEACHER PROFILING GRID  //
//////////////////////////////

//Add a new teacher profiling grid
var btnAddTeacherPG = "#new-teacher-PG-form";
jQuery(document).on("submit", btnAddTeacherPG, function (event) {
    jQuery(btnAddTeacherPG).prop('disabled', true);
    event.preventDefault();

    //Get all the information from the add a PG form
    var title = jQuery("#teacherPGTitle").val();
    var userID = jQuery("#user").val();
    var e = document.getElementById("teacherPGLanguage");
	var language = e.options[e.selectedIndex].value;
	var functionUrl = ajax_function_path.ajaxFunctionURL;

	//Check if the title is set
	if( title == '' ){
		jQuery("#error-content").html('Please enter a title.');
	} 
	//Check if a language is selected
	else if( language == 'Select' ){
		jQuery("#error-content").html('Please select a language.');
	} 
	//Check if a user is well logged in
	else if( userID == null ){
		jQuery("#error-content").html('No user.');
	} else{
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/teacher-PG-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'insert_teacherPG',
		    	teacherPGTitle: title, 
		    	teacherPGLanguage: language,
		    	PGTeacher: userID
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We redirect to the single PG just created
                	window.location.href = obj.redirectLink;
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		});
	}
});

//Save the profiling grid
var btnSaveTeacherPG = "#save-teacher-form";
jQuery(document).on("submit", btnSaveTeacherPG, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnSaveTeacherPG).prop('disabled', true);
    event.preventDefault();

    //Get all the information from the update a profiling grid form
    var e = document.getElementsByName("teacher_portfolio[]");
    var checkedValues = [];
    var id = jQuery("#postID").val();
    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This profiling grid doesn\'t exist.');
	} else {

		//Get the checked checkbox in the form
		for(var i=0; e[i]; ++i){
	        if(e[i].checked){
	      		checkedValues.push( e[i].value );
	      	}
		}

		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/teacher-PG-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'update_teacherPG',
		    	teacherPGChecked: checkedValues, 
		    	post: id
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We refresh the page to display the right results
                	location.reload();
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		});


	}  
});

//Delete the teacher profiling grid
var btnDeleteTeacherPG = "#delete-teacher-PG-form";
jQuery(document).on("submit", btnDeleteTeacherPG, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnDeleteTeacherPG).prop('disabled', true);
    event.preventDefault();

    //Get all the information necessary to delete a PG
    var id = jQuery("#postID").val();
    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This teacher profiling grid doesn\'t exist.');
	} else {
		jQuery("#error-content").html('blblblblbl');
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/teacher-PG-ajax.php",
		    dataType: 'json',
		    data: {
		    	functionname: 'delete_teacherPG',
		    	post: id
		    },
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We redirect to the archive PG page
                	window.location.href = obj.redirectLink;
	            }
	            else {
	                console.log(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#error-content").html("AJAX ERROR");
       		}
		})

	}  
});

//Upload thumbnail's profiling grid
var btnThumbnailPG = "#thumbnail-PG-form";
jQuery(document).on("submit", btnThumbnailPG, function (event) {
	jQuery("#error-content").html( '' );
    jQuery(btnThumbnailPG).prop('disabled', true);
    event.preventDefault();

    //Get all the information to upload a new profiling grid thumbnail
    var id = jQuery("#postID").val();
    var files = document.getElementById('thumbnail').files

    //Create a FormData to pass data to ajax file (necessary to pass the file uploaded)
    var data = new FormData();
    jQuery.each(files, function(key, value)
    {
        data.append(key, value);
    });
    data.append("functionname", "PG_thumbnail");
    data.append("post", id); 

    var functionUrl = ajax_function_path.ajaxFunctionURL;

    //Check if the post well exist
    if( id == null ){
		jQuery("#error-content").html('This profiling grid doesn\'t exist.');
	} 
	//Check if a file is well selected
	else if (typeof files == 'undefined' || files.length <= 0) {
		jQuery("#error-content").html('Please select a file.');
	} else {
		jQuery("#result_upload_thumbnail").html("Please wait. Uploading...");
		jQuery.ajax({
		    type: "POST",
		    url: functionUrl+"/teacher-PG-ajax.php",
		    dataType: 'json',
		    data: data,
		    cache: false,
		    processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		    success: function (obj, textstatus) {
		    	//If there is no error
                if( !('error' in obj) ) {
                	//We refresh the page to display the right thumbnail
                    location.reload();
	            }
	            else {
	                jQuery("#result_upload_thumbnail").html(obj.error);
	            }
            },
            error : function(resultat, statut, erreur){
            	jQuery("#result_upload_thumbnail").html("AJAX ERROR");
       		}
		});

	}  
});

//Delete an evidence
var btnDeleteEvidence = "#delete_evidence_button";
jQuery(document).on("click", btnDeleteEvidence, function (event) {
	tab = jQuery(this).attr('name');
	id = jQuery("#post_ID").val();
	var data = new FormData();

	data.append("functionname", "action_delete_evidence");
	data.append("post_ID", id);
	data.append("tab", tab);
	data.append("type_user", "teacher-files");

	var functionUrl = ajax_function_path.ajaxFunctionURL;

	jQuery.ajax({
	    url: functionUrl+"/teacher-PG-ajax.php",
	    type: 'POST',
	    data: data,
	    cache: false,
	    dataType: 'json',
	    processData: false, // Don't process the files
	    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	    success: function(data, textStatus, jqXHR)
	    {
	        if(typeof data.error === 'undefined')
	        {
	        	var file_string = data.file;

	            jQuery("#result_delete_evidence").html(
	              "File deleted : <br />"+file_string
	            );

	            location.reload();
	        }
	        else
	        {
	            // Handle errors here
	            jQuery("#result_delete_evidence").html(data.error);
	        }
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	        // Handle errors here
	        console.log('ERRORS: ' + textStatus);
	        jQuery("#result_delete_evidence").html('isqudhfqisudhfqoisudh');
	    }
	});
});

//Upload and save the file for an evidence
var btnUploadEvidence = "#upload_files_button";
jQuery(document).on("click", btnUploadEvidence, function (event) {
	tab = jQuery(this).attr('name');
	id = jQuery("#post_ID").val();
	
	var files = document.getElementById('evidence').files
	var data = new FormData();
	jQuery.each(files, function(key, value)
    {
        data.append(key, value);
    });
	data.append("functionname", "action_upload_evidence");
	data.append("post_ID", id);
	data.append("tab", tab);
	data.append("type_user", "teacher-files");

	var functionUrl = ajax_function_path.ajaxFunctionURL;

	if (typeof files == 'undefined' || files.length <= 0) {
        jQuery("#error_content").html('Please select a file.');
    } else {
        jQuery("#error_content").html("Please wait. Uploading...");
        jQuery.ajax({
            url: functionUrl+"/teacher-PG-ajax.php",
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: function(data, textStatus, jqXHR)
            {
            	jQuery("#error_content").html('');
                if(typeof data.error === 'undefined')
                {
                    var files_string = "";
                    data.files.forEach(function(element){
                        files_string = files_string + element + "<br />";
                    });

                    jQuery("#result_upload_files").html(
                      "File uploaded : <br />"+files_string
                    );

                    location.reload();
                }
                else
                {
                    // Handle errors here
                    jQuery("#error_content").html(data.error);
                    console.log('ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                // Handle errors here
                jQuery("#error_content").html('ERRORS: ' + textStatus);
                console.log('ERRORS: ' + textStatus);
                // STOP LOADING SPINNER
            }
        });
    }
});

//Delete thumbnail's profiling grid
var btnDeleteThumbnail = "#delete_thumbnail_button";
jQuery(document).on("click", btnDeleteThumbnail, function (event) {
	thumb_name = jQuery("#thumbnail_name").val();
	thumb_id = jQuery("#thumbnail_id").val();
	var data = new FormData();

	data.append("functionname", "action_delete_thumbnail");
	data.append("thumbnail_name", thumb_name);
	data.append("thumbnail_id", thumb_id);

	var functionUrl = ajax_function_path.ajaxFunctionURL;

	jQuery.ajax({
	    url: functionUrl+"/teacher-PG-ajax.php",
	    type: 'POST',
	    data: data,
	    cache: false,
	    dataType: 'json',
	    processData: false, // Don't process the files
	    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	    success: function(data, textStatus, jqXHR)
	    {
	        if(typeof data.error === 'undefined')
	        {
	            location.reload();
	        }
	        else
	        {
	            // Handle errors here
	            jQuery("#result_upload_thumbnail").html(data.error);
	        }
	    },
	    error: function(jqXHR, textStatus, errorThrown)
	    {
	        // Handle errors here
	        console.log('ERRORS: ' + textStatus);
	        jQuery("#result_upload_thumbnail").html('AJAX ERROR');
	    }
	});
});