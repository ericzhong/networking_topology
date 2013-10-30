function blink(el, bg) {
	var times = 3  /* editable */
	
	var bg_old = el.css("background-color")
	var count = 0
	var interval
	var color = bg
	function set_bg() {
		el.css({"background-color": color})
		if(color==bg)
			color = bg_old;
		else
			color = bg;

		count = count + 1
		if(count == times*2) {
			clearInterval(interval);
			el.css({"background-color": ""})
		}
	}
	interval = setInterval(set_bg, 100);
}


//jsPlumb.ready(function() {
jsPlumb.bind("ready", function() {

	var source_config = {
		maxConnections:1,
		onMaxConnections:function(info, e) {
			alert("Maximum connections (" + info.maxConnections + ") reached");
		}
	}

	var target_config = {
		dropOptions:{ hoverClass:"dragHover" },
	}

	jsPlumb.importDefaults({
		Container : $("body"),
		//Endpoint : ["Dot", {radius:5}],
		Endpoints : [["Dot", {radius:2}], ["Dot", {radius:5}]],
		Anchor : "Continuous",
		HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:5 },
		ConnectionOverlays : [
			//[ "Arrow", {location:1,	id:"arrow", length:12, foldback:0.8}],
			//[ "Label", {label:"FOO", id:"label", cssClass:"aLabel"}]
		],
		Connector : ["Flowchart", {stub:20, alwaysRespectStubs:true}],
		PaintStyle : {lineWidth:2, strokeStyle:'#5c96bc'},
	});

	//centering
	$('.item-box .item').each(function(){
		$(this).css({
			position:'absolute',
			left: ($(".item-box").width() - $(this).outerWidth())/2,
			top: ($(".item-box").height() - $(this).outerHeight())/2,
			margin: 0
		});
	});

	/*
	// left-bottom
	$(".trash").css({
		position: 'absolute',
		left: '10px',
		top: $('.canvas').outerHeight() - $('.trash').first().outerHeight()
	});

	// no drag
	$("img").mousedown(function(){
		return false;
	});
	*/

	$(".panel").draggable({
		containment: "parent"
	});

	$(".item").draggable({
		containment: ".canvas",
		helper: "clone",
		//appendTo: ".canvas"
	});

	var vol_box_droppable = {
		accept: '.item.vol', 

		drop: function (e, ui) {
			var el = $('<div class="vol"></div>')
			$(this).append(el)
			jsPlumb.repaintEverything()
			blink(el, 'black')
		}
	};

	var if_box_droppable = {
		accept: '.item.if', 

		drop: function (e, ui) {
			var el = $('<div class="if"></div>')
			$(this).append(el)

			jsPlumb.makeSource( el, source_config)		
			jsPlumb.repaintEverything()
			blink(el, 'black')
		}
	};

	$('.vol-box').droppable(vol_box_droppable);
	$('.if-box').droppable(if_box_droppable);

	$('.canvas').droppable({
		accept: function(el){
			if(el.hasClass('item') &&
				(el.hasClass('vm') || 
				el.hasClass('sn'))){
				return true;
			}
		},

		drop: function (e, ui) {
			var vm = $('' +
				'<div class="vm">' +
				    '<div class="vm-name">VM</div>' +
				    '<div class="vm-content">' +
				        '<div class="vol-box"></div>' +
				        '<div class="if-box"></div>' +
				    '</div>' +
				'</div>')

			var sn = $('<div class="sn"></div>')

			if( $(ui.draggable).hasClass('vm') ){
                        	vm.css({'top': ui.offset.top, 'left': ui.offset.left})
				$(this).append(vm)
				blink(vm, 'black')

				jsPlumb.draggable( vm, {containment: "parent"})

				vm.find('.vm-content .vol-box').droppable(vol_box_droppable)
				vm.find('.vm-content .if-box').droppable(if_box_droppable)
			}else{
                        	sn.css({'top': ui.offset.top, 'left': ui.offset.left})
				$(this).append(sn)
				blink(sn, 'black')

				jsPlumb.draggable( sn, {containment: "parent"})
				jsPlumb.makeTarget( sn, target_config)
			}
		}
	});
	
	jsPlumb.bind("click", function(conn, originalEvent) {
		if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
			jsPlumb.detach(conn);
	});

	jsPlumb.bind("connection", function(info) {
		info.connection.getOverlay("label").setLabel(info.connection.id);
	});


	
	//example
	jsPlumb.draggable($(".canvas .sn,.canvas .vm"), {
		//containment: $(".canvas")
		containment: "parent"
	});
	jsPlumb.makeSource($(".canvas .if"), source_config)
	jsPlumb.makeTarget($(".canvas .sn"), target_config)
	jsPlumb.connect({ source:$("#if1"), target:$("#sn1") })
	jsPlumb.connect({ source:$("#if2"), target:$("#sn1") })
	jsPlumb.connect({ source:$("#if3"), target:$("#sn2") })
	jsPlumb.connect({ source:$("#if4"), target:$("#sn2") })
	jsPlumb.connect({ source:$("#if5"), target:$("#sn1") })
	jsPlumb.connect({ source:$("#if6"), target:$("#sn1") })
	jsPlumb.connect({ source:$("#if7"), target:$("#sn2") })
	jsPlumb.connect({ source:$("#if8"), target:$("#sn2") })

});
