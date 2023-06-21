const express = require('express');
const app = express();
const port = 4000;

app.use(express.json());

let users = [
    {
        email: "admin",
        password: "admin",
        isAdmin: true
    },
    {
        email: "dummy",
        password: "dummy",
        isAdmin: false
    },
    {
        email: "qwe@email.com",
        password: "password",
        isAdmin: false
    }
];

let products = [
    {
        name: "Apple Juice",
        description: "Apple flavoured juice.",
        price: 120,
        isActive: false,
        createdOn: Date.now()
    },
    {
        name: "Mango Juice",
        description: "Mango flavoured juice.",
        price: 175,
        isActive: true,
        createdOn: Date.now()
    },
    {
        name: "Grape Juice",
        description: "Grape flavoured juice.",
        price: 190,
        isActive: true,
        createdOn: Date.now()
    }
];

let orders = [
    {
        userId: "dummy",
        products: [
            {
                name: "Grape Juice",
                price: 190,
                amount: 2
            }
        ],
        totalAmount: 380,
        purchasedOn: Date.now()
    },
    {
        userId: "qwe@email.com",
        products: [
            {
                name: "Mango Juice",
                price: 175,
                amount: 3
            }
        ],
        totalAmount: 525,
        purchasedOn: Date.now()
    }
];

let loggedUser = users[0];

app.listen(port, () => console.log(`Server is running at port ${port}`));

app.post('/users/signup', (req, res) => {
    console.log(req.body);
    let newUser = {
        email: req.body.email,
        password: req.body.password,
        isAdmin: false
    };
    users.push(newUser);
    console.log(users);
    res.send('Registered Successfully');
});

app.post('/users/login', (req, res) => {
    console.log(req.body);
    let foundUser = users.find((user) => {
        return user.email === req.body.email && user.password === req.body.password;
    });
    if (foundUser !== undefined) {
        let foundUserIndex = users.findIndex((user) => {
            return user.username === foundUser.username;
        });
        foundUser.index = foundUserIndex;
        loggedUser = foundUser;
        console.log(loggedUser);
        res.send('Login Successfull.');    
    } else {
        loggedUser = foundUser;
        res.send('Login failed, wrong credentials.')
    }
});

app.get('/users', (req,res) => {
    console.log(loggedUser);
    if(loggedUser.isAdmin === true) {
        res.send(users);
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

app.put('/users/setAdmin/:index', (req,res) => {
    console.log(req.params);
    console.log(req.params.index);
    let userIndex = parseInt(req.params.index);
    if (loggedUser.isAdmin === true) {
        users[userIndex].isAdmin = true;
        console.log(users[userIndex]);
        res.send('User set to Admin.');
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

app.put('/users/removeAdmin/:index', (req,res) => {
    console.log(req.params);
    console.log(req.params.index);
    let userIndex = parseInt(req.params.index);
    if (loggedUser.isAdmin === true) {
        users[userIndex].isAdmin = false;
        console.log(users[userIndex]);
        res.send('User removed as Admin.');
    } else {
        res.send('Unauthorized user, access denied.');
    }
});



app.post('/products/addProduct', (req, res) => {
    console.log(loggedUser);
    console.log(req.body);
    
    if (loggedUser.isAdmin === true) {
        let newProduct= {
            name: req.body.name, 
            description:req.body.description,
            price: req.body.price,
            isActive: true,
            createdOn: Date.now()
        };
        products.push(newProduct);
        console.log(products);

        res.send('You have added a new product');
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

app.get('/products', (req,res) => {
    res.send(products);
});

app.get('/products/activeProducts', (req,res) => {
    let activeProducts = products.filter( (item) => item.isActive == true); 
    res.send(activeProducts);
});

app.put('/products/archive/:index', (req,res) => {
    console.log(req.params);
    console.log(req.params.index);
    let productIndex = parseInt(req.params.index);
    if (loggedUser.isAdmin === true) {
        products[productIndex].isActive = false;
        console.log(products[productIndex]);
        res.send('Product Archived');
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

app.get('/products/:index', (req,res) => {
    console.log(req.params);
    console.log(req.params.index);
    let productIndex = parseInt(req.params.index);
    res.send(products[productIndex]);
});

app.patch('/products/:index', (req,res) => {
    console.log(req.params);
    console.log(req.params.index);
    let productIndex = parseInt(req.params.index);
    if (loggedUser.isAdmin === true) {
        Object.assign(products[productIndex], req.body); 
        console.log(products[productIndex]);
        res.send('Product Modified.');
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

app.get('/users/orders/user', (req,res) => {
    console.log(loggedUser);
    let userOrders = orders.filter( (item) => item.userId === loggedUser.email); 
    res.send(userOrders);
});

app.get('/users/orders', (req,res) => {
    console.log(loggedUser);
    if (loggedUser.isAdmin === true) {
        res.send(orders);
    } else {
        res.send('Unauthorized user, access denied.');
    }
});

/*

app.put('/users/orders/newOrder', (req,res) => {
    console.log(loggedUser);
    let toOrder = req.body.name;
    console.log(toOrder);
    let amount = req.body.amount;
    let toBuy = products.find((item) => item.name == toOrder);
    console.log(toBuy);
    let price = toBuy.amount;
    let total = price*amount;
    let newOrder= {
        userId: loggedUser.email, 
        products: [{
            name: toOrder,
            price: price,
            amount: amount
        }],
        totalAmount: total,
        createdOn: Date.now()
    };
    products.push(newOrder);
    console.log(orders);
    res.send('You have added a new order');
});

*/