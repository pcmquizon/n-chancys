'use strict';

// begin modified code from CMSC 191 project
  var reviews = [];
  var perPage = -1;
  var curIndex = -1;

  function changeItems(pageNumber, event){
    document.getElementById("resultHead").innerHTML = '<div class="page-header"><h3>Reviews</h3>Total: '+reviews.length+'</div>'

    document.getElementById("result").innerHTML = '';

    // display results
    for(var i=(pageNumber-1)*perPage, j=0; i<reviews.length && j<perPage; i++, j++){
      appendBoard(solutions[curIndex][i], false, (i+1), curIndex);
    }

  }
// end modified code from CMSC 191 project

var N, TOS,
    tableToImport = '',
    puzzles = [],
    solutions = [];

function isSafe(arr, row, col){
  var i, j;

  if(col > TOS || TOS >= N || col>= N || row>=N )
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
  if(row-2 >= 0 && row-2 <N){
    if(col-1 >= 0 && col-1 <N){
      if(arr[row-2][col-1])
        return false;
    }
    if(col+1 >= 0 && col+1 <N){
      if(arr[row-2][col+1])
        return false;
    }
  }

  // check lower vertical L
  if(row+2 >= 0 && row+2 <N){
    if(col-1 >= 0 && col-1 <N){
      if(arr[row+2][col-1])
        return false;
    }
    if(col+1 >= 0 && col+1 <N){
      if(arr[row+2][col+1])
        return false;
    }
  }

  // check upper horizontal L
  if(row-1 >= 0 && row-1 <N){
    if(col-2 >= 0 && col-2 <N){
      if(arr[row-1][col-2])
        return false;
    }
    if(col+2 >= 0 && col+2 <N){
      if(arr[row-1][col+2])
        return false;
    }
  }

  // check lower horizontal L
  if(row+1 >= 0 && row+1 <N){
    if(col-2 >= 0 && col-2 <N){
      if(arr[row+1][col-2])
        return false;
    }
    if(col+2 >= 0 && col+2 <N){
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
  // for (i=row, j=col; j>=0 && i<N; i++, j--)
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

  var i,j,
      queens=0,
      soln=0,
      arr = [],
      stack = [],
      fixed = [],
      hasInitialChancys = data.hasInitialChancys;

  arr = data.arr;
  stack = arrDeepCopy(data.stack);
  fixed = arrDeepCopy(data.fixed);

  // console.log('data');
  // console.log(data);

  // printBoard(arr);
  // console.log(arr);
  // console.log(stack);
  // console.log(fixed);

  var temp;

  for(j=0; j<=N; j++){
    for(i=0; i<=N; i++){
      if(queens == N){
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
      else{
        if(i<0 || j<0 || TOS<0 || i>N || j>N || TOS>N || (i>N && j==0)){
          return;
        }
        if( j > TOS || (i==N-1 && j==N-1 && stack[TOS]==-1) ){
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
      if(board[i][j])
        stack[j] = i;

    }
  }

  return stack;
}

// begin modified code from CMSC 191 project mixed with CMSC 142 N Queens exercise
  // CSV upload : https://mounirmesselmeni.github.io/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/
  function handleFiles(files) {
    if (window.FileReader) {  // Check for the various File API support.
      getAsText(files[0]);    // FileReader is supported.
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
      N = size;

      opts.arr = initBoard(N);
      opts.stack = initStack(N);
      opts.fixed = initStack(N);
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
          else{
            opts.stack[index] = -1;
            opts.fixed[index] = false;
          }

          return content;
        });

        puzzle.push(line);
      }

      opts.arr = puzzle;

      opts.stack = populateStack(puzzle, opts.stack);
      opts.fixed = arrDeepCopy(opts.stack)

      puzzles.push(puzzle);
      solutions.push([]);

      // solve here
      solve(i, opts);

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

function displaySoln(index){

  appendBoard(puzzles[index], true, '', index);

  // begin modified code from CMSC 150 and CMSC 191 projects
    // for pagination
    reviews = solutions[index];
    perPage = 100;

    if(reviews.length){
      document.getElementById("resultHead").innerHTML = 'Total number of solutions: '+reviews.length+'</div>'

      // for download link
      var create = document.getElementById('downloadlink-'+index);
      create.addEventListener('click', function () {
        var solnText = getSolnText(index);

        console.log(solnText);

        var link = document.getElementById('downloadlink-'+index);
        link.href = makeTextFile(solnText);
        link.style.visibility = 'visible';
      }, false);
    }
    else{
      var layout = '<div class="page-content"><p class="alert alert-danger">No solutions found.</p></div></div>';
      $('#main').html(layout);
    }
  // end modified code from CMSC 150 and CMSC 191 projects


  // for(var i=0; solutions[index] && i<solutions[index].length; i++){
  //   // printBoard(solutions[index][i]);
  //   appendBoard(solutions[index][i], false, (i+1));
  // }

  // display results
  for(var i=0; i<perPage && i<reviews.length; i++){
    appendBoard(solutions[index][i], false, (i+1), index);
  }

  // begin modified code from CMSC 191 project
    // setup pagination
    $(function(){
      $('.resultPagination').pagination({
        items: reviews.length,
        itemsOnPage: perPage,
        cssStyle: 'light-theme',
        onPageClick: changeItems
      })
    });
  // end modified code from CMSC 191 project
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

function appendBoard(board, initial=false, index='', n=''){

  curIndex = n;

  var caption = 'Solution '+index;
  var tClass = 'soln';
  var table = '';

  if(initial){
    caption = 'Initial configuration'
    tClass = 'ini';
    table += '<div class="dl"><a class="btn btn-primary pull-right" download="solution-n-'+(n+1)+'.txt" id="downloadlink-'+n+'">Download solutions</a></div>'
  }

  table += '<div class="'+tClass+'"><table class="table table-responsive table-bordered table-hover"><caption>'+caption+'</caption><tbody>';

  for(var i=0; i<board.length; i++){
    table+= '<tr>';
    for(var j=0; j<board[i].length; j++){
      table+= '<td>' + board[i][j] + '</td>';
    }
    table+= '</tr>';
  }

  table+= '</tbody> </table> </div>';

  if(initial){
    $('#main').html(table);

    // begin modified code from CMSC 191 project
      var layout = '<div class="col-md-12" id="resultHead"></div>\
                    <div class="col-md-12 resultPagination" style="padding: 15px;"></div>\
                    <div class="col-md-12" id="result"></div>\
                    <div class="col-md-12 resultPagination" style="padding: 15px;"></div>'

      $('#main').append(layout);
    // end modified code from CMSC 191 project
  }
  else{
    $('#result').append(table);
  }

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
        <pre>Expected format for input files:<br/><br/>2&#9;&#9;&#9;// number of puzzles<br>'+
          '3&#9;&#9;&#9;// size of ith board<br>'+
          '0 0 0<br>'+
          '0 0 0<br>'+
          '0 0 0<br>'+
          '4&#9;&#9;&#9;// size of ith board<br>'+
          '0 0 0 0<br>'+
          '0 0 0 0<br>'+
          '0 0 0 0<br>'+
          '0 0 0 0<br>'+
        '</pre>\
      </div>\
    </div>';
  $('#wrapper').html(home);
}

function uploadFile(){
  $("#txtFileInput").prop('disabled', false);
  $('#txtFileInput').trigger('click');
}
