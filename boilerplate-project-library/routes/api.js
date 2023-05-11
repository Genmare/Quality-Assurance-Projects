/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.getAllBooks();
      console.log('get books: ', books);
      return res.json(books);
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        return res.send('missing required field title');
      }
      console.log('post: ', title);
      const newBook = (await Book.createBook(title)).toJSON();
      console.log('newBook:', newBook)
      const result = { _id: newBook._id.toString(), title: newBook.title };
      console.log('post :', result);
      // res.json({...newBook, _id: newBook.id});
      res.json({ _id: newBook._id.toString(), title: newBook.title });
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      const result = await Book.deleteAllBooks();
      console.log(result);
      res.send('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      let book = await Book.getBook(bookid);
      console.log('get book: ', book);
      if (!book)
        return res.send('no book exists');
      book = book.toObject();
      res.json({...book, _id: book._id.toString()});
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) 
        return res.send('missing required field comment');

      const doc = await Book.addComment(bookid, comment);
      console.log('post comment, doc', doc);
      
      if (!doc)
        return res.send('no book exists');
      const { commentcount, ...book } = doc.toObject();
      console.log('post comment, book', book);
      const result = {...book, _id: book._id.toString()};
      console.log('post comment, result', book);
      res.json(result);
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const result = await Book.deleteBook(bookid);

      if (!result)
        return res.send('no book exists');

      res.send('delete successful');
    });
  
};
