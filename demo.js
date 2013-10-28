//jsPlumb.ready(function() {
jsPlumb.bind("ready", function() {

	jsPlumb.importDefaults({
		Container : $("body"),
		Anchor : [0.5, 0.5, 0, 0],
		Endpoint : ["Dot", {radius:2}],
		HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:5 },
		ConnectionOverlays : [
			[ "Arrow", {
				location:1,
				id:"arrow",
				length:12,
				foldback:0.8
				}
			],
			[ "Label", { label:"FOO", id:"label", cssClass:"aLabel" }]
			]
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
		helper: "clone",
		appendTo: ".canvas"
	});

	$('.canvas').droppable({
		accept: function(el){
			if(el.hasClass('item') &&
				(el.hasClass('vm') || 
				el.hasClass('sn'))){
				return true;
			}
		},

		drop: function (e, ui) {
			var old = $(ui.draggable)
			var el = old.clone()
			el.css({
				'top': ui.offset.top,
				'left': ui.offset.left,
				'position': ''
				})
				.removeClass("item")
				.attr('id','') //jsPlumb generate
				.appendTo($(this))

			el.draggable({containment:"parent"})
			jsPlumb.draggable( el, {containment: "parent"})
			jsPlumb.makeTarget( el, {
				dropOptions:{ hoverClass:"dragHover" },
				anchor:"Continuous"				
			})
		}
	});
	
	jsPlumb.draggable($(".canvas .sn,.canvas .vm"), {
		//containment: $(".canvas")
		containment: "parent"
	});

	jsPlumb.bind("click", function(c) { 
		jsPlumb.detach(c); 
	});			
		
	jsPlumb.makeSource($(".canvas .if"), {
		//filter:".if",				// only supported by jquery
		anchor:"Continuous",
		connector:[ "StateMachine", { curviness:20 } ],
		connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
		maxConnections:5,
		onMaxConnections:function(info, e) {
			alert("Maximum connections (" + info.maxConnections + ") reached");
		}
	});			

	//jsPlumb.bind("connection", function(info) {
	//	info.connection.getOverlay("label").setLabel(info.connection.id);
	//});

	jsPlumb.makeTarget($(".canvas .sn"), {
		dropOptions:{ hoverClass:"dragHover" },
		anchor:"Continuous"				
	});
	
	jsPlumb.connect({ source:$("#if2"), target:$("#sn1") });




    //document.onselectstart = function () { return false; };
    // setup jsPlumb defaults.
    //jsPlumb.importDefaults({
    //    DragOptions : { cursor: 'pointer', zIndex:2000 },
    //    PaintStyle : { strokeStyle:'#666' },
    //    EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
    //    Endpoint : "Rectangle",
    //    Anchors : ["TopCenter"]
    //});

    //var exampleDropOptions = {
    //    hoverClass:"dropHover",
    //    activeClass:"dragActive"
    //};

    //// bind to connection/connectionDetached events, and update the list of connections on screen.
    //  jsPlumb.bind("connection", function(info, originalEvent) {
    //      updateConnections(info.connection);
    //  });
    //  jsPlumb.bind("connectionDetached", function(info, originalEvent) {
    //      updateConnections(info.connection, true);
    //  });

    //jsPlumb.draggable($(".vm,.sn"));

    //var color1 = "#316b31";
    //var exampleEndpoint1 = {
    //    endpoint:["Dot", { radius:11 }],
    //    paintStyle:{ fillStyle:color1 },
    //    isSource:true,
    //    scope:"green dot",
    //    connectorStyle:{ strokeStyle:color1, lineWidth:6 },
    //    connector: ["Bezier", { curviness:63 } ],
    //    maxConnections:1,
    //    isTarget:true,
    //    dropOptions : exampleDropOptions
    //};

    //var color2 = "rgba(229,219,61,0.5)";
    //var exampleEndpoint2 = {
    //    endpoint:"Rectangle",
    //    anchor:"BottomLeft",
    //    paintStyle:{ fillStyle:color2, opacity:0.5 },
    //    isSource:true,
    //    scope:'yellow dot',
    //    connectorStyle:{ strokeStyle:color2, lineWidth:4 },
    //    connector : "Straight",
    //    isTarget:true,
    //    dropOptions : exampleDropOptions,
    //    beforeDetach:function(conn) {
    //        return confirm("Detach connection?");
    //    },
    //    onMaxConnections:function(info) {
    //        alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
    //    }
    //};

    //var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ],
    //        maxConnectionsCallback = function(info) {
    //            alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
    //        };

    //var e1 = jsPlumb.addEndpoint("state2", { anchor:"LeftMiddle" }, exampleEndpoint1);
    //// you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
    //e1.bind("maxConnections", maxConnectionsCallback);

    //jsPlumb.addEndpoint("state1", exampleEndpoint1);
    //jsPlumb.addEndpoint("state3", exampleEndpoint2);
    //jsPlumb.addEndpoint("state1", {anchor:anchors}, exampleEndpoint2);
});
