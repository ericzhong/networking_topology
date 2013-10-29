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
		Endpoint : ["Dot", {radius:2}],
		Anchor : "Continuous",
		HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:5 },
		ConnectionOverlays : [
			[ "Arrow", {location:1,	id:"arrow", length:12, foldback:0.8}],
			[ "Label", {label:"FOO", id:"label", cssClass:"aLabel"}]
		],
		Connector : "Straight",
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
		}
	};

	var if_box_droppable = {
		accept: '.item.if', 

		drop: function (e, ui) {
			var el = $('<div class="if"></div>')
			$(this).append(el)

			jsPlumb.makeSource( el, source_config)		
			jsPlumb.repaintEverything()
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

				jsPlumb.draggable( vm, {containment: "parent"})

				vm.find('.vm-content .vol-box').droppable(vol_box_droppable)
				vm.find('.vm-content .if-box').droppable(if_box_droppable)
			}else{
                        	sn.css({'top': ui.offset.top, 'left': ui.offset.left})
				$(this).append(sn)

				jsPlumb.draggable( sn, {containment: "parent"})
				jsPlumb.makeTarget( sn, target_config)
			}
		}
	});
	
	jsPlumb.bind("click", function(c) { 
		jsPlumb.detach(c); 
	});			

	//jsPlumb.bind("connection", function(info) {
	//	info.connection.getOverlay("label").setLabel(info.connection.id);
	//});


	
	//example
	jsPlumb.draggable($(".canvas .sn,.canvas .vm"), {
		//containment: $(".canvas")
		containment: "parent"
	});
	jsPlumb.makeSource($(".canvas .if"), source_config)
	jsPlumb.makeTarget($(".canvas .sn"), target_config)
	jsPlumb.connect({ source:$("#if2"), target:$("#sn1") })

});
