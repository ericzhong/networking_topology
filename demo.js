function blink(el, bg) {
    var times = 3
    
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


var source_config = {
    maxConnections:1,
    onMaxConnections:function(info, e) {
        //alert("Maximum connections (" + info.maxConnections + ") reached");
    }
}

var target_config = {
    dropOptions:{ hoverClass:"dragHover" },
}


var vm = '' +
    '<div class="vm">' +
        '<div class="vm-name menu">VM</div>' +
        '<div class="vm-content">' +
            '<div class="vol-box"></div>' +
            '<div class="gap"></div>' +
            '<div class="if-box"></div>' +
        '</div>' +
    '</div>'

var router = '' +
    '<div class="router">' +
        '<div class="router-name menu">Router</div>' +
        '<div class="router-content">' +
            '<div class="if-box wan">' +
                '<div class="if"></div>' +
            '</div>' +
            '<div class="gap"></div>' +
            '<div class="if-box lan"></div>' +
        '</div>' +
    '</div>'

var sn = '<div class="sn menu"></div>'
var vol = '<div class="vol menu"></div>'
var _if = '<div class="if menu"></div>'


var refresh_all = function() {
    jsPlumb.repaintEverything();
}

var vol_box_droppable = {
    accept: '.item.vol', 

    drop: function (e, ui) {
        var el = $(vol);
        $(this).append(el);
        //jsPlumb.repaintEverything()
        refresh_all();
        blink(el, 'black');
    }
};

var if_box_droppable = {
    accept: '.item.if', 

    drop: function (e, ui) {
        var el = $(_if);
        $(this).append(el);

        jsPlumb.makeSource( el, source_config);      
        //jsPlumb.repaintEverything()
        refresh_all();
        blink(el, 'black');
    }
};


//
// API
//
function create_sn(id, name){
    var el = $(sn);
    el.text(name).attr('id', id);
    jsPlumb.makeTarget(el, target_config);
    jsPlumb.draggable(el, {containment: "parent"});
    $('.canvas').append(el);
}

function delete_sn(opts){
    var el = opts.$trigger;
    jsPlumb.detachAllConnections(el);
    el.remove();
}

function create_router(id, name){
    var el = $(router);
    el.find('.router-name').text(name);
    el.attr('id', id);
    jsPlumb.makeSource(el.find(".if"), source_config);
    jsPlumb.draggable(el, {containment: "parent"});
    el.find('.router-content .if-box').droppable(if_box_droppable);
    $('.canvas').append(el);
}

function create_vm(id, name){
    var el = $(vm);
    el.find('.vm-name').text(name);
    el.attr('id', id);
    jsPlumb.makeSource(el.find(".if"), source_config);
    jsPlumb.draggable(el, {containment: "parent"});
    el.find('.vm-content .vol-box').droppable(vol_box_droppable);
    el.find('.vm-content .if-box').droppable(if_box_droppable);
    $('.canvas').append(el);
}

function delete_vm(opts){
    var el = opts.$trigger.parent();
    $.each(el.find(".if"), function(key, value){
        jsPlumb.detachAllConnections(value);
    });
    //jsPlumb.detachAllConnections(el.find(".if"));
    el.remove();
}

function create_vol(vm_id, vol_id){
    var el = $(vol);
    el.attr('id', vol_id);
    $('#'+vm_id).find('.vol-box').append(el);
}

function delete_vol(opts){
    var el = opts.$trigger;
    el.remove();
}

function create_if(vm_id, if_id){
    var el = $(_if);
    el.attr('id', if_id);
    jsPlumb.makeSource(el, source_config);
    $('#'+vm_id).find('.if-box').append(el);
}

function delete_if(opts){
    var el = opts.$trigger;
    jsPlumb.detachAllConnections(el);
    //jsPlumb.unmakeSource(el);
    el.remove();
}

function create_conn(source_id, target_id){
    jsPlumb.connect({ source:$('#'+source_id), target:$('#'+target_id) });
}

function delete_conn(){

}


function rename_dialog(el){
    bootbox.prompt("Rename", function(result) {
        if (result === null) {
            return;
        } else {
            $(el).text(result);
        }
    });
}


function context_menu(){
    $.contextMenu({
        selector: '.sn.menu',
        callback: function(key, options) {
            if(key=='delete') {
                delete_sn(options);
            }else if(key=='rename'){
                rename_dialog(options.$trigger);
            }
        },
        items: {
            "rename": {name: "Rename", icon: "edit"},
            "delete": {name: "Delete", icon: "delete"}
        }
    });

    $.contextMenu({
        selector: '.router-name.menu',
        callback: function(key, options) {
            if(key=='delete') {
                delete_vm(options);
            }else if(key=='rename'){
                rename_dialog(options.$trigger);
            }
        },
        items: {
            "rename": {name: "Rename", icon: "edit"},
            "delete": {name: "Delete", icon: "delete"}
        }
    });

    $.contextMenu({
        selector: '.vm-name.menu',
        callback: function(key, options) {
            if(key=='delete') {
                delete_vm(options);
            }else if(key=='rename'){
                rename_dialog(options.$trigger);
            }
        },
        items: {
            "rename": {name: "Rename", icon: "edit"},
            "delete": {name: "Delete", icon: "delete"}
        }
    });

    $.contextMenu({
        selector: '.if.menu', 
        callback: function(key, options) {
            if(key=='delete') {
                delete_if(options);
            } 
        },
        items: {
            "delete": {name: "Delete", icon: "delete"}
        }
    });

    $.contextMenu({
        selector: '.vol.menu', 
        callback: function(key, options) {
            if(key=='delete') {
                delete_vol(options);
            } 
        },
        items: {
            "delete": {name: "Delete", icon: "delete"}
        }
    });
}


function create_example(){
    create_sn("sn1", "sn1");
    create_sn("sn2", "sn2");

    create_vm("vm1", "vm1");

    create_vol("vm1", "vol11");
    create_vol("vm1", "vol12");
    create_vol("vm1", "vol13");

    create_if("vm1", "if11");
    create_if("vm1", "if12");
    create_if("vm1", "if13");

    create_vm("vm2", "vm2");

    create_vol("vm2", "vol21");
    create_vol("vm2", "vol22");
    create_vol("vm2", "vol23");

    create_if("vm2", "if21");
    create_if("vm2", "if22");
    create_if("vm2", "if23");

    create_conn("if11", "sn1");
    create_conn("if12", "sn1");
    create_conn("if21", "sn2");
    create_conn("if22", "sn2");
    
    create_router("router1", "router1");
}


//jsPlumb.ready(function() {
jsPlumb.bind("ready", function() {

    jsPlumb.importDefaults({
        Container : $("body"),
        //Endpoint : ["Dot", {radius:5}],
        Endpoints : [["Dot", {radius:2}], ["Dot", {radius:5}]],
        Anchor : "Continuous",
        HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:5 },
        ConnectionOverlays : [
            //[ "Arrow", {location:1,   id:"arrow", length:12, foldback:0.8}],
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


    $('.canvas').droppable({
        accept: function(el){
            if(el.hasClass('item') && (el.hasClass('vm') ||
                                       el.hasClass('sn') ||
                                       el.hasClass('router'))){
                return true;
            }
        },
        drop: function (e, ui) {
            if( $(ui.draggable).hasClass('vm') ){
                el = $(vm);
                el.css({'top': ui.offset.top, 'left': ui.offset.left});
                $(this).append(el);
                blink(el, 'black');

                jsPlumb.draggable( el, {containment: "parent"});
                jsPlumb.makeSource( $(this).find(".if"), source_config);

                el.find('.vm-content .vol-box').droppable(vol_box_droppable);
                el.find('.vm-content .if-box').droppable(if_box_droppable);
            }else if( $(ui.draggable).hasClass('router') ){
                el = $(router);
                el.css({'top': ui.offset.top, 'left': ui.offset.left});
                $(this).append(el);
                blink(el, 'black');

                jsPlumb.draggable( el, {containment: "parent"});
                jsPlumb.makeSource( el.find(".if"), source_config);

                el.find('.router-content .if-box.lan').droppable(if_box_droppable);
            }else{
                el = $(sn);
                el.css({'top': ui.offset.top, 'left': ui.offset.left});
                $(this).append(el);
                blink(el, 'black');

                jsPlumb.draggable( el, {containment: "parent"});
                jsPlumb.makeTarget( el, target_config);
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

    context_menu();
    create_example();
});

