class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    // Create tr element
    const row = document.createElement("tr");
    // insert cols
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td> <a href="#" class="delete">X</a></td>
  `;

    list.appendChild(row);
  }
  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");

    // Add Class
    div.className = `alert ${className}`;

    // Add text
    div.appendChild(document.createTextNode(message));

    // Get Parent
    const container = document.querySelector(".container");

    // get Form
    const form = document.querySelector("#book-form");

    // insert alert
    container.insertBefore(div, form);

    // timeout after 3secs
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = " ";
    document.getElementById("author").value = " ";
    document.getElementById("isbn").value = " ";
  }
}

// Local Storage Class

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      // Add book to Ui
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      const ui = new UI();

      if (book.isbn == isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event Listeners
document.getElementById("book-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get Form Values
  const title = document.getElementById("title").value,
    author = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // instanciate book
  const book = new Book(title, author, isbn);

  // Instanciate UI
  const ui = new UI();

  // validate
  if (title == " " || author == " " || isbn == " ") {
    // Error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add Book To List
    ui.addBookToList(book);

    //   Add to Local storage
    Store.addBook(book);

    //   Show success
    ui.showAlert("Book Added", "success");

    // clear fields
    ui.clearFields();
  }
});

// Event Listener for delete
document.getElementById("book-list").addEventListener("click", function (e) {
  // intanciate Ui
  const ui = new UI();

  ui.deleteBook(e.target);

  // remove from Local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show alert
  ui.showAlert("Book removed!", "success");

  e.preventDefault();
});
