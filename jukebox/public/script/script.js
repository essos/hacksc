//Add events...

$().ready(function() {

	/*
	 * Define all request senders...
	 */

	function sendJoinRequest() {
		$.ajax({
			url: 'getevent?event_id=' + $('#event_id').val()
		}).done(function(theEvent) {
			//TODO: Add event details header...
			//populate current queue...
			$.each(theEvent, function(idx, songID) {	
				listenerPage
					.find('#current-queue')
					.append(
						'<li class="als-item">' +
						$.grep(
							theEvent.songs,
							function(song) {
								return song.id == songID;
							}) +
						'</li>'
					);
			});
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert(textStatus);
		});
	}

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
			setState(STATE.CREATEFORM);
		} else {
			setState(STATE.JOINFORM);
		}
		
		return false;
	});

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
		if ($(this).attr('id') == 'create-submit') {
			alert("Create Event!!!");
		} else {
			setState(STATE.HOMEPAGE);
		}
		
		return false;
	});

	var joinForm = $();
	$.each($.parseHTML('\
		<h1 class="cover-heading">Join an Event</h1>\
		<p class="lead">Just enter the event ID and join it!!!</p>\
		<form role="form">\
			<div class="form-group">\
				<label>Event ID</label>\
				<input type="text" class="form-control" id="event_id" placeholder="Enter ID">\
			</div>\
			<button type="button" class="btn btn-default" id="join-submit">Submit</button>\
			<button type="button" class="btn btn-default" id="join-cancel">Cancel</button>\
		</form>'
	), function(index, node) {
		joinForm = joinForm.add(node);
	});
	joinForm.find(".btn").click(function() {
		if ($(this).attr('id') == 'join-submit') {
			setState(STATE.LISTENERPAGE);
		} else {
			setState(STATE.HOMEPAGE);
		}
		
		return false;
	});

	var listenerPage = $();
	$.each($.parseHTML('\
		<div class="als-container" id="current-queue-container">\
			<span class="als-prev"><img src="images/prev.png" alt="prev" title="previous" /></span>\
			<div class="als-viewport">\
				<ul class="als-wrapper" id="current-queue">\
				</ul>\
			</div>\
			<span class="als-next"><img src="images/next.png" alt="next" title="next" /></span>\
		</div>'
	), function(index, node) {
		listenerPage = joinForm.add(node);
	});
	listenerPage.find("#current-queue-container").als();

	var STATE = {
		HOMEPAGE : 'homePage',
		CREATEFORM : 'createForm',
		JOINFORM : 'joinForm',
		LISTENERPAGE : 'listenerPage'
	}

	function UpdateData(newState) {
		switch (newState) {
			case STATE.HOMEPAGE:
				setState(newState);
				break;
			case STATE.CREATEFORM:l
				setState(newState);
				break;
			case STATE.JOINFORM:
				setState(newState);
				break;
			case STATE.LISTENERPAGE:
				SendJoinRequest();
				break;
			default: break;
		}
	}

	function updateState() {
		var state = $.cookies.get('ui_state');
		$("#main-content").children().detach()
		if (state == null) {
			$.cookies.set('ui_state', STATE.HOMEPAGE);
			$("#main-content").append(eval(STATE.HOMEPAGE));
		} else {
			$("#main-content").append(eval(state));
		}
	}

	function setState(newState) {
		$.cookies.set('ui_state', newState);
		updateState();
	}

	function shiftState(newState) {
		UpdateData(newState);
	}

	//set initial state...
	updateState();
});
