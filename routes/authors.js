const express = require ('express')
const router = express.Router()
const Author = require('../models/author')

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

module.exports = router