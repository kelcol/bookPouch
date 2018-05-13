(function() {

  'use strict';

  let ENTER_KEY = 13;
  let newBookDom = document.getElementById('new-book');
  let syncDom = document.getElementById('sync-wrapper');

  let db = new PouchDB('books');
  let remoteCouch = false;

  db.changes({
    since: 'now',
    live: true,
  }).on('change', showBooks);

  // Create a new book
  function addBook(title,author) {
    let book = {
      _id: new Date().toISOString(),
      title: title,
      author: author,   
      completed: false  
    };

    // PUT new book into db using promises
    db.put(book).then(function (result) {
      console.log('Everything is fine');
      console.log(result);
    }).catch(function (err) {
      console.log('Everything is terrible');
      console.log(err);
    });
  }

  // Show current list of books by reading them from the db
  function showBooks() {
    db.allDocs({include_docs: true, descending: true}).then(function(doc) {
      redrawBooksUI(doc.rows);
    }).catch(function (err) {
      console.log(err);
      console.log(err);
    });
  }

  // Mark book as complete on box check
  function checkboxChanged(book, event) {
    book.completed = event.target.checked;
    console.log(book);
    // Update book in db
    db.put(book);
  }

  // When delete is selected remove book from db
  function deleteButtonPressed(book) {
    db.remove(book);
  }

  // When book input is emptied, remove book from db else put it back with edits
  function bookBlurred(book, event) {
    let trimmedText = event.target.value.trim();
    if (!trimmedText) {
      db.remove(book);
    } else {
      book.title = trimmedText;
      db.put(book);
    }
  }

  // Allow syncing with remote db
  function sync() {
    syncDom.setAttribute('data-sync-state', 'syncing');    
    let opts = {live: true};
    db.sync(remoteCouch, opts, syncError);
  }

  function syncError() {
    syncDom.setAttribute('data-sync-state', 'error');
  }

  // Display input
  function bookDblClicked(book) {
    let div = document.getElementById('li_' + book._id);
    let inputEditBook = document.getElementById('input_' + book._id);
    div.className = 'editing';
    inputEditBook.focus();
  }

  function bookKeyPressed(book, event) {
    if (event.keyCode === ENTER_KEY) {
      let inputEditBook = document.getElementById('input_' + book._id);
      inputEditBook.blur();
    }
  }


  function createBookListItem(book) {
    let checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', checkboxChanged.bind(this, book));

    let label = document.createElement('label');
    label.appendChild( document.createTextNode(book.title));
    label.addEventListener('dblclick', bookDblClicked.bind(this, book));

    let deleteLink = document.createElement('button');
    deleteLink.className = 'destroy';
    deleteLink.addEventListener( 'click', deleteButtonPressed.bind(this, book));

    let divDisplay = document.createElement('div');
    divDisplay.className = 'view';
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    let inputEditBook = document.createElement('input');
    inputEditBook.id = 'input_' + book._id;
    inputEditBook.className = 'edit';
    inputEditBook.value = book.title;
    inputEditBook.addEventListener('keypress', bookKeyPressed.bind(this, book));
    inputEditBook.addEventListener('blur', bookBlurred.bind(this, book));

    let li = document.createElement('li');
    li.id = 'li_' + book._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditBook);

    if (book.completed) {
      li.className += 'complete';
      checkbox.checked = true;
    }

    return li;
  }

  function redrawBooksUI(books) {
    let ul = document.getElementById('book-list');
    ul.innerHTML = '';
    books.forEach(function(book) {
      ul.appendChild(createBookListItem(book.doc));
    });
  }

  function newBookKeyPressHandler( event ) {
    if (event.keyCode === ENTER_KEY) {
      addBook(newBookDom.value);
      newBookDom.value = '';
    }
  }

  function addEventListeners() {
    newBookDom.addEventListener('keypress', newBookKeyPressHandler, false);
  }

  addEventListeners();
  showBooks();

  if (remoteCouch) {
    sync();
  }



  /// end

  
})();