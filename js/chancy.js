'use strict';

// begin modified code from CMSC 191 project
  var reviews = [];
  var perPage = 50;
  var curIndex = -1;

  function changeItems(pageNumber, event){
    document.getElementById("resultHead").innerHTML = 'Total number of solutions: '+reviews.length+'</div>'

    document.getElementById("result").innerHTML = '';

    // display results
    for(var i=(pageNumber-1)*perPage, j=0; i<reviews.length && j<perPage; i++, j++){
      appendBoard(solutions[curIndex][i], false, (i+1), curIndex);
    }

    // setTokens();
  }
// end modified code from CMSC 191 project

var sizeN,
    TOS,
    selectedCellId = '',
    playable = {
      arr: [],
      fixed: [],
      stack: [],
      hasInitialChancys: false
    },
    puzzles = [],
    solutions = [];

function isSafe(arr, row, col, preliminary=false){
  var i, j;

  if(!preliminary &&
     (col > TOS || TOS >= sizeN || col>= sizeN || row>=sizeN))
    return false;

  // Check row
  for (i = 0; i < col; i++)
    if (i!= col && arr[row][i])
      return false;

  // Check this col
  for (i = 0; i < row; i++)
    if (i!= row && arr[i][col])
      return false;

  // n chancellors
  // check upper vertical L
  if(row-2 >= 0 && row-2 < sizeN){
    if(col-1 >= 0 && col-1 < sizeN){
      if(arr[row-2][col-1])
        return false;
    }
    if(col+1 >= 0 && col+1 < sizeN){
      if(arr[row-2][col+1])
        return false;
    }
  }

  // check lower vertical L
  if(row+2 >= 0 && row+2 < sizeN){
    if(col-1 >= 0 && col-1 < sizeN){
      if(arr[row+2][col-1])
        return false;
    }
    if(col+1 >= 0 && col+1 < sizeN){
      if(arr[row+2][col+1])
        return false;
    }
  }

  // check upper horizontal L
  if(row-1 >= 0 && row-1 < sizeN){
    if(col-2 >= 0 && col-2 < sizeN){
      if(arr[row-1][col-2])
        return false;
    }
    if(col+2 >= 0 && col+2 < sizeN){
      if(arr[row-1][col+2])
        return false;
    }
  }

  // check lower horizontal L
  if(row+1 >= 0 && row+1 < sizeN){
    if(col-2 >= 0 && col-2 < sizeN){
      if(arr[row+1][col-2])
        return false;
    }
    if(col+2 >= 0 && col+2 < sizeN){
      if(arr[row+1][col+2])
        return false;
    }
  }

  // n queens
  // // Check back slash
  // for (i=row, j=col; i>=0 && j>=0; i--, j--)
  //   if (arr[i][j])
  //     return false;

  // // Check slash
  // for (i=row, j=col; j>=0 && i<sizeN; i++, j--)
  //   if (arr[i][j])
  //     return false;

  return true;
}

function boardDeepCopy(arr){
  var someArray = [], i, j;
  for(i=0; i<arr.length; i++){
    someArray.push([]);
    for(j=0; j<arr[i].length; j++){
      someArray[i].push(arr[i][j]);
    }
  }
  return someArray;
}

function arrDeepCopy(arr){
  var someArray = [], i;
  for(i=0; i<arr.length; i++){
    someArray.push(arr[i]);
  }
  return someArray;
}

function matchesInitialConfig(board, config){
  for(var i=0; i<config.length; i++){
    if( config[i] > -1 &&
       !board[ config[i] ][i]){
      return false;
    }
  }

  return true;
}

