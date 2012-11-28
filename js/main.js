$(function() {

  $.post("editable-files.txt?", function(data){
    z.editableTypes = new RegExp(data);
  });
  
  z.visualTypes = /.html$|.htm$|.php$|\.bc\.php$/;

  z.imageTypes = /.jpg$|.jpeg$|.gif$|.png$/;

  // autoTest interval
  z.autoTest;

  z.visualPreview = "splash.html";

  // node that was clicked in file list
  z.menuNode;

  // new node to add to file list
  z.newNode = "";

  // is the new document a directory or a file
  z.newFileType = "file";

  z.currentPath = "";

  // select a few key elements
  z.fileName = $("#fileName");
  z.files = $("#fileList");
  z.topFolder = $("#topFolder");
  z.refresh = $("#refresh");
  z.previewFrame = $("#previewFrame");
  z.docMenu = $("#docMenu");
  z.codeUI = $("#codeUI");
  z.codeBorder = $("#codeBorder");
  z.autoTestCheck = $("#autoTest");

  // set up the modals
  z.modal = $("#modal").hide();
  z.modals = new z.Modals();

  // hide the code on load
  z.codeBorder.hide();

  // utility function to get the last element of a split string/array
  z.splitLast = function(str, exp) {
    var n = str.split(exp);
    if (n.length == 1) {
      return false;
    }
    return n[n.length - 1];
  };

  z.removeLast = function(str, delimeter) {
    var arr = str.split(delimeter);
    arr.pop();
    return arr.join(delimeter);
  };

  // overlay used with drag and modals
  $("body").append("<div id='overlay'/>");
  z.overlay = $("#overlay");
  z.overlay.css({
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.5,
    zIndex: 100
  }).hide();

  
  var editorOptions = {
    height: "100%",

    parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "../contrib/php/js/tokenizephp.js", "parsedummy.js", "../contrib/php/js/parsephp.js", "../contrib/php/js/parsephphtmlmixed.js"],
    stylesheet: ["codemirror/css/bccolors.css","codemirror/css/xmlcolors.css", "codemirror/css/csscolors.css", "codemirror/contrib/php/css/phpcolors.css", "codemirror/css/jscolors.css"],
    path: "codemirror/js/",
    autoMatchParens: true,
    lineNumbers: true,
    indentUnit: 2,
    tabMode: "classic",
    syntax: 'html',
    onLoad: function(editor) {
      zen_editor.bind(editor);
    }
  };
  
  var customColors = $("#customColors");
  
  if (localStorage.ztxtCustomColors == "yes"){
    customColors.css({color : "#ebd770"});
    editorOptions.stylesheet.push("customcolors.css");
  }
  
  customColors.click(function(){
    if (localStorage.ztxtCustomColors == "yes"){
      localStorage.ztxtCustomColors = "no";
    }else{
      localStorage.ztxtCustomColors = "yes";
    }
    //console.log(localStorage.ztxtCustomColors);
    window.location.href = "/ztxt";
  });
  
  // the code mirror instance
  z.editor = CodeMirror.fromTextArea('code', editorOptions);
  
  
  


  // hide the docMenu when the code iframe is clicked
  z.codeIframe = $($("iframe").first()[0].contentWindow);
  z.codeIframe.css("height", "99%");
  z.codeIframe.click(function() {
    z.docMenu.hide();
    z.hideColorPicker();
  });
  
  z.cssSwatch = $("<div>", {
    css : {
      position : "relative",
      float : "left",
      marginTop : -3,
      marginLeft : -9,
      width : 20,
      height : 20,
      zIndex : 10000,
      backgroundColor : "gray",
      borderRadius : 10
    }
  }).appendTo("#uiContent .left");
  
 // console.log(z.cssSwatch);
  
  z.codeIframe.on("mouseover", "span.css-colorcode, span.css-value", function(e){
   // console.log($(this));
    z.cssSwatch.css({
      backgroundColor : $(this).text()
    });
  });

  // update some elements on resize
  z.win.resize(function() {
    z.modal.css({
      top: z.win.height() / 2 - z.modal.outerWidth() / 2,
      left: z.win.width() / 2 - z.modal.outerHeight() / 2
    });
    z.overlay.css({
      width: z.win.width(),
      height: z.win.height()
    });

    z.files.css({
      height: z.win.height() - z.files.position().top - 25
    });

    $(".CodeMirror-wrapping").css("height", z.win.height() - z.codeUI.outerHeight());

  }).trigger("resize");



  // mouseX and Y
  z.doc.mousemove(function(e) {
    z.mouseX = e.pageX;
    z.mouseY = e.pageY;
  });


  z.keyup = function(e) {
    if (z.autoTestCheck.attr("checked")) {
      clearTimeout(z.autoTest);
      z.autoTest = setTimeout(z.saveFileFolder, 1000);
    }
  };

  $("iframe").each(function(i, item) {
    $(item.contentWindow).keyup(z.keyup);
  });


  z.updatePreview = function() {

    if (z.currentPath.match(z.visualTypes)) {
      z.visualPreview = z.currentPath;
    }
    if (z.autoTestCheck.attr("checked")) {
      z.previewFrame.attr("src", z.visualPreview);
    } else {
      z.previewFrame.attr("src", "splash.html");
    }
  };

  // called when a new file or folder is created
  z.saveNewFileFolder = function(path) {

    var data = {
      name: path,
      content: ""
    };

    $.post("save.php", data, function(data) {
      if (z.newFileType == "file") {
        z.currentPath = path;
        z.saveOnClick = false;
        z.newNode.trigger("click");
        z.saveOnClick = true;
        z.editor.setCode("");

      }
    });

  };

  // saves a file or folder
  z.saveFileFolder = function(callback) {

    if (!callback) callback = function() {};
    if (!z.currentPath) return;

    var data = {
      name: z.currentPath,
      content: encodeURIComponent(z.editor.getCode()).replace(/\'/g, "%27")
    };

    $.post("save.php", data, function(data) {
      z.updatePreview();
      callback();
      
    });
  };



  // create instances of main classes
  z.dragCols = new z.DragCols();
  z.fileList = new z.FileList();
  z.codeWin = new z.CodeWin();
  
  z.body.on("selectstart", function(){return false;});

});