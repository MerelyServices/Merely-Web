let dhelp;
let special = ['clear_failed', 'serverowner'];

$(document).ready(function(){
	$.ajax({
		//url:'/api/bot/dhelp',
		url: '/offline.json',
		success:function(data){
			dhelp = data;
			loadmodal();
		},
		error:function(data){
			console.error(data);
			fillmodal('error', 'failed to retrieve command! refresh the page to try again', false);
			$('#cmdnfo').modal('show');
		}
	});

	// Disable connection to merelybot for now
	//getstats();
	//window.setInterval(function(){getstats();},5000);
});
$(window).bind('hashchange',function(){
	loadmodal();
});

function loadmodal(){
	let target = window.location.hash;
	
	if(dhelp && target.startsWith('#/')){
		target = target.substring(2);
		if(target in dhelp) {
			fillmodal(target, dhelp[target]);
		}else if(special.includes(target)) {
			fillmodal(target, null);
		}else{
			fillmodal('error', 'the command specified could not be found!', false)
		}
		$('#cmdnfo').modal('show');
	}
}

function fillmodal(title, content, video=true){
	$('#cmdname').text(title);
	if(!special.includes(title)){
		var formattedcontent = [], i = 0;

		content = content
		.replace(/\{p\:(?:local|global)\}/, 'm/')
		.replace('{c:main/botname}', 'merelybot')
		.replace('{cmd}', title)
		.replace(/`([^`]*)`/g, `<code>$1</code>`);

		content.split('\n').forEach(line => {
			if(i == 0) formattedcontent.push(`<b>${line}</b>`);
			else if(i == 1) formattedcontent.push(line);
			else formattedcontent.push(`<i>${line}</i>`);
			i++;
		});

		$('#cmddescription').html(formattedcontent.join('<br>'));
		if(video) {
			$('#cmddescription').append('\
			<video width="720" height="360" playsinline autoplay muted loop controls>\
				<source src="/videotuts/'+title+'.mp4" type="video/mp4">\
				the merely tutorial videos are unable to play on your device\
			</video>\
			<sub>Note: contents of this video may be out of date.</sub>');
		}
	}else if(title=='clear_failed'){
		$('#cmddescription').html('<p><b>merely was unable to batch delete messages because of limitations with the discord API.</b></p>\
		<ul><li>this error can be caused by a restriction in the discord api that prevents mass deletion of messages that are older than 14 days.</li>\
		<li>this error can also be caused by a lack of permissions, for example if merely doesn\'t have <code>READ_MESSAGE_HISTORY</code> and <code>MANAGE_MESSAGES</code>.</li>\
		<li><i>note</i>, however, that this error can also be falsely fired if merely is unable to delete messages for any other reason. this could be something as simple as an unreliable internet connection on merely\'s end or an outage on discord\'s end.</li>\
		<li>try again, or try with a smaller number of messages, and, if that doesn\'t work, you may need to delete the messages manually or leave them be.</li></ul>');
	}else if(title=='serverowner'){
		$('#cmddescription').html(`
			<p>server owners, use merelybot better with these tutorials!</p>
			<div class="list-group">
				<h4>automation</h4>
				<a href="#/welcome" class="list-group-item list-group-item-action">set a "welcome to the server" message</a>
				<a href="#/farewell" class="list-group-item list-group-item-action">note when users leave (and who)</a>
				<a href="#/reactrole" class="list-group-item list-group-item-action">create reactions that give users roles</a>
			</div>
			<div class="list-group">
				<h4>cleaning</h4>
				<a href="#/clean" class="list-group-item list-group-item-action">mass delete messages from a channel</a>
				<a href="#/janitor" class="list-group-item list-group-item-action">automateically delete messages after 30 seconds</a>
			</div>
			<div class="list-group">
				<h4>extra features</h4>
				<a href="#/changes" class="list-group-item list-group-item-action">see the changes made in recent updates</a>
				<a href="#/feedback" class="list-group-item list-group-item-action">send feedback directly to the developers</a>
			</div>
			<div class="list-group">
				<h4>premium</h4>
				<a href="#/premium" class="list-group-item list-group-item-action">learn about premium features and how to support development</a>
				<a href="#/prefix" class="list-group-item list-group-item-action">set custom prefixes</a>
				<a href="#/language" class="list-group-item list-group-item-action">sponsor a professional translation of the bot</a>
			</div>
		`);
	}
}

$('#cmdnfo').on('hidden.bs.modal', function() {
  $('#cmdname').text('loading definitions...');
	$('#cmddescription').text('please wait for a second while we retrieve the latest information from merely.');
	history.pushState("", document.title, window.location.pathname + window.location.search);
});

function getstats(){
	$.ajax({
		url:'/api/bot/stats',
		success:function(data){
			$('.outtadate').hide();
			
			$('#ver').text(data.core.substring(10));
			$('#uptime').text(data.uptime);
			$('#cpu').text(data.cpu_usage+' cpu usage');
			$('#mem').text(data.ram_usage+' memory usage');
			$('#modules').html('the modules<br><code>'+data.modules+'</code><br>are currently running and enabled.');
			$('#sentrecieved').text(data.raw.sentcount+' sent / '+data.raw.recievedcount+' recieved');
			$('#gentime').text('last update: '+data.gentime);
			$('#lib').text(data.library);
			$('#hardware').html("<i>"+data.hardware+"</i>");
		},
		error:function(data){
			$('.outtadate').show();
		}
	});
}