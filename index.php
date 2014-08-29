<?php require_once("header.php"); ?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>ztxt 3.3</title>
    
    <link rel="stylesheet" href="css/icons.css" /> 
    <link rel="stylesheet" href="css/modal.css" />
    <link rel="stylesheet" href="css/colorpicker.css" />

    <script src="codemirror/js/codemirror.js" ></script> 
    <script src="codemirror/js/mirrorframe.js" ></script> 
    
    <script src="custom-zen.js"></script>
    <script src="js/zen_codemirror.js"></script>
    
    <script src="js/beautify.js" ></script> 
    
    <script src="js/jquery.min.js"></script>
    <script src="js/colorpicker.js"></script>
    
    <script src="js/z.js"></script>
    <script src="js/dragcols.js"></script>
    <script src="js/filelist.js"></script>
    <script src="js/modals.js"></script>
    <script src="js/codewin.js"></script>
    
    <script src="js/main.js"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/theme.css">
    
  </head>
  <body>
    <div id="files">
      <div class="content">
        <a id="refresh" href="#">Refresh List</a>
        <select id="topFolder">loading...</select>
        <div id="fileList" class="noSelect">
          
        </div>
      </div>
    </div>
    <div id="codeCol">
      <div id="codeUI" class="noSelect">
        <div class="content" id="uiContent">
          <div class="left" id="left-controls">
            <a id="newBtn" href="#">New</a>
            <a id="autoFormat" href="#">Auto Format</a>
            <a id="findReplaceBtn" href="#">Find and Replace</a>
            <select id="fontSize">
              <option>10px</option>
              <option>12px</option>
              <option selected>13px</option>
              <option>14px</option>
              <option>18px</option>
              <option>20px</option>
              <option>24px</option>
              <option>28px</option>
            </select>
            
            <div id="color" style="display:inline"><div style="background-color: #000000"></div></div>
            <a id="customColors" href="#">&#x25c9;</a>
          </div>
          <div class="right">
            
            <a href="#" id="test">Test</a>
            <a href="#" id="testInTab">Test in Tab</a>
            <input id="autoTest" type="checkbox" checked/>&nbsp;Auto Test
          </div>
        </div>
        <div id="fileName">
          --
        </div>
        
      </div>
      <div id="codeBorder">
        <textarea id="code"></textarea>
      </div>
    </div>
    <div id="preview"><iframe id="previewFrame" src="splash.html" ></iframe></div>
    
    <div id="docMenu" class="noSelect">
      <ul>
        <li>New Document</li>
        <li>Rename</li>
        <!--<li>Duplicate</li>-->
        <li>Delete</li>
      </ul>
    </div>
    
    
    <div id="modal">
      <div id="modalTitle">New File or Folder</div>
      <div id="modalContent">
        <div id="find" class="modalUI">
          <div class="left findReplace">
            <form id="findIt">
              Find: <br/><textarea name="search" id="search" ></textarea><br/><br/>
              Replace: <br/><textarea  name="replace" id="replace"></textarea><br/>
            </form>
          </div>
          <div class="right" id="findReplaceBtns">
            <br/>
            <button id="findBtn" >Find</button><br/><br/>
            <button id="replaceBtn">Replace All</button><br/><br/>
            <button id="okBtn">ok</button>
          </div>
        </div>
        
        <div id="rename" class="modalUI">
          <b>Rename:</b>
          <span>...</span><br/><br/>
          <form id="renameIt">
            New Name: <input type = "text" name="renameName" id="renameName" />
            
            
          </form>
          <div id="renameBtns">
            <button id="renameBtn" class="defaultBtn">Rename</button>
            <button class="cancel">Cancel</button>
          </div>
          
          
        </div>
        
        <div id="newDialogue" class="modalUI">
          
          <b>Creating Files and Folders</b><br/><br/>
          Right + click or control + click a file or folder and select "New Document" from the dropdown.
          <button id="ok" class="defaultBtn">ok</button>
        </div>
        
        <div id="newDocument" class="modalUI">
          Path : <span>path</span>
          <div class="smallbr"><br/><br/></div>
          <form id="create">
            <div class="left">
              File/Folder Name <br/>
              <input type="text" name="filename" id="filename"/>
            </div>
            
          </form>
          <div class="saveCancel">
            <button class="cancel">Cancel</button>
            <button id="save" class="defaultBtn">Save</button>
          </div>
        </div>
      </div>
      
    </div>
    
  </body>
</html>