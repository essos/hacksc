//Add events...

$().ready(function() {

	var homePage = $();
	$.each($.parseHTML('\
		<h1 class="cover-heading">Cover your page.</h1>\
		<p class="lead">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>\
		<p class="lead">\
			<a class="btn btn-lg btn-default" id="host-btn">Host an Event</a>\
			<a class="btn btn-lg btn-default" id="join-button">Join an Event</a>\
		</p>'
	), function(index, node) {
		homePage = homePage.add(node);
	});
	homePage.find(".btn").click(function() {
		if ($(this).attr('id') == 'host-btn') {
			$("#main-content").empty().append(createForm);
		} else {
			$("#main-content").empty().append(joinForm);
		}
		
		return false;
	});
	var html = homePage.outerHTML

	var createForm = $();
	$.each($.parseHTML('\
		<h1 class="cover-heading">Create an Event</h1>\
		<p class="lead">Just fill the form below and provide a list of songs and you are good to go!!!</p>\
		<div class="form-wrapper">\
			<form role="form">\
				<div class="form-group">\
					<label>Event Name</label>\
					<input type="text" class="form-control" id="event_name" placeholder="Enter name">\
					<label>Location</label>\
					<input type="text" class="form-control" id="event_location" placeholder="Enter location">\
					<label>Description</label>\
					<textarea class="form-control" id="event_desc" placeholder="Enter desc" rows="3"></textarea>\
				</div>\
				<div class="form-group">\
					<label>File input</label>\
				<input type="file" id="event_songlist" multiple>\
				</div>\
				<button type="button" class="btn btn-default" id="create-submit">Submit</button>\
				<button type="button" class="btn btn-default" id="create-cancel">Cancel</button>\
			</form>\
		</div>'
	), function(index, node) {
		createForm = createForm.add(node);
	});
	createForm.find(".btn").click(function() {
		if ($(this).id == 'create-submit') {
			alert("Create Event!!!");
		} else {
			$("#main-content").empty().append(homePage);
		}
		
		return false;
	});

	var joinForm = $();
	$.each($.parseHTML('<h1 class="cover-heading">Join an Event</h1><p class="lead">Just enter the event ID and join it!!!</p><form role="form"><div class="form-group"><label>Event ID</label><input type="text" class="form-control" id="event_name" placeholder="Enter ID"></div><button type="button" class="btn btn-default" id="join-submit">Submit</button><button type="button" class="btn btn-default" id="join-cancel">Cancel</button></form>'
	), function(index, node) {
		joinForm = joinForm.add(node);
	});
	homePage.find(".btn").click(function() {
		if ($(this).attr('id') == 'join-submit') {
			alert("Join Event!!!");
		} else {
			setState(STATE.HOME);
		}
		
		return false;
	});

	var STATE = {
		HOME : homePage,
		CREATEFORM : createForm,
		JOINFORM : joinForm
	}

	function updateState() {
		var state = $.cookies.get('ui_state');
		if (state == null) {
			$.cookies.set('ui_state', STATE.HOME);
			$("#main-content").empty().append(STATE.HOME);
		} else {
			$("#main-content").empty().append(state);
		}
	}

	function setState(newState) {
		$.cookies.set('ui_state', state);
		updateState();
	}

	//set initial state...
	updateState();
});
