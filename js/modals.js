z.Modals = function() {
  var m = this;
  var modelUI = $(".modalUI");
  modelUI.hide();

  var modalTitle = $("#modalTitle");
  var filename = $("#filename");
  var renameName = $("#renameName");
  
  var currTerm;
  var cursorSearch;
  var searchTerm = $("#search");
  
  m.show = function(name) {



    if (name == "find") {
      modalTitle.text("Find & Replace");
      setTimeout(function() {
        searchTerm.focus();
      }, 100);
    } else if (name == "newDialogue") {
      modalTitle.text("New File or Folder");
    } else if (name == "newDocument") {
      modalTitle.text("New File or Folder");
      $("#" + name + " span").text(z.currentDir);
      filename.val("");
      setTimeout(function() {
        filename.focus();
      }, 100);
    } else if (name == "rename") {
      modalTitle.text("Rename File or Folder");
      $("#" + name + " span").text(z.docMenuPath);
      renameName.val("");
      setTimeout(function() {
        renameName.focus();
      }, 100);
    }
    modelUI.hide();
    z.modal.show();
    $("#" + name).show();
    z.overlay.show();

  };

  function hideModal() {
    z.modal.hide();
    z.overlay.hide();
  }

  $("#ok, #okBtn").click(hideModal);

  $(".cancel").click(hideModal);


  $("#create").submit(function(e) {
    e.preventDefault();
    saveNew();
  });

  $("#renameIt").submit(function(e) {
    e.preventDefault();
    renameFileFolder();
  });
  $("#renameBtn").click(renameFileFolder);


  function renameFileFolder() {
    var newFileName = renameName.val();
    var newFilePath = z.currentDir + "/" + newFileName;
    $.post("file_exists.php", {
      name: newFilePath
    }, function(exists) {

      if (exists == "true") {
        alert("Sorry a file by that name already exists.");
      } else {

        if (z.actionFile.hasClass("directory")) {



          newFilePath = z.removeLast(newFilePath, "/");
          newFilePath = z.removeLast(newFilePath, "/");
          newFilePath = newFilePath + "/" + newFileName;


          z.actionFile.attr("data-path", newFilePath);
          var span = z.actionFile.children("span");
          span.text(newFileName);
          span.attr("data-path", newFilePath);

          var children = z.actionFile.find("*[data-path^='" + z.docMenuPath + "']");

          z.currentPath = z.currentPath.replace(z.docMenuPath, newFilePath);
          children.each(function() {
            $(this).attr("data-path", function(i, val) {
              return val.replace(z.docMenuPath, newFilePath);
            });
          });

        } else {
          

          z.actionFile.attr("data-path", newFilePath);
          z.actionFile.attr("data-ext", z.splitLast(newFileName, "."));
          var span = z.actionFile.children("span");
          span.text(newFileName);
          span.attr("data-path", newFilePath);

        }

        //console.log(z.docMenuPath, newFilePath);
        $.post("rename.php", {
          name: z.docMenuPath,
          newName: newFilePath
        }, function(data) {

          if (z.docMenuPath == z.currentPath) {
            z.currentPath = newFilePath;
            z.fileName.text(z.splitLast(newFilePath, "/"));
          }

        });

      }

    });
    hideModal();
  }

  function saveNew() {

    var newFileName = filename.val();
    var currDir = z.currentDir;
    var ext = z.splitLast(newFileName, ".");
    var path = currDir + "/" + newFileName;

    $.post("file_exists.php", {
      name: path
    }, function(exists) {


      if (exists == "true") {
        alert("Sorry a file by that name already exists.");
      } else {


        if (newFileName.indexOf(".") != -1) {
          z.newFileType = "file";
        } else {
          z.newFileType = "directory";
        }


        if (z.newFileType == "file") {

          z.newNode = $('<li class="ext_' + ext + ' file" data-path="' + path + '" data-ext="' + ext + '"><span data-path="' + path + '">' + newFileName + '<\/span><\/li>');

        } else {
          //currDir +"/"+ newFileName
          z.newNode = $('<li class="directory" data-path="' + path + '"><span data-path="' + path + '">' + newFileName + '<\/span><ul><\/ul><\/li>');
        }

        //newNode.css({fontWeight : "bold"});
        z.menuNode.prepend(z.newNode);
        //newNode.css({fontWeight : "normal"});
        z.saveNewFileFolder(path);
      }

    });
    hideModal();
  }
  $("#save").click(saveNew);

  // find and replace
 

  $("#findBtn").click(function() {
    var term = searchTerm.val();

    if (term != currTerm) {
      cursorSearch = z.editor.getSearchCursor(term, true);
    }

    var next = cursorSearch.findNext();

    if (!next) {
      if (term == currTerm) {
        cursorSearch = z.editor.getSearchCursor(term, false);
        cursorSearch.findNext();
      }
    }
    cursorSearch.select();

    currTerm = term;
  });

  $("#replaceBtn").click(function() {
    var term = searchTerm.val();
    var replaceValue = $("#replace").val();

    cursorSearch = z.editor.getSearchCursor(term, false);

    while (cursorSearch.findNext()) {
      cursorSearch.replace(replaceValue);
    }
    z.saveFileFolder();
  });









};