const MongoClient = require('mongodb').MongoClient;
const faker = require('faker');

jest.setTimeout(30000);

const uri = "mongodb+srv://testuser:jMhvwkryEXpkkj0X@cluster0.g6fmf.mongodb.net/mytestdb?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

describe('Database Tests', () => {

    let usersCollection;

    beforeAll(async () => {

        usersCollection = await new Promise((resolve, reject) => {

            client.connect(err => {
                if(err) reject(err);

                const collection = client.db("mytestdb").collection("users");
                //console.log(collection)
                resolve(collection);
              });

        })
    })

    test("Test CREATE", (done) => {

        //console.log(usersCollection);

        let newUsers = [];
        let total_users_to_add = 3;

        for (let i = 0; i < total_users_to_add; i++) {
            
            newUsers.push({
                name: faker.name.findName(),
                email: faker.internet.email()
            });
        }

        usersCollection.insertMany(newUsers, (err, results) => {

            expect(results.result.n).toBe(total_users_to_add);

            done();
        })

    }, 30000)

    test("Test READ", async () => {

        let sampleUser = {name: 'Test User', email : "test@user.com"};

        await usersCollection.insertOne(sampleUser);

        const findUser = await usersCollection.findOne({email: sampleUser.email});

        console.log(findUser);

        expect(findUser.name).toBe(sampleUser.name);

    }, 30000)

    afterEach(async () => {
        await usersCollection.deleteMany({}); 
    })

    afterAll(() => {
        client.close();
    })
})
