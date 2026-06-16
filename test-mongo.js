import mongoose from 'mongoose';

const uri = "mongodb://istiakahmmedbishal_db_user:SgTQOayX9B7voRvM@ac-wgu9cpy-shard-00-00.os8apyt.mongodb.net:27017,ac-wgu9cpy-shard-00-01.os8apyt.mongodb.net:27017,ac-wgu9cpy-shard-00-02.os8apyt.mongodb.net:27017/BracuDiganta?ssl=true&replicaSet=atlas-jbca0d-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
