const axios = require('axios')

const fetchNewsFromGuardian = async () => {
 const response = await axios.get('https://jsonplaceholder.typicode.com/photos?_start=10&_limit=10')
 console.log(response)
}
module.export = { fetchNewsFromGuardian }