const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const ejs = require('ejs');
const path = require('path');
const router = express.Router();
app.use(cookieParser());
app.use(
	session({
		key: "user_sid",
		secret: "somerandonstuffs",
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000,
		},
	})
);


app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie("user_sid");
	}
	next();
});


// middleware function to check for logged-in users

var sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		res.redirect("/Dashboard");
	} else {
		next();
	}
};
// ended here 



require("./model/connection")
var User = require('./model/registrationSchema');

var Contact = require('./model/contactschema');
var Product = require('./model/addproductschema');



//30052023
const multer = require('multer');

// router.post('/signin', (req, res) => {
// 	var user = new User({
// 		details: req.body.EmailIN,
// 		epwd: req.body.PassIN,
// 		eemail: req.body.eemail,
// 		file: req.body.file,
// 		remember: req.body.remember
// 	})
// });


// 29052023







// app.use(session({
// 	key: "user_sid",
// 	secret: "somerandomstuffs",
// 	resave: false,
// 	saveUnintialized: false,
// 	cookies: {
// 		expiress: 500000,
// 	}
// })
// )


// const User = require("./model/registrationSchema")
app.use(express.static("views"));
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));





// Set EJS as templating engine
app.set('view engine', 'ejs');

router.get('/', function (req, res) {
	res.render('index');
});


router.get('/pizza', function (req, res) {
	res.render('pizza');
});

router.get('/service', function (req, res) {
	res.render('service');
});

router.get('/contact', function (req, res) {
	res.render('contact');
});







router.get('/signup', function (req, res) {
	res.render('signup');
})


router.post('/signup', (req, res) => {
	var user = new User({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		cpassword: req.body.cpassword

	});

	user.save().then(() => {
		console.log('saved data');
	})
		.catch((err) => {
			console.log(err);
		})
});



//29052023

router.get('/login', async (req, res) => {
	res.render("login");
});

router.post('/login', async (req, res) => {
	var email = req.body.email;
	pass = req.body.pass;
	try {
		var user = await User.findOne({ email: email })//&& {pass:pass})
			.exec();
		if (!user) {
			console.log("log 1")
			res.redirect("/login");
		} else {
			bcrypt.compare(pass, user.password);
			const isMatch = await bcrypt.compare(pass, user.password);
			console.log("if its true so sign in or otherwise login page redirect" + isMatch);
			if (!isMatch) {
				res.redirect("/login")
			} else {
				req.session.user = user;
				res.redirect("/Dashboard");
			}
		}




	} catch (error) {
		console.log(error)
	}
});

// router.get('/Dashboard', async (req, res) => {
// 	try {
// 		if (req.session.user && req.cookies.user_sid) {
// 			const data = await User.find();
// 			res.render('dashboard/index', { data: data });
// 		} else {
// 			res.redirect("/login");
// 		}
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

router.get('/Dashboard', async (req, res) => {
	try {
		if (req.session.user && req.cookies.user_sid) {
			const data = await User.find();
			res.render('dashboard', { data: data });
		} else {
			res.redirect("/login");
		}
	} catch (err) {
		console.log(err);
	}
});



router.get('/viewproduct', async (req, res) => {
	try {
		const data = await Product.find({});
		res.render('Dashboard/viewproduct', { data: data });

		console.log(data);
	} catch (err) {
		console.log(err)
	}
});


router.post('/contact', (req, res) => {
	var user = new Contact({
		namecon: req.body.namecon,
		emailcon: req.body.emailcon,
		subjectcon: req.body.subjectcon,
		msgcon: req.body.msgcon
	})

	user.save().then(() => {
		console.log('saved data');
	})
		.catch((err) => {
			console.log(err);
		})
});





router.post('/signin', (req, res) => {
	var user = new User({
		EmailIN: req.body.EmailIN,
		PassIN: req.body.PassIN,

	});

	user.save().then(() => {
		console.log('saved data');
	})
		.catch((err) => {
			console.log(err);
		})
});
router.get('/addproduct', function (req, res) {
	res.render('dashboard/addproduct');
})


router.post('/addproduct', (req, res) => {
	console.log("post_addproduct : started");
	var product = new Product({
		details: req.body.details,
		subdetails: req.body.subdetails,
		enterdesc: req.body.enterdesc,
		attachfile: req.body.attachfile
	});
	
	console.log("post_addproduct : saving data");

	product.save().then(() => {
		console.log('saved data addproduct data');
	})
		.catch((err) => {
			console.log(err);
			
		})
		
	console.log("post_addproduct : ending");
});

