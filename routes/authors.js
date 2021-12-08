const { render } = require('ejs')
const express = require ('express')
const app = express()
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

//all authours
router.get('/',async (req,res) => {

    let SearchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        SearchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(SearchOptions)
        res.render ('authors/index', {
            authors: authors, 
            SearchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }
    
})

// new authors route
router.get('/new',(req,res) =>{
    res.render('authors/new',{author: new Author})
})

//create author route
router.post('/', async (req,res) =>{
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor =await author.save()
        //res.redirect('authors/${newAuthor.id}')
        res.redirect('authors')
    } catch (error) {
        res.render('authors/new',{
         author: author,
         errorMessage: 'there was an error creating the author'
        })
    }
    
})

router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
      } catch {
        res.redirect('/authors')
      }
    
})

router.put('/:id', async (req, res) => {
    let author
    try {
      author = await Author.findById(req.params.id)
      author.name = req.body.name
      await author.save()
      res.redirect(`/authors/${author.id}`)
    } catch {
      if (author == null) {
        res.redirect('/')
      } else {
        res.render('authors/edit', {
          author: author,
          errorMessage: 'Error updating Author'
        })
      }
    }
  })

router.delete('/:id', async (req, res) => {
    let author
    try {
      author = await Author.findById(req.params.id)
      await author.remove()
      res.redirect(`/authors`)
    } catch {
      if (author == null) {
        res.redirect('/')
      } else {
        res.redirect(`/authors/${author.id}`)
      }
    }
})

module.exports = router