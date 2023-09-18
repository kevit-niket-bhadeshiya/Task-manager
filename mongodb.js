// CRUD

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'task-manager' 

// const id = new ObjectId();
// console.log(id.id.length);
// console.log(id.getTimestamp());
// console.log(id.toHexString().length);

async function MongoConnect(){
    try {

        const client = await MongoClient.connect(connectionURL);
        console.log('connection successfull');
        const db = client.db(databaseName);

        // const result = await db.collection('users').insertOne({
        //     name : 'Vikram',
        //     age : 25
        // })

        // console.log(result);

        // const result = await db.collection('users').insertMany([
        //     {
        //         name : 'jen',
        //         age: 28
        //     },
        //     {
        //         name: 'gunther',
        //         age: 27
        //     }
        // ])
        // console.log(result);

        // const result = await db.collection('tasks').insertMany([
        //     {
        //         description : 'this is first task description.',
        //         completed: true
        //     },
        //     {
        //         description : 'this is second task description.',
        //         completed: false
        //     }
        // ])
        // console.log(result);

        // const result = await db.collection('users').findOne({ _id: new ObjectId("64feab88ed5f25152fa927f9")});
        // if(!result){
        //     return console.log('Unable to fetch');
        // }
        // console.log(result);

        // const users = await db.collection('users').find({ age: 20 }).toArray()
        
        // const tasksPending = await db.collection('tasks').find({ completed: 'f' }).toArray()
        // if(!tasksPending.length){
        //     return console.log('can not find data');
        // }
        // console.log(tasksPending);



        // const result = await db.collection('users').updateOne({
        //     _id : new ObjectId('64fea4977341bf52c9947169') 
        // }, 
        // {
        //     $inc: {
        //         age: 1
        //     }
        // })
        // if(!result.matchedCount){
        //     return console.log('no match found');
        // }
        // console.log(result);

        // const result = await db.collection('tasks').updateMany({
        //     completed: false
        // },
        // {
        //     $set : {
        //         completed : true
        //     }
        // })
        // console.log(result);



        // const result = await db.collection('users').deleteMany({ age : 20 });
        // if(!result.deletedCount){
        //     return console.log('No data to delete.');
        // }
        // console.log(result);
        const result = await db.collection('tasks').deleteOne({ description : "this is first task description." })
        console.log(result);

    } catch (error) {
        console.log(error.message);
    }

}

MongoConnect();