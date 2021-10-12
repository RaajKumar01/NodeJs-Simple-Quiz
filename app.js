const express = require('express');
const session = require('express-session')
const app = express();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret:"your secret",
    resave: false,
    saveUninitialized: true
}))

const GeneralScience = [
    {
        question: "Brass gets discoloured in air because of the presence of which of the following gases in air?",
        option: [
            {
               oid: "A",
               option: "Oxygen"
            },
            {
                oid: "B",
                option: "Hydrogen sulphide"
            },
            {
                oid: "C",
                option: "Carbon dioxide"
            },
            {
                oid: "D",
                option: "Nitrogen"
            },
        ],
        answer: "Hydrogen sulphide"
    },
    {
        question: "Which of the following is a non metal that remains liquid at room temperature?",
        option: [
            {
               oid: "A",
               option: "Phosphorous"
            },
            {
                oid: "B",
                option: "Bromine"
            },
            {
                oid: "C",
                option: "Chlorine"
            },
            {
                oid: "D",
                option: "Helium"
            },
        ],
        answer: "Bromine"
    },
    {
        question:  "Chlorophyll is a naturally occurring chelate compound in which central metal is",
        option: [
            {
               oid: "A",
               option: "Copper"
            },
            {
                oid: "B",
                option: "Magnesium"
            },
            {
                oid: "C",
                option: "Iron"
            },
            {
                oid: "D",
                option: "Calcium"
            },
        ],
        answer: "Magnesium"
    },
    {
        question:  "Which of the following is used in pencils?",
        option: [
            {
               oid: "A",
               option: "Graphite"
            },
            {
                oid: "B",
                option: "Silicon"
            },
            {
                oid: "C",
                option: "Charcoal"
            },
            {
                oid: "D",
                option: "Phosphorous"
            },
        ],
        answer: "Graphite"
    },
    {
        question: "Which of the following metals forms an amalgam with other metals?",
        option: [
            {
               oid: "A",
               option: "Tin"
            },
            {
                oid: "B",
                option: "Mercury"
            },
            {
                oid: "C",
                option: "Lead"
            },
            {
                oid: "D",
                option: "Zinc"
            },
        ],
        answer: "Mercury"
    }
]



app.use(function(req, res, next) {
    res.locals.userName = req.session.userName;
    res.locals.GeneralScience = req.session.GeneralScience;
    res.locals.questionid = req.session.questionid;
    res.locals.score = req.session.score;
    next();
  });
  
  
app.get(['/','/index'], (req, res) => {

    if(req.session.logged) return res.redirect('quiz')

    res.render('index');
}); 

app.post(['/','/index'], (req, res) => {
    
    req.session.userName = req.body.userName;
    req.session.logged = true;
    req.session.GeneralScience = GeneralScience;
    req.session.questionid = 0; 
    req.session.score = 0;
    req.session.inQuiz = true;
    res.redirect('quiz');
}); 

app.get('/quiz', (req, res) => {
      
      if(!req.session.logged) return res.redirect('index')
      
      res.render('quiz');
    
});

app.post('/checkanswer', (req, res) => {

   req.session.answer = req.body.option_submit.toLowerCase();
   if(req.session.questionid != (GeneralScience.length - 1) ) 
   {
        if(GeneralScience[req.session.questionid]["answer"].toLowerCase() === req.session.answer) 
        {
                req.session.score += 1;
        }        
       
        req.session.questionid += 1;
      
   }
   else {
       
       req.session.inQuiz = false;
       return res.redirect('result')

   }
  
   res.redirect('quiz');     
});

app.get('/result', (req, res) => {


   if(!req.session.logged) return res.redirect('index')
   if(req.session.inQuiz) return res.redirect('quiz') 
   
   res.render('results')
});

app.post('/quit', (req, res) => {
    
    req.session.destroy();

    res.redirect('/')
 });

app.listen(8000, () => {console.log("Server is started!")});