
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const headers = {
    'Content-Type' : 'application/json',
    'Ocp-Apim-Subscription-Key' : process.env.KEY,
    'Access-Control-Allow-Origin':'*'
}

app.post('/entitylinking',async (req, res) => {
    const output = [];
    let body = req.body

    const output_dict1 = Object.create(null)

    const response = await axios.post(process.env.ENDPOINT ,body, {
        headers: headers
    })

    entities = response['data']['results']['documents'][0]['entities']
    entities.forEach(element => {
        output_dict1[element['name']] = element['url'];
    })
    res.send(output_dict1)

});

app.post('/phraseextraction',async (req, res) => {
    let body = req.body

    const response = await axios.post(process.env.ENDPOINT ,body, {
        headers: headers
    })

    keyPhrases = response['data']['results']['documents'][0]['keyPhrases']
    res.send(keyPhrases)
});

app.post('/entityrecognition',async (req, res) => {
    let body = req.body

    const output_dict = Object.create(null)

    const response = await axios.post(process.env.ENDPOINT ,body, {
        headers: headers
    })

    out = response['data']['results']['documents'][0]['entities']

    out.forEach(element => {
        output_dict[element['text']] = element['category']
    })

    res.send(output_dict)
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))


