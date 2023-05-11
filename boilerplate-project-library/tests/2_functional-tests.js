/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../book');

chai.use(chaiHttp);

if ( Book.mockMongoose && Book.mockMongoose.helper.isMocked() === true ) {
  // mongoose object is mocked
  console.log('isMocked')
} else {
  console.log('is not Mocked')
}

suite('Functional Tests', function() {
  // this.timeout(120000);  

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // before( async () => {
  //   await Book.createBook('get book title');
  // });
  // before( function (done) {
  //   Promise.all([
  //     Book.deleteAllBooks(),
  //     Book.createBook('get book title')
  //   ]).then(() => done());
  // });

  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });

  // // after( async () => {
  // //   await Book.Book.deleteOne({title: 'get book title' });
  // // });
  
  // after( function (done) {
  //   // Book.deleteAllBooks().then(() => done());
  //   console.log('GET /api/books after ')
  //   Book.Book.deleteOne({title: 'get book title' }).then(() => done());
  //   // Book.mockMongoose.helper.reset().then(() => {
  //   //   done();
  //   // });
  // });

  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {
    // this.timeout(120000);  

    suite('POST /api/books with title => create book object/expect book object', function() {
      const bookTitle = 'Moby Dick';
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: bookTitle })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.body.title, bookTitle);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            // console.log('post without title :', res);
            assert.equal(res.text, 'missing required field title');
            done(); 
          });
      });

      // after( async () => {
      //   // Book.deleteAllBooks().then(() => done());
      //   // await Book.deleteAllBooks();
      //   await Book.Book.deleteOne({title: bookTitle });
      //   // done();
      // });
      
      // after( function (done) {
      suiteTeardown( function (done) {
        Book.deleteAllBooks().then(() => done());
        
        // Book.mockMongoose.helper.reset().then(() => {
        //   done();
        // });
      });
    });


    suite('GET /api/books => array of books', function(){
      // this.timeout(120000);  

      const books = [
        { title: 'book title 1'},
        { title: 'book title 2'},
        { title: 'book title 3'},
      ]
      let docs = null;
      // before( function (done) {
      // // beforeEach( function (done) {
      //   Book.deleteAllBooks().then( () => {
      //     Book.Book.insertMany(books).then((ds) => {
      //       docs = ds.map( doc => {
      //         const book = doc.toObject();
      //         return { 
      //           _id: book._id.toString(),
      //           title: book.title,
      //           commentcount: book.commentcount,
      //         };
      //       });
      //       console.log('docs :', docs);
      //       done(); 
      //     });
      //   });
      // });

      // beforeEach( async function() {
      setup( async function() {
        // await Book.deleteAllBooks();
        const ds = await Book.Book.insertMany(books);
        const getbooks = await Book.getAllBooks();
        console.log('before books :', getbooks)
        docs = ds.map( doc => {
          const book = doc.toObject();
          return { 
            _id: book._id.toString(),
            title: book.title,
            commentcount: book.commentcount,
          };
        });
        console.log('docs :', docs);
        const db = await Book.getAllBooks();
        console.log('db :', db);
      });
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.deepEqual(res.body, docs);
          done();
        });
      });      

      // afterEach( async function () {
      //   // Book.deleteAllBooks().then(() => done());
      //   const del = await Book.deleteAllBooks();
      //   console.log('del :', del);
      // });
       
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      let id;
      const fakeId = "645ab6647a5acf154bc33b450";
      const newBookTitle = 'New Book';
      // before(async function() {
      setup(async function() {
        const book = await Book.createBook(newBookTitle);
        id = book._id;
        console.log('GET /api/books/[id] book :', book);
      });
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get(`/api/books/${fakeId}`)
          .end((err, res) => {
            console.log('not in db, res.body', res.body)
            // assert.equal(res.status, 404);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', async function(){
        const book = await Book.createBook(newBookTitle);
        id = book._id;
        console.log('GET /api/books/[id] book :', book);
        console.log('id.toString() :', id.toString())
        chai.request(server)
        .get(`/api/books/${id.toString()}`)
        .end((err, res) => {
          console.log('with valid id in db res.body', res.body)
          assert.isObject(res.body);
          assert.deepEqual(res.body, { 
            _id: id.toString(),
            title: newBookTitle,
            comments: [],
          })
          // done();
        });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      let CommentedId, UncommentedId ;
      const titleWithComment = 'test commented book';
      const titleWithoutComment = 'test book without comment';
      const comment ='comment of the test';

      setup(async function() {
        const book = await Book.createBook(titleWithComment);
        CommentedId = book._id.toString();
        const bookdUncommented = await Book.createBook(titleWithoutComment);
        UncommentedId = bookdUncommented._id.toString();
        // await Book.addComment(book._id, 'comment of the test');
      });
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${CommentedId}`)
          .send({comment})
          .end((err, res) => {
            assert.isObject(res.body);
            assert.deepEqual(res.body, {
              _id: CommentedId, 
              title: titleWithComment, 
              comments: [comment]
            });
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${UncommentedId}`)
          .send({})
          .end((err, res) => {
            assert.isObject(res.body);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const fakeId = "645ab6647a5acf154bc33b450";
        chai.request(server)
          .post(`/api/books/${fakeId}`)
          .send({comment})
          .end((err, res) => {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });


      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      let id;
      setup(async function() {
        const book = await Book.createBook('deleted book');
        id = book._id.toString();
      });

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${id}`)
          .end((err, res) => {
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const fakeId = "645ab6647a5acf154bc33b450";
        chai.request(server)
          .delete(`/api/books/${fakeId}`)
          .end((err, res) => {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
