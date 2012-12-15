z.DragCols = function() {

  var dragging = false;
  var colA = $("#files");
  var colB = $("#codeCol");
  var colC = $("#preview");

  var dragA = makeDrag().insertBefore(z.docMenu);
  dragA.css({
    left: 200
  });
  //console.log(dragA.css("left"));

  var dragB = makeDrag().insertBefore(z.docMenu);
  dragB.css({
    left: 700 + 200
  });

  var dragLoop;

  updateLayout();
  
  z.win.resize(updateLayout).trigger("resize");

  z.doc.mouseup(function() {
    if (dragging == true) {
      clearInterval(dragLoop);

      z.overlay.hide();
      z.overlay.css({
        opacity: 0.5
      });
    }
  });

  $(".drag").mousedown(function() {
    var t = $(this);
    dragging = true;
    z.overlay.css({
      opacity: 0
    });
    z.overlay.show();
    var max, min;
    if (this == dragA[0]) {
      min = 0;
      max = dragB.position().left - dragB.outerWidth();
    } else {
      min = dragA.position().left + dragA.outerWidth();
      max = z.win.width() - dragB.outerWidth();
    }
    dragLoop = setInterval(function() {
      if (z.mouseX > max) z.mouseX = max;
      if (z.mouseX < min) z.mouseX = min;
      t.css({
        left: z.mouseX
      });
      updateLayout();
    }, 30);
  });

  function updateLayout() {
    var posA = dragA.position().left;
    var posB = dragB.position().left;
    
    colA.css({
      width: posA
    });
    colB.css({
      left: posA + dragA.outerWidth(),
      width: posB - posA - dragB.outerWidth()
    });
    //   console.log(colB.css("width"));
    colC.css({
      left: posB + dragB.outerWidth(),
      width: z.win.width() - posB - dragB.outerWidth()
    });
  }

  function makeDrag() {
    var drag = $("<div>", {
      "class": "drag",
      css: {
        position: "absolute",
        width: 5,
        height: "100%",
        backgroundColor: "#aaa",
        borderRight: "1px solid #666",
        cursor: "ew-resize"
      }
    });
    return drag;
  }
}