function solve(index, data){

  TOS=0;

  var i,
      j,
      temp,
      queens=0,
      soln=0,
      arr = [],
      stack = [],
      fixed = [],
      hasInitialChancys = data.hasInitialChancys;

  arr = data.arr;
  stack = arrDeepCopy(data.stack);
  fixed = arrDeepCopy(data.fixed);

  for(j=0; j<=sizeN; j++){
    for(i=0; i<=sizeN; i++){
      if(queens == sizeN){
        temp = boardDeepCopy(arr);

        if( !hasInitialChancys ||
            (hasInitialChancys && matchesInitialConfig(temp, fixed)) ) {

            solutions[index].push(temp);
        }

        queens--;
        --TOS;
        arr[ stack[TOS] ][ TOS ] = 0;
        stack[TOS] = -1;
        continue;
      }

      if( isSafe(arr, i, j) ){
        stack[TOS] = i;
        arr[ stack[TOS] ][ TOS++ ] = 1;
        queens++;
      }
      else {
        if(i<0 || j<0 || TOS<0 || i>sizeN || j>sizeN || TOS>sizeN || (i>sizeN && j==0)){
          return;
        }
        if( j > TOS || (i==sizeN-1 && j==sizeN-1 && stack[TOS]==-1) ){
          queens--;
          j = --TOS;

          if(TOS>=0){
            arr[ stack[TOS] ][ TOS ] = 0;
            i = stack[TOS];
            stack[TOS] = -1;
          }
        }
      }
    }
  }
}

function printBoard(board){
  for(var row of board){
    console.log(row);
  }
}

function initBoard(N){
  var i,j, board = [], row;
  for(i=0; i<N; i++){
    row = [];
    for(j=0; j<N; j++){
      row.push(0);
    }
    board.push(row);
  }
  return board;
}

function initStack(N){
  var i, arr = [];
  for(i=0; i<N; i++){
    arr.push(-1);
  }
  return arr;
}

function populateStack(board, stack){
  var stack = arrDeepCopy(stack);

  for(var i=0; i<board.length; i++){
    for(var j=0; j<board[i].length; j++){
      if(board[i][j]){
        stack[j] = i;
      }
    }
  }

  return stack;
}

function hasConflict(opts){
  var row,
      col,
      stack = opts.fixed,
      board = opts.arr;

  for(col=0; col<stack.length; col++) {
    row = stack[col];

    if(row < 0){
      continue;
    }

    if(!isSafe(board, row, col, true)){
      return true;
    }
  }

  return false;
}

// begin modified code from CMSC 191 project mixed with CMSC 142 N Queens exercise
  // CSV upload : https://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/
  function handleFiles(files) {
    if (window.FileReader) {  // Check for the various File API support.
      reviews = [];
      solutions = [];
      puzzles = [];
      getAsText(files[0]);    // FileReader is supported.
      $('input[type="file"]').val(null);
    } else {
      alert('FileReader are not supported in this browser.');
    }
  }

  function getAsText(fileToRead) {
    var reader = new FileReader();

    reader.readAsText(fileToRead);  // Read file into memory as UTF-8

    reader.onload = loadHandler;    // Load
    reader.onerror = errorHandler;  // Error handling
  }

  function loadHandler(event) {
    var csv = event.target.result;
    csv = csv.trim();

    // set up sidebar and main content
    $("#wrapper").html(
      '<div id="sidebar-wrapper" class="col-md-2">\
        <div id="sidebar">\
          <ul class="nav list-group">\
            <li class="list-group">\
              <ul id="sidebarItems"></ul>\
            </li>\
          </ul>\
        </div>\
      </div>\
      <div id="main-wrapper" class="col-md-10 pull-right">\
        <div id="main">\
          <div class="page-content">\
            <p class="alert alert-success">Select the board size from the right to view solutions.</p>\
          </div>\
        </div>\
      </div>');

    csv = csv.split('\n');

    var size = -1;
    var puzzleCount = parseInt(csv.shift(), 10);
    var puzzle = [];
    var line = '';
    var opts = {
      arr: [],
      stack: [],
      fixed: [],
      hasInitialChancys: false
    }

    for(var i=0; i<puzzleCount; i++){
      size = parseInt(csv.shift(), 10);
      sizeN = size;

      opts.arr = initBoard(sizeN);
      opts.stack = initStack(sizeN);
      opts.fixed = initStack(sizeN);
      opts.hasInitialChancys = false;

      puzzle = [];
      for(var j=0; j<size; j++){
        line = csv.shift().split(' ');

        line = line.map((item, index) => {
          var content = parseInt(item, 10);

          if(content){
            opts.stack[index] = j;
            opts.fixed[index] = j;
            opts.hasInitialChancys = true;
          }
          else {
            opts.stack[index] = -1;
            opts.fixed[index] = false;
          }

          return content;
        });

        puzzle.push(line);
      }

      opts.arr = boardDeepCopy(puzzle);
      opts.stack = populateStack(puzzle, opts.stack);
      opts.fixed = arrDeepCopy(opts.stack)

      puzzles.push(puzzle);
      solutions.push([]);

      if(!hasConflict(opts)){   // check for conflict of initial chancy
        solve(i, opts);         // solve here
      }

      addSidebarItem(i, size);
    }

  }

  function errorHandler(ev) {
    if(ev.target.error.name == "NotReadableError") {
      alert("Cannot read file!");
    }
  }
// end modified code from CMSC 191 project mixed with CMSC 142 N Queens exercise


function addSidebarItem(index, n){
  var sidebarItem = '<li><a class="list-group-item" href="#" onclick="displaySoln('+index+')">N = '+n+'</a></li>';

  $('#sidebarItems').append(sidebarItem);
}

function displaySoln(index, interactive=false){

  if(interactive){
    appendBoard(puzzles[index], true, '', index, true);
    addCellListener();
  }
  else{
   appendBoard(puzzles[index], true, '', index);
  }

  // begin modified code from CMSC 150 and CMSC 191 projects
    // for pagination
    reviews = solutions[index];

    if(reviews.length){
      document.getElementById("resultHead").innerHTML = 'Total number of solutions: '+reviews.length+'</div>'

      // for download link
      var create = document.getElementById('downloadlink-'+index);
      create.addEventListener('click', function () {
        var solnText = getSolnText(index);

        var link = document.getElementById('downloadlink-'+index);
        link.href = makeTextFile(solnText);
        link.style.visibility = 'visible';
      }, false);

      // setup pagination
      $(function(){
        $('.resultPagination').pagination({
          items: reviews.length,
          itemsOnPage: perPage,
          cssStyle: 'light-theme',
          onPageClick: changeItems
        })
      });
    }
    else {
      var layout = '<div class="page-content"><p class="alert alert-danger">No solutions found.</p></div></div>';
      $('.dl').remove();
      $('.resultPagination').remove();
      $('#main').append(layout);
    }
  // end modified code from CMSC 150 and CMSC 191 projects

  // display results
  for(var i=0; i<perPage && i<reviews.length; i++){
    appendBoard(solutions[index][i], false, (i+1), index);
  }
}

function setTokens(){
  $("tr:nth-child(even) td:nth-child(even), \
     tr:nth-child(even) td:nth-child(odd), \
     tr:nth-child(odd) td:nth-child(odd), \
     tr:nth-child(odd) td:nth-child(even)").css({
    'background-image': '',
    'background-size': 'contain'
  });

  $("tr:nth-child(even) td:nth-child(even).chancy, \
     tr:nth-child(even) td:nth-child(odd).chancy, \
     tr:nth-child(odd) td:nth-child(odd).chancy, \
     tr:nth-child(odd) td:nth-child(even).chancy").css({
    'background-size': 'contain',
    'background-size': 'cover',
    'background-repeat': 'no-repeat',
    'background-position': 'center center'
  });

  $("tr:nth-child(even) td:nth-child(even).chancy, \
     tr:nth-child(odd) td:nth-child(odd).chancy").css({
    'background-image': 'url(./img/chancy-white.png)',
  });

  $("tr:nth-child(even) td:nth-child(odd).chancy, \
     tr:nth-child(odd) td:nth-child(even).chancy").css({
    'background-image': 'url(./img/chancy-black.jpg)',
  });
}

// begin modified code from CMSC 150 project
  function getSolnText(index){
    var text = '';
    for(var i=0; solutions[index] && i<solutions[index].length; i++){
      var board = solutions[index][i];

      board = board.map((item) => {
        return item.join(' ');
      }).join('\n');

      text += 'Solution '+(i+1)+'\n'+board+'\n\n';
    }

    return text;
  }

  // generate text file
  // http://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript/21016088#21016088
  var textFile = null;
  function makeTextFile(text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };
// end code from CMSC 150 project

function appendBoard(board, initial=false, index='', n=0, interactive=false){

  curIndex = n;

  var caption = 'Solution '+index,
      table = '',
      cClass = '',
      tClass = 'soln';

  if(initial){
    caption = 'Initial configuration'
    tClass = 'ini';
    if(interactive){
      table += '<div class="dl">\
      <a class="btn btn-primary" onclick="solveInteractive()">Solve</a>\
      <a class="btn btn-primary" download="solution-n-'+(sizeN)+'.txt" id="downloadlink-'+n+'">Download solutions</a>\
      </div>';
    }
    else{
      table += '<div class="dl"><a class="btn btn-primary pull-right" download="solution-n-'+(n+1)+'.txt" id="downloadlink-'+n+'">Download solutions</a></div>';
    }
  }

  table += '<div class="'+tClass+'"><table class="table table-responsive table-bordered"><caption>'+caption+'</caption><tbody>';

  for(var i=0; i<board.length; i++){
    table+= '<tr>';
    for(var j=0; j<board[i].length; j++){
      cClass = board[i][j] ? 'chancy' : '';
      table+= '<td class="'+cClass+'" id="'+i+'-'+j+'">&#9;</td>';
    }
    table+= '</tr>';
  }

  table+= '</tbody> </table> </div>';

  if(initial){
    if(interactive){
      interactiveMode();
      document.getElementById('nSize').value = sizeN;
      $('#main').append(table);
      $('#nSize').focus();
    }
    else {
      $('#main').html(table);
    }

    // begin modified code from CMSC 191 project
      var layout = '<div class="col-md-12" id="resultHead"></div>\
                    <div class="col-md-12 resultPagination" style="padding: 15px;"></div>\
                    <div class="col-md-12" id="result"></div>\
                    <div class="col-md-12 resultPagination" style="padding: 15px;"></div>'

      $('#main').append(layout);
    // end modified code from CMSC 191 project
  }
  else {
    $('#result').append(table);
  }

  setTokens();
}

function showHome(){
  var home = '<div id="main-wrapper" class="col-md-12">\
      <div id="main">\
        <div class="page-header">\
          <h3>N-Chancellors Problem: A modification on the N-Queens problem</h3>\
        </div>\
        <div class="page-content">\
          <p>de Guzman, Adriell Dane</p>\
          <p>Quizon, Pia Carmela</p>\
          <br/>\
          <p>CMSC 142 C-4L 2nd sem 2016-2017</p>\
        </div>\
        <hr>\
        <div class="row">\
          <div class="col-md-6">\
            <pre>Expected format for input files:<br/><br/>2&#9;&#9;&#9;// number of puzzles<br/>3&#9;&#9;&#9;// size of ith board<br/>0 0 0&#9;&#9;// initial position of chancellors denoted by 1<br/>0 0 0<br/>0 0 0<br/>4&#9;&#9;&#9;// size of ith board<br/>0 0 0 0&#9;&#9;// initial position of chancellors denoted by 1<br/>0 0 0 0<br/>0 0 0 0<br/>0 0 0 0\
            </pre>\
          </div><div class="col-md-6">\
            <pre>Sample format of downloadable solution given N=3 :<br/>Filename: solution-n-3.txt<br/>Contents:<br/>Solution 1<br/>1 0 0<br/>0 1 0<br/>0 0 1<br/><br/>Solution 2<br/>0 0 1<br/>0 1 0<br/>1 0 0\
            </pre>\
          </div>\
        </div>\
      </div>\
    </div>';
  $('#wrapper').html(home);
}

