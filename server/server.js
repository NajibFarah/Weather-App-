require('dotenv/config');
const mongoose = require('mongoose');

const app = require('./app');
const apolloServer = require('./apollo');

async function startServer () {
    await apolloServer.start();
    apolloServer.applyMiddleware({app});
    app.use('/', (req, res) => {
        res.send("Welcome to weather platform");
    })
}
startServer();
mongoose.connect(process.env.MONGODB_LOCAL_URL)
    .then(() => console.log("MongoDB is running successfully!"))
    .catch((err) => console.log("MongoDB connection failed"));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
    console.log(`Graphql Endpoint is : ${apolloServer.graphqlPath}`);
})