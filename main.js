let dhelp, enINI, configINI;
let special = ['clear_failed', 'serverowner'];

$(async function(){
	let repo, babel, enINIData, config, configINIData;
	try {
		repo = await new Tree('https://api.github.com/repos/MerelyServices/Merely-Framework/git/trees/2.x').fetch();
		babel = await repo.get_tree('babel');
		enINIData = await babel.get_file('en.ini');
	} catch(error) {
		$('.outtadate').show();
		console.error(error);
	}
	enINI = parseINIString(enINIData.content);
	dhelp = {};
	// Iterate over localization files and find the documentation for each command
	Object.keys(enINI).forEach((section) => {
		Object.keys(enINI[section]).forEach((key) => {
			if(key.startsWith('command_') && key.endsWith('_help'))
				dhelp[key.substring(8, key.length - 5)] = enINI[section][key];
		})
	});

	/*let config = await repo.get_tree('config');
	let configINIData = await config.get_file('config.factory.ini');
	configINI = parseINIString(configINIData.content);*/
	//TODO

	loadmodal();
});

window.addEventListener('hashchange', loadmodal);
function loadmodal(){
	let target = window.location.hash;
	
	if(dhelp && target.startsWith('#/')){
		target = target.substring(2);
		if(target in dhelp) {
			fillmodal(target, dhelp[target]);
		}else if(special.includes(target)) {
			fillmodal(target, null);
		}else{
			fillmodal('Unable to find command', 'This command may have been removed, or it could be undocumented.', false)
		}
		$('#cmdnfo').modal('show');
	}
}

function fillmodal(title, content, video=true){
	$('#cmdname').text(title);
	if(!special.includes(title)){
		var formattedcontent = [], i = 0;

		content = content
		.replaceAll('{cmd}', title)
		.replaceAll(/\{p\:([a-z-_ ]*?)\}/g, '/$1')
		.replaceAll('{c:main/botname}', 'MerelyBot')
		.replaceAll(/`([^`]*)`/g, `<code>$1</code>`);

		content.split('\n').forEach(line => {
			if(i == 0) formattedcontent.push(`<b>${line}</b>`);
			else if(i == 1) formattedcontent.push(line);
			else formattedcontent.push(`<i>${line}</i>`);
			i++;
		});

		$('#cmddescription').html(formattedcontent.join('<br>'));
		if(video) {
			$('#cmddescription').append('\
			<video width="1280" height="720" playsinline autoplay muted loop controls>\
				<source src="/videotuts/'+title+'.webm" type="video/webm">\
				the merely tutorial videos are unable to play on your device\
			</video>\
			<sub>Note: contents of this video may be out of date.</sub>');
		}
	}else if(title=='serverowner'){
		$('#cmddescription').html(`
			<p>Server owners, use MerelyBot better with these tutorials!</p>
			<div class="list-group">
				<h4>Automation</h4>
				<a href="#/welcome" class="list-group-item list-group-item-action">Set a "Welcome to the server" message</a>
				<a href="#/farewell" class="list-group-item list-group-item-action">Note when users leave (and who)</a>
				<a href="#/reactrole" class="list-group-item list-group-item-action">Create reactions that give users roles</a>
			</div>
			<div class="list-group">
				<h4>Cleaning</h4>
				<a href="#/clean" class="list-group-item list-group-item-action">Mass-delete messages from a channel</a>
				<a href="#/janitor" class="list-group-item list-group-item-action">Automateically delete messages after 30 seconds</a>
			</div>
			<div class="list-group">
				<h4>Extra features</h4>
				<a href="#/changes" class="list-group-item list-group-item-action">See the changes made in recent updates</a>
				<a href="#/controlpanel" class="list-group-item list-group-item-action">Tweak advanced settings for your server</a>
			</div>
			<div class="list-group">
				<h4>Premium</h4>
				<a href="#/premium" class="list-group-item list-group-item-action">Learn about premium features and how to support development</a>
				<a href="#/language" class="list-group-item list-group-item-action">Sponsor a professional translation of the bot</a>
			</div>
		`);
	}
}

$('#cmdnfo').on('hidden.bs.modal', function() {
  $('#cmdname').text('Loading definitions...');
	$('#cmddescription').text('Please wait for a second while we retrieve the latest information from MerelyBot.');
	history.pushState("", document.title, window.location.pathname + window.location.search);
});

/*
  INI Parser  - https://gist.github.com/anonymous/dad852cde5df545ed81f1bc334ea6f72
  Modified for my needs with support for multi-line values and preserving comment data
*/
function parseINIString(data){
  let regex = {
    section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
    comment: /^\s*;.*$/
  };
  let out = {};
  let lines = data.split(/[\r\n]+/);
  let section = null;
  let key = null;
  let commentcounter = 0;

  lines.forEach(function(line){
    if(regex.comment.test(line)){
      if(section) out[section]['_comment_'+commentcounter] = line;
      else out['_comment_'+commentcounter] = line;
      commentcounter++;
    }else if(regex.param.test(line)){
      let match = line.match(regex.param);
      key = match[1];
      if(section){
        out[section][key] = match[2];
      }else{
        out[key] = match[2];
      }
    }else if(key && line.startsWith('\t')){
      if(section) out[section][key] += '\n' + line.replace('\t', '');
      else out[key] += '\n' + line.replace('\t', '');
    }else if(regex.section.test(line)){
      let match = line.match(regex.section);
      out[match[1]] = {};
      section = match[1];
      key = null;
    }else if(line.length == 0 && section){
      section = null;
      key = null;
    };
  });
  return out;
}