function uploadFile(){
  $('#txtFileInput').trigger('click');
}

function isSolved(arr, stack){

  for(var col=0; col<stack.length; col++){
    var row = parseInt(stack[col], 10);

    if(row < 0 ||
       !isSafe(arr, row, col, true)){
      return false;
    }
  }

  return true;
}

function addEmptyNBoard(){
  sizeN = parseInt(document.getElementById('nSize').value, 10);

  puzzles = [];
  solutions = [[]];

  playable.arr = initBoard(sizeN);
  playable.stack = initStack(sizeN);
  playable.fixed = initStack(sizeN);
  playable.hasInitialChancys = false;

  appendBoard(playable.arr, true, '', 0, true);
  addCellListener();
}

function addCellListener(){
  var cells = document.getElementsByTagName('td');

  for(var i=0; i<cells.length; i++){
    selectedCellId = cells[i].id;

    cells[i].addEventListener('click', function (event) {

      var idSplit = this.id.split('-');
      var row = parseInt(idSplit[0], 10);
      var col = parseInt(idSplit[1], 10);

      if(!isSafe(playable.arr, row, col, true)){
        alert('Selected cell is not safe.');
        return;
      }

      if(playable.arr[row][col]){
        playable.arr[row][col] = 0;
        playable.stack[col] = -1;
        playable.fixed[col] = -1;
        $('#'+this.id).removeClass('chancy');
        setTokens();
      }
      else{
        playable.arr[row][col] = 1;
        playable.stack[col] = row;
        playable.fixed[col] = row;
        $('#'+this.id).addClass('chancy');
        setTokens();
      }

      if(isSolved(playable.arr, playable.stack)){
        alert('You found a solution!');
        puzzles = [boardDeepCopy(playable.arr)];
        solutions[0].push(boardDeepCopy(playable.arr));
        displaySoln(0, true);
      }

    }, false);
  }
}

function solveInteractive(){
  sizeN = parseInt(document.getElementById('nSize').value, 10);

  puzzles = [];
  solutions = [[]];

  var opts = {
    arr: boardDeepCopy(playable.arr),
    stack: arrDeepCopy(playable.stack),
    fixed: arrDeepCopy(playable.fixed),
    hasInitialChancys: false
  };
  opts.stack = populateStack(playable.arr, playable.stack);
  opts.fixed = arrDeepCopy(opts.stack);

  for(var i=0; !opts.hasInitialChancys && i<playable.arr.length; i++){
    for(var j=0; !opts.hasInitialChancys && j<playable.arr[i].length; j++){
      if(playable.arr[i][j]){
        opts.hasInitialChancys = true;
      }
    }
  }

  puzzles.push(playable.arr);
  solutions.push([]);

  if(!hasConflict(opts)){   // check for conflict of initial chancy
    solve(0, opts);         // solve here
    displaySoln(0, true);
  }
}

function interactiveMode(){
  var home = '<div id="main-wrapper" class="col-md-12">\
      <div id="main">\
        <div class="row" style="margin-bottom: 10px;">\
          <div class="col-md-2">\
            <div class="input-group">\
              <span class="input-group-addon" id="basic-addon2">N = </span>\
              <input type="number" step="1" min="1" value="0" aria-describedby="basic-addon2" class="form-control" id="nSize" onchange="addEmptyNBoard()">\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>';
  $('#wrapper').html(home);
}
