const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const dbConnect = require("./db");
const FormData = require("./User");
const Blog = require("./Blog");
const QueryData = require("./Querypost");
const Contact = require("./Contact");
const User = require("./User");


require("dotenv").config()
const PORT = process.env.PORT ;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(
  // Set up session middleware
  session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true
  })
);


app.get("/", async (req, res) => {
    res.send("hii");
  });

  app.post('/login', (req, res) => {
    const { username, password,isAdmin} = req.body;
    User.findOne({ username })
      .then(user => {
        if (user) {
          // User already exists, attempt login
          bcrypt.compare(password, user.password)
            .then(result => {
              if (result === true) {
                const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'your_secret_key', { expiresIn: '1h' });
                req.session.token = token;
                if (user.isAdmin) {
                  res.send(user)
                } else {
                  res.send(user);
                }
              } else {
                res.status(401).json({ message: 'Invalid username or password' });
              }
            })
            .catch(err => {
              throw err;
            });
        } else {
          // User does not exist, create new user
          bcrypt.hash(password, 10)
            .then(hash => {
              const newUser = new User({ username, password: hash, isAdmin });
              newUser.save()
                .then(() => {
                  const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, 'your_secret_key', { expiresIn: '1h' });
                  req.session.token = token;
                  if (newUser.isAdmin) {
                    res.send('hii admin');
                  } else {
                    res.send('hi user');
                  }
                })
                .catch(err => {
                  throw err;
                });
            })
            .catch(err => {
              throw err;
            });
        }
      })
      .catch(err => {
        throw err;
      });
  });
  



// add blog 
  app.post('/blog', async (req, res) => {
    try {
      const formData = new Blog(req.body);
      const savedFormData = await formData.save();
      res.status(201).json(savedFormData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // delete req 
  app.delete('/blog/:id', async (req, res) => {
    try {
      const blogId = req.params.id;
      const deletedBlog = await Blog.findByIdAndDelete(blogId);
  
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
  
      res.json(deletedBlog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // get blogs 
  app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });




  //query 

  app.post('/querypost', async (req, res) => {
    try {
      const formData = new QueryData(req.body);
      const savedFormData = await formData.save();
      res.status(201).json(savedFormData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Get all blog posts
  app.get('/querypost', async (req, res) => {
    try {
      const blogPosts = await QueryData.find();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// delete query post
app.delete('/querypost/:id', async (req, res) => {
  try {
    const queryId = req.params.id;
    const deletedQuery = await QueryData.findByIdAndDelete(queryId);

    if (!deletedQuery) {
      return res.status(404).json({ error: 'QueryData post not found' });
    }

    res.json(deletedQuery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




    //contact post 
    app.post('/contact', async (req, res) => {
      try {
        const formData = new Contact(req.body);
        const savedFormData = await formData.save();
        res.status(201).json(savedFormData);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

// get all data 
    app.get('/getcontactdata', async (req, res) => {
      try {
        const blogPosts = await Contact.find();
        res.json(blogPosts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

   // delete contact data
app.delete('/deletecontactdata/:id', async (req, res) => {
  try {
    const contactId = req.params.id;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact data not found' });
    }

    res.json(deletedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








app.listen(PORT || 6000, () => {
  dbConnect();
  console.log(`Server started on port ${PORT}`);
});
