function Layout(p, callback){

  if (!callback) callback = function(){};
  
  var doc = $(document);
  var win = $(window);
  var drag = $(".drag");
  var dragA = drag.first();
  var dragB = drag.last();
  var left = $("#left");
  var center = $("#center");
  var right = $("#right");
  
  var dragLoops = [];
  
  var overlay;
  
  $("body").append("<div id='overlay'/>");
  var overlay = $("#overlay");
  overlay.css({position : "absolute"});
  overlay.css("opacity", 0);
  //overlay.css("background-color", "red");
  overlay.hide();
  
  drag.css({position : "absolute",
            width : 5, backgroundColor : "#aaa",
            cursor : "pointer",
            borderRight : "1px solid #444444" });
            
  dragA.css("left", p.leftWidth);
  dragB.css("left", p.leftWidth + p.centerWidth);
  left.css({position : "absolute",
            top : 0, left : 0,
            width : p.leftWidth});
  center.css({position : "absolute",
              top : 0, left : 0,
              width : p.centerWidth});
  right.css({position : "absolute",
             top : 0, left : 0});
  
  var mouseX = 0, mouseY = 0;
  
 
  function toInt(str){
    return parseInt(str.replace("px", ""));
  }
  
  function updateLayout(){
    var dragAPos = dragA.position();
    var dragBPos = dragB.position(); 
    var padLeft = toInt(left.css("padding-left")) + toInt(left.css("padding-right"));
    var padCenter = toInt(center.css("padding-left")) + toInt(center.css("padding-right"));
    var padRight = toInt(right.css("padding-left")) + toInt(right.css("padding-right"));
    left.css("width", dragAPos.left - padLeft);
    center.css("left", dragAPos.left + 5);
    center.css("width", dragBPos.left - dragAPos.left - 5 - padCenter);
    right.css("left", dragBPos.left + 5);
    right.css("width", win.width() - dragBPos.left - 5 - padRight);
    //console.log(right.width());
    callback();
  }
  updateLayout();
  doc.mousemove(function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  }).mouseup(function(e){
    for (var i = 0; i<dragLoops.length; i++){
      clearInterval(dragLoops[i]);
    }
    overlay.hide();
    updateLayout();
  });
  
 var mem = [];
 
 function checkArrays(a, b){
   if (a.length != b.length) return false;
   var yes = true;
   for (var i = 0; i < a.length; i++){
     if (a[i] != b[i]){
       yes = false;
       break;
     }
   }
   return yes
 }
 function clearMem(){
   mem = [];
 }
 var memId;
 var toggleB = false;
 
 $(document).keydown(function(e){
   clearTimeout(memId);
   memId = setTimeout(clearMem, 500);
   if (mem.length > 4 || e.which == 16) mem = [];
   mem.push(e.which);
  // console.log(mem,[16, 49, 50, 51], checkArrays(mem,[16, 49, 50, 51])); 
   if (checkArrays(mem,[16, 49, 50, 51])){
     if (!toggleB){
       var apos = dragA.position();
       prevBpos = dragB.position();
      dragB.animate({left : apos.left + 10}, "fast",  updateLayout);
     
     }else{
     dragB.animate({left : prevBpos.left}, "fast",  updateLayout);
     }
     toggleB = !toggleB;
   }
 });
  var prevBpos = dragB.position();
  drag.mousedown(function(e){
    if (e.shiftKey){
    
    if (e.target == dragB[0]){
      var apos = dragA.position();
      var bpos = dragB.position();
      prevBpos = dragB.position();
      dragB.animate({left : apos.left + 10}, "fast",  updateLayout);
      return;
    }
    }
    e.preventDefault();
    var that = $(this);
    var max = dragB.position().left - 5 - p.centerWidth/2;
    var min = p.leftWidth;
    
    if (this == dragB[0]) {  
      max = win.width() - 5;
      
      min = p.leftWidth + 5;
    }
    
    overlay.show();
    var id = setInterval(function(){
      if (mouseX > max) mouseX = max;
      if (mouseX < min) mouseX = min;
      that.css("left", mouseX);
      updateLayout();
    }, 30);
    
    dragLoops.push(id);
  });
  
  function resizeWin(){
    var h = win.height();
    var w = win.width();
    left.css({height : h});
    center.css({height : h});
    right.css({height : h});
    drag.css({height : h});
    overlay.css({width: w, height : h});
    updateLayout();
  }
  
  win.resize(resizeWin);
  resizeWin();
  
}