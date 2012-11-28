z.FileList = function() {
  var f = this;

  f.load = function(dir) {
    z.files.html("loading...");
    $.post("file_list.php", {
      dir: dir
    }, renderList);
  };

  function updateTopFolders() {
    $.get("top_folder_list.php", function(data) {
      z.topFolder.html(data).attr("disabled", false);

      if (!localStorage.topFolder) {
        localStorage.topFolder = z.topFolder.val();

      } else {
        z.topFolder.val(localStorage.topFolder);
      }
      z.topFolder.trigger("change");
    });
  }
  updateTopFolders();

  z.topFolder.change(function() {
    var folder = z.topFolder.val();
    localStorage.topFolder = folder;
    f.load(folder);
  });

  z.refresh.click(updateTopFolders);

  var actionFile;
  var actionFileParent;
  z.files.on("contextmenu", function(e) {
    var curr = e.target;
    if (curr.tagName == "SPAN") {
      curr = $(curr).parent();
    } else {
      curr = $(curr);
    }

    actionFile = curr;
    actionFileParent = actionFile.parent();

    if (curr.hasClass("directory")) {
      z.menuNode = curr.children("ul").first();
    } else if (curr.hasClass("file")) {
      z.menuNode = curr.parent();
    } else {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    z.docMenu.css({
      left: e.clientX,
      top: e.clientY
    });


    if (curr.hasClass("top")) {
      z.docMenu.find("li:first").siblings().hide();
    } else {
      z.docMenu.find("li").show();
    }

    z.docMenu.show();

    z.doc.one("click", function() {
      z.docMenu.hide();
    });

  });

  z.docMenu.click(function(e) {
    var method = $(e.target).text();
    var path = actionFile.attr("data-path");

    z.docMenuPath = path;

    if (actionFile.hasClass("directory")) {
      z.currentDir = actionFile.attr("data-path");
    } else {
      z.currentDir = actionFileParent.parent().attr("data-path");
    }

    if (method == "New Document") {

      //z.currentPath = "";
      z.modals.show("newDocument");

    } else if (method == "Delete") {

      // issue here if parent folder is deleted, 
      // and currentPath is contained within the folder
      // not horrible, but worth fixing
      if (z.currentPath == path) {
        z.previewFrame.attr("src", "splash.html");
        z.codeBorder.hide();
        z.currentPath = undefined;
        z.editor.setCode("");
      }
      var actionFileName = z.splitLast(path, "/");

      if (confirm("Are you sure you want to delete " + actionFileName + "?")) {
        actionFile.remove();
        $.post("delete.php", {
          name: actionFile.attr("data-path")
        });

      }

    } else if (method == "Rename") {
      z.actionFile = actionFile;
      z.modals.show("rename");
    }
  });

  var lastLoaded = "";

  function loadFile(name) {
    //console.log(name);
    if (lastLoaded == name) {
      return;
    }
    lastLoaded = name;
    
    if (name.match(z.editableTypes)) {
      z.currentPath = name;
      z.updatePreview();
      $.post("load_file.php", {
        name: name
      }, function(data) {
        if (data == "ztxt:error:ztxt") {
          alert("!switching files too fast bug - reload page")
        } else {
          z.editor.setCode(data);
          z.codeBorder.show();
          z.fileName.text(z.splitLast(name, "/"));
          if (scrollMemory[z.currentPath]) {
            z.codeIframe.scrollTop(scrollMemory[z.currentPath]);
          } else {
            z.codeIframe.scrollTop(0);
          }
          z.overlay.hide();
        }
      });
    } else if (name.match(z.imageTypes)) {
      z.codeBorder.hide();
      z.currentPath = undefined;
      z.previewFrame.attr("src", name);
      setTimeout(function() {
        z.overlay.hide();
      }, 100);

    } else {
      alert(name + "\nSorry ztxt doesn't work with that kind of file.");
      setTimeout(function() {
        z.overlay.hide();
      }, 100);
    }
  }



  function codeHighlight(ext) {

    if (z.currentPath.match(/-bc\.php/)){
      z.editor.setParser("DummyParser");
    }else
    if (ext == "php" || ext == "html" || ext == "htm" || ext == "xml" || ext == "txt" || ext == "csv") {
      z.editor.setParser("PHPHTMLMixedParser");
    } else if (ext == "js" || ext == "json") {
      z.editor.setParser("JSParser");

    } else if (ext == "css") {
      z.editor.setParser("CSSParser");
    } else {

      // z.editor.setParser("");
    }
  }
  // change back to on.
  var currFile;
  var scrollMemory = {};
  z.saveOnClick = true;

  function itemClick(e) {



    var curr = e.target;
    if (curr.tagName == "SPAN") {
      curr = $(curr).parent();
    } else {
      curr = $(curr);
    }

    e.stopPropagation();

    if (currFile) {
      if (curr[0] == currFile[0]) {
        z.overlay.hide();
        return;
      }
    }


    z.docMenu.hide();
    if (z.saveOnClick) {
      z.saveFileFolder();
    }




    if (curr.hasClass("file")) {

      if (currFile) {
        currFile.css({
          fontWeight: "normal"
        });
      }
      currFile = curr;
      curr.css({
        fontWeight: "bold"
      });
      var path = curr.attr("data-path");
      var ext = curr.attr("data-ext");

      //z.overlay.show();
      scrollMemory[z.currentPath] = z.codeIframe.scrollTop();

      loadFile(path);

      z.overlay.show();

      codeHighlight(ext);
    } else if (curr.hasClass("directory")) {

      curr.children("ul").first().slideToggle();
    }
  }



  function fileOver(e) {
    var target = e.target;
    var tag = target.tagName;
    if (tag == "LI") {
      return $(target).children("span").first();
    } else if (tag == "SPAN") {
      return $(target);
    }
    return $();
  }

  $("#fileList li").live("click", itemClick).live("mouseover", function(e) {
    e.stopPropagation();
    $(this).children("span").first().css({
      color: "#078be3"
    });
  }).live("mouseout", function(e) {
    $(this).children("span").first().css({
      color: "#ccc"
    });
  });

  function renderList(data) {
    z.files.html(data);
    $("#fileList li ul").hide().first().show();
    var fileListLi = $("#fileList li");
    fileListLi.first().addClass("top");
    //.children("span")
    //.addClass("top");
  }





};