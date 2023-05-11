const mongoose = require('mongoose');
const MockMongoose = require('mock-mongoose').MockMongoose;

let mockMongoose = null;
if(process.env.NODE_ENV !== 'test'){
  mockMongoose = new MockMongoose(mongoose);
  mockMongoose.prepareStorage().then(function () {
    mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });  
  });

} else {
  mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: {
    type: [String],
    default: []
  }
}, { collection: 'fcc_library', versionKey: false });

const Book = mongoose.model('Book', bookSchema);

const isValidId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/)
}

const createBook = async (bookName) => {
  const book = new Book({ title: bookName });
  await book.save();
  console.log('createBook : ', book)
  return book;
}

const getAllBooks = async () => {
  const books = await Book.find({}, '_id title commentcount');
  return books;
}

const getBook = async (id) => {
  if (!isValidId(id)) return null;
  const book = await Book.findById(id, '_id title comments');
  return book;
}

const addComment = async (id, comment) => {
  console.log('addComment id :', id, ' comment:', comment);
  if (!isValidId(id)) return null;
  const book = await Book.findById(id, '_id title commentcount comments');
  console.log('addComment book: ', book);
  if(book){
    book.commentcount++;
    book.comments.push(comment);
    await book.save();
  }
  return book;
}

const deleteBook = async (id) => {
  if (!isValidId(id)) return null;
  const removedBook = await Book.findByIdAndRemove(id);
  return removedBook;
}

const deleteAllBooks = async () => {
  return await Book.collection.drop();
}

module.exports = {
  Book,
  createBook,
  getAllBooks,
  getBook,
  addComment,
  deleteBook,
  deleteAllBooks,
  mockMongoose
}