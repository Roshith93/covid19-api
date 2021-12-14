const PORT = process.env.PORT || 9000;
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')



const app = express()
const coronaUpdates = [];
const individualNews = []

const newsPapers = [{
  name: 'The Guardian',
  baseName: 'theguardian',
  url: 'https://www.theguardian.com/world/coronavirus-outbreak',
  baseURL: ''
 },
 {
  name: 'Telegraph',
  baseName: 'telegraph',
  url: 'https://www.telegraphindia.com/topic/coronavirus',
  baseURL: 'https://www.telegraphindia.com'
 }
]




newsPapers.forEach(newsPaper => {
 axios.get(newsPaper.url).then(res => {
  const html = res.data
  const $ = cheerio.load(html)
  $('a:contains("Covid")', html).each(function () {
   const title = $(this).text()
   const url = $(this).attr('href')
   coronaUpdates.push({
    title,
    url: newsPaper.baseURL + url,
    source: newsPaper.name
   })
  })
 })
})


app.get('/news', (req, res) => {
 res.json(coronaUpdates)
})

app.get('/news/:newspaperId', async (req, res) => {
 const newspaperId = req.params.newspaperId
 const newspaperURL = newsPapers.filter(newspaper => newspaper.baseName == newspaperId)

 axios.get(newspaperURL[0].url).then(response => {
  const html = response.data
  const $ = cheerio.load(html)

  $('a:contains("Covid")', html).each(function () {
   const title = $(this).text()
   const url = $(this).attr('href')
   individualNews.push({
    title,
    url: newspaperURL[0].baseURL + url,
    source: newspaperURL[0].name
   })
  })
  res.json(individualNews)
 }).catch(err => console.log(err))
})



app.listen(PORT, () => console.log(`Running don ${PORT}`))