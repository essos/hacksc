$().ready(function() {

	//variables to be maintained across requests...
	var theEvent;
	
	var STATE = {
		HOMEPAGE :		'homePage',
		CREATEFORM :	'createForm',
		JOINFORM :		'joinForm',
		LISTENERPAGE :	'listenerPage',
		HOSTPAGE :		'hostPage'
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
				sendJoinRequest();
				break;
			default: break;
		}
	}

	function updateHTML(doDetails, doQueue, doSongs, doReco) {
		if (doDetails) {
			//Add event details header...
			listenerPage.find('#event-name').append(theEvent.name);
			listenerPage.find('#event-loc').append(theEvent.location);
			listenerPage.find('#event-desc').append(theEvent.desc);
		}

		if (doQueue) {
			//populate current queue...
			$.each(theEvent.queued, function(idx, songID) {	
				var song = $.grep(theEvent.songs, function(song) {
					return song.song_id == songID;
				})[0];

				console.log(song);

				listenerPage
					.find('#current-queue')
					.append(
						'<li class="als-item">' +
						song.name +
						'</li>'
					);
			});
		}

		if (doSongs) {
			//Add song list...
			$.each(theEvent.songs, function(idx, song) {
				listenerPage
					.find('#song-list')
					.append(
						'<li class="list-group-item">' +
						song.name +
						'</li>'
					);
			});
		}

		if (doReco) {
			//Add recommendation list...
			$.each(theEvent.recommendation_list, function(idx, songID) {
				var song = $.grep(theEvent.songs, function(song) {
					return song.song_id == songID;
				})[0];

				console.log(song);

				listenerPage
					.find('#reco-song-list')
					.append(
						'<li class="list-group-item">' + song.name + '</li>' +
						'<span class="badge">' + song.rating + '</span>'
					);
			});
		}
	}

	/*
	 * Define all request senders...
	 */

	function sendJoinRequest() {
		if (!$('#event-id').val()) {
			//TODO: error handling...
			alert("Please provide your host's event ID...");
			return;
		}

		var url = 'http://localhost:3000/listener/get_event?event_id=' + $('#event-id').val();
		$.ajax({
			dataType:	'json',
			url :		url,
			context:	this
		}).done(function(data) {

			theEvent = data;
			console.log("Testing");
			updateHTML(true, true, true, true);
			console.log(STATE);
			setState(STATE.LISTENERPAGE);

		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown.message);
		});
	}

	function sendRecommendSong(song) {
		$.ajax({
			url: 'http://107.170.244.25/recomend?song_id=' + song.attr('id')
		}).done(function(reco) {

			theEvent.recommendation_list = $.parseJSON(reco);
			updateHTML(false, false, false, true);
			setState(STATE.LISTENERPAGE);

		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert(errorThrown.message);
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
			shiftState(STATE.CREATEFORM);
		} else {
			shiftState(STATE.JOINFORM);
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
			shiftState(STATE.HOMEPAGE);
		}
		
		return false;
	});

	var joinForm = $();
	$.each($.parseHTML('\
		<h1 class="cover-heading">Join an Event</h1>\
		<p class="lead">Just enter the event ID and join it!!!</p>\
		<form role="form" id="join-event-form">\
			<div class="form-group">\
				<label>Event ID</label>\
				<input type="text" class="form-control" id="event-id" placeholder="Enter ID">\
			</div>\
			<button type="button" class="btn btn-default" id="join-submit">Submit</button>\
			<button type="button" class="btn btn-default" id="join-cancel">Cancel</button>\
		</form>'
	), function(index, node) {
		joinForm = joinForm.add(node);
	});
	joinForm.find(".btn").click(function() {
		if ($(this).attr('id') == 'join-submit') {
			shiftState(STATE.LISTENERPAGE);
		} else {
			shiftState(STATE.HOMEPAGE);
		}
		
		return false;
	});

	var listenerPage = $();
	$.each($.parseHTML('\
		<div class="content-head row"> \
			<h1 id="event-name"></h1>\
			<h3 class="text-muted">at </h3><h3 id="event-loc"></h3>\
			<p id="event-desc"></p>\
			<button type="button" class="btn btn-default pull-right" id="leave-event">Leave</button>\
		</div>\
		<div class="als-container" id="current-queue-container">\
			<span class="als-prev"><img src="images/prev.png" alt="prev" title="previous" /></span>\
			<div class="als-viewport">\
				<ul class="als-wrapper" id="current-queue">\
				</ul>\
			</div>\
			<span class="als-next"><img src="images/next.png" alt="next" title="next" /></span>\
		</div>\
		<div class="row">\
			<div class="col-md-6">\
				<ul class="list-group" id="song-list">\
					<li class="list-group-item">\
						<input type="text" class="form-control" placeholder="Search" name="srch-term" id="srch-term">\
					</li>\
				</ul>\
			</div>\
			<div class="col-md-6">\
				<ul class="list-group">\
				</ul>\
			</div>\
		</div>'
	), function(index, node) {
		listenerPage = listenerPage.add(node);
	});
	listenerPage.find('#current-queue-container').als();
	listenerPage.find('#leave-event').click(function() {
		//remove song list...
		theEvent = undefined;
		shiftState(STATE.HOMEPAGE);
	});

	//set initial state...
	updateState();
});
