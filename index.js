const express = require("express");

const app = express();
const port = 4000;
app.use(express.json());
var dateObject = new Date();
let date = dateObject.toUTCString();

let users = [
	{
		email: "jacob@email.com",
		password: "jacob123",
		isAdmin: false
	},
	{
		email: "enzo@email.com",
		password: "enzo123",
		isAdmin: false
	},
	{
		email: "angeloRomerosa@email.com",
		password: "angeloPASSWORD",
		isAdmin: true
	}
];

let products = [
    {
        name: "Toyota Hilux",
        description: "Pick-Up",
	    price: 1800000, 
        isActive: true, 
        createdOn: date
    }, 
    {
	    name: "Toyota Fortuner",
        description: "SUV",
        price: 2000000, 
        isActive: true, 
        createdOn: date
    },
    {
	    name: "Toyota Vios",
        description: "Sedan",
        price: 800000, 
        isActive: true, 
        createdOn: date
    },
    {
	    name: "Toyota Innova",
        description: "MPV",
        price: 1300000, 
        isActive: false, 
        createdOn: date
    }

];

let order = [
	{
		userId: 123,
		products: products[0],
		totalAmount: 1,
		purchaseOn: date
	},
	{
		userId: 324,
		products: products[1],
		totalAmount: 1,
		purchaseOn: date
	},
	{
		userId: 456,
		products: products[2],
		totalAmount: 1,
		purchaseOn: date
	},
	{
		userId: 678,
		products: products[3],
		totalAmount: 1,
		purchaseOn: date
	}
];

let loggedUser;
let newProducts = [];
let newProductsID = [];

//Registration
 app.post('/users', (req, res) =>{

 	console.log(req.body);

 	let newUsers = {
 		email: req.body.email,
 		password: req.body.password,
 		isAdmin: req.body.isAdmin
 	};

 	users.push(newUsers);
 	console.log(users);

 	res.status(201).send('Registered Successfully.')

 });

//Authentication
 app.post('/users/login', (req, res)=> {
	console.log(req.body);

	let foundUser = users.find((user) => {
		return user.email === req.body.email && user.password === req.body.password;
	});

	if(foundUser !== undefined){
		let foundUserIndex = users.findIndex((user) => {
			return user.email === foundUser.email
		});

		foundUser.index = foundUserIndex;
		loggedUser = foundUser;
		console.log(loggedUser);

		res.status(201).send('Thank you for logging in')
	} else {
		loggedUser = foundUser;
		res.status(401).send('Login failed. Wrong credentials.');
	}
});

//creating product
app.post('/products/create', (req, res) => {
	console.log(loggedUser);
	console.log(req.body);

	if(loggedUser.isAdmin === true){
		if (!Array.isArray(req.body)){
			return res.status(400).send('Invalid request body. Expected an array of products.');
		}
		const newproducts = req.body.map((product) => {
			return {
				name: product.name,
				description: product.description,
				price: product.price,
				isActive: product.isActive,
				isCreatedOn: product.isCreatedOn
			};
		});


	    products.push(...newproducts);
		console.log(products);

		res.status(201).send('You have added a new product.');
	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
	}
});

//Retrieve all product
app.get('/products/retrieve', (req, res) => {
	console.log(loggedUser);

	if (loggedUser.isAdmin === true){
		res.send(products);
	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
    }
 });

//Retrieve only active product
app.get('/products', (req, res) => {

	if (loggedUser.isAdmin === true){

        for (var index = 0; index < products.length; index++) {
            if (products[index].isActive === true) {
                newProducts.push(products[index]);
           }
        }

        res.send(newProducts);

	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
    }

 });

//Retrieve products based on productID
app.get('/products/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let indexInput = parseInt(req.params.productId);
	let productIDget = products[indexInput];

	console.log(productIDget);
	res.send(productIDget);
	
 });

//Update products
app.put('/products/update/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let indexInput = parseInt(req.params.productId);
	let productIDget = products[indexInput];


	if (loggedUser.isAdmin === true){
		if(indexInput < products.length){
			let newproducts = {
			    name: req.body.name,
		        description: req.body.description,
		        price: req.body.price,
		        isActive: req.body.isActive,
		        isCreatedOn: req.body.isCreatedOn
		    }
		    products[indexInput] = newproducts;
	        console.log(products);
	        res.send(products);
		} else {
			res.status(404).send('Product does not exist');
		}
	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
	}
});

//Archive
app.put('/products/archive/:productId', (req, res) => {
	console.log(loggedUser);
	console.log(req.params);
	console.log(req.params.productId);
	let indexInput = parseInt(req.params.productId);
	let productIDget = products[indexInput];


	if (loggedUser.isAdmin === true){
		res.send(productIDget);
		products.isActive = false;
		console.log(productIDget);
		
	    
	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
	}
});

//Retrieves All orders
app.get('/users/orders', (req, res) => {

	if (loggedUser.isAdmin === true){
		res.send(order);

	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
    }

 });

//Delete Orders
app.delete('/orders/delete/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let indexInput = parseInt(req.params.productId);
	delete order[indexInput];
	res.status(203).send(order);
	console.log(order);
	
 });

app.listen(port, () => console.log(`Server is running at ${port}`));