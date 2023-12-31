require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Middleware = require('./middleware/index.js');
const { compress, decompress,encodeRLE,decodeRLE,huffmanCompress,huffmanDecompress,convertHuffmanTreeToJSON,convertJSONToHuffmanTree,buildFrequencyTable,buildHuffmanTree } = require('./algorithm.js');
const mongoose = require('mongoose');

const database = module.exports = () =>{
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  try{
    mongoose.connect(`${process.env.DB_URI}`,connectionParams);
    console.log('Connected to database');
  }catch(err){
    console.log('Could not connect to database');
  }

};

database();


// create table 
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  email: String,
  input: String,
  output: String,
  type: String,
  date: Date,
  time: String
});

const treeSchema = new Schema({
  email: String,
  tree: Object,
  input: String,
  output: String,
})

// create model
const Tree = mongoose.model('Tree', treeSchema);

// insert data
const insertTree = async (email, tree, input, output) => {
  const tre = new Tree({
    email: email,
    tree: tree,
    input: input,
    output: output
  });

  await tre.save();
};

// get data
const getTree = async (email,output) => {
  try {
    const result = await Tree.find({ email: email, output: output });
    console.log(result);
    const data = result.map((item) => item.toObject());
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


const Data = mongoose.model('Data', dataSchema);

// insert data
const insertData = async (email, input, output, type, date, time) => {
  const data = new Data({
    email: email,
    input: input,
    output: output,
    type: type,
    date: date,
    time: time
  });
  await data.save();
};

// get data
const getData = async (email) => {
  try {
    const result = await Data.find({ email: email });
    console.log(result);
    const data = result.map((item) => item.toObject());
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.use(cors());
app.use(Middleware.decodeToken);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/encoder', (req, res) => {
    const data = req.body.data;
    insertData(req.body.email, data, compress(data), 'encode', new Date(), new Date().toLocaleTimeString()).then((result) => {
      console.log(result);
      res.send(compress(data));
    }).catch((err) => {
      console.log(err);
    });
});

app.post('/decoder', (req, res) => {
  const data = req.body.data;
  insertData(req.body.email, data, decompress(data), 'decode', new Date(), new Date().toLocaleTimeString()).then((result) => {
    console.log(result);
    res.send(decompress(data));
  }).catch((err) => {
    console.log(err);
  }
  );
});

app.post('/encoder-extension', (req, res) => {
    const data = req.body.data;
    insertData(req.body.email, data, compress(huffmanCompress(data)), 'encode-extension', new Date(), new Date().toLocaleTimeString()).then(
      (result) => {
        res.send(compress(huffmanCompress(data)));
      }
    ).catch((err) => {
      console.log(err);
    });
    const frequencyTable = buildFrequencyTable(data);
    const huffmanTree = buildHuffmanTree(frequencyTable);
    const huffmanJson = convertHuffmanTreeToJSON(huffmanTree);
    insertTree(req.body.email, huffmanJson, data, huffmanCompress(data)).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    }
    );
});

app.post('/decoder-extension', (req, res) => {
    const data = req.body.data;
    console.log(decompress(data));

    getTree(req.body.email, decompress(data)).then((result) => {
      const huffmanTree = convertJSONToHuffmanTree(result[0].tree);
      insertData(req.body.email, data, huffmanDecompress(decompress(data),huffmanTree), 'decode-extension', new Date(), new Date().toLocaleTimeString()).then((result) => {
        res.send(huffmanDecompress(decompress(data),huffmanTree));
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });

      
});


app.post('/history', (req, res) => {
  console.log(req.headers)
  const email = req.body.email;
  getData(email).then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!');
}
  )

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
