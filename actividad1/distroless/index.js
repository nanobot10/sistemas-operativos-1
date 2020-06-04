const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Dennis Castro - 201213146'))

app.listen(3000, () => {
  console.log(`Example app listening on port 3000!`)
})