router.get('/viewregister', async (req, res) => {
	try {
		const data2 = await User.find({});
		res.render('Dashboard/viewregistration', { data: data2 });

		console.log(data2);
	} catch (err) {
		console.log(err)
	}
});





router.get('/viewcontact', async (req, res) => {
	try {
		const contacts = await Contact.find({});
		res.render('Dashboard/viewcontact', { data: contacts });

		console.log(contacts);
	} catch (err) {
		console.log(err)
	}
});


//23052023 dated 

// delete user by id
router.get('/deleteregister/:id', async (req, res) => {
	User.findByIdAndDelete(req.params.id).then(user => {
		if (user) {
			console.log("get_deleteregister if")
			return res.redirect('../viewregister')
		} else {
			console.log("get_deleteregister else")
			return res.redirect('../viewregister')
		}
	})
});

router.get('/deletecontactus/:id', async (req, res) => {
	Contact.findByIdAndDelete(req.params.id).then(user => {
		if (user) {
			return res.redirect('../viewcontact')
		} else {
			return res.redirect('../viewcontact')
		}
	})
});

router.get('/deleteproduct/:id', async (req, res) => {
	Product.findByIdAndDelete(req.params.id).then(product => {
		if (product) {
			return res.redirect('../viewproduct')
		} else {
			return res.redirect('../viewproduct')
		}
	})
});



// router.get('/edit', function (req, res) {
// 	res.render('dashboaard/edit');
// });


// 24052023
router.get('/editregister/:id', async (req, res) => {
	try {
		const update = await User.findById(req.params.id);
		res.render('Dashboard/editregister', { data: update });
	} catch (err) {
		console.log(err);
		//res.redirect('/viewregistration')
	}
});

router.post('/editregister/:id', async (req, res) => {
	var updatelogin = {
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		cpassword: req.body.cpassword
	}
	try {
		await User.findByIdAndUpdate(req.params.id, updatelogin);
		res.redirect('/viewregister');
	} catch (err) {
		res.redirect('/editregister' + req.params.id);
	}
});

//express-session and cookie-parser 24052023


router.get('/editproduct/:id', async (req, res) => {
	try {
		console.log("edit_product try succesfull");
		const productupdate = await Product.findById(req.params.id);
		res.render('Dashboard/editproduct', { data: productupdate });
	} catch (err) {
		console.log(err);
		//res.redirect('/viewproduct')
	}
});
router.post('/editproduct/:id', async (req, res) => {
	var updateproduct = {
		details: req.body.details,
		subdetails: req.body.subdetails,
		enterdesc: req.body.enterdesc,
		attachfile: req.body.attachfile
	}
	try {
		await Product.findByIdAndUpdate(req.params.id, updateproduct);
		res.redirect('/viewproduct');
	} catch (err) {
		res.redirect('/editproduct' + req.params.id);
	}
});



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '../upload');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
		//cb(null,uuidv4()+path.extname(file.originalname))
	}
})

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
	if (allowedFileTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

let upload = multer({ storage, fileFilter });

// router.get('/addproduct', upload.single('addproduct'), function (req, res) {
// 	res.render('Dashboard/addproduct');
// });





// router.get('/viewcontact', function (req, res) {
// 	res.render('Dashboard/viewcontact');
// });

router.get('/viewcontact', async (req, res) => {
	try {
		const data = await Product.find({});
		res.render('Dashboard/viewcontact', { data: data });

		console.log(data);
	} catch (err) {
		console.log(err)
	}
});


app.use('/', router);	// this defaul////// page 

const server = app.listen(5555, function () {
	console.log('listening to port 5555')
});


// LOgout API
app.get("/logout",(req,res)=>{
	if(req.session.user && req.cookies.user_sid){
		res.clearCookie("user_sid");
		res.redirect("/login")
	}else{
		res.redirect("/login")
	}
});

router.get('/editcontact/:id',async(req,res)=>{
	try{
		const data=await Contact.findById(req.params.id);
		console.log(data);
		res.render('dashboard/product_edit',{data:data});
	} catch (err){
		console.log(err);
	}
});

router.post('editcontact/:id',async (req,res)=>{
	try{
		const updateviewcontact = {
			details:req.body.details,
			subdetails:req.body.subdetails,
			enterdesc:req.body.enterdesc
			

		};
		const data = await User2.findByIdAndUpdate(req.params.id,updateviewcontact)
		console.log(data)
		res.render('/dashboard/viewproduct',{data:data})
		res.redirect('viewproduct')
	}
	catch(err){
		console.log(err)
	}
})