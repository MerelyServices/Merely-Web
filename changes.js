const converter = new showdown.Converter();

$(window).on('load',function(){
	// Show version number in h1
	$.get('/api/bot/stats', function(data){
		$('#ver').text(data.core.substring(10));
		$('.outtadate').hide();
	});
	
	// List changes
	$.get('/api/bot/changes', function(content){
		content=converter.makeHtml(content);
		$('#changes').html(content);
		$('.outtadate').hide();
	});
});