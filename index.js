const fs = require('fs').promises
const categoriesJson = require('./data/armor_category_mapping.json')
const durability = require('./data/max_item_durability.json')
const repairData = require('./data/repairable_items.json')

function makeCategoriesMap () {
  const newObj = {}
  Object.entries(categoriesJson).forEach((elem) => {
    elem[1].forEach((item) => {
      if (!newObj[item]) newObj[item] = [elem[0]]
      else newObj[item].push(elem[0])
    })
  })
  return newObj
}

function makeReapirableItemsMap () {
  const newObj = {}
  for (const [items, fixMats] of repairData) {
    items.forEach((elem) => { newObj[elem] = fixMats })
  }
  return newObj
}

async function main () {
  const data = require('./items.json')
  const newData = data
  // categories
  const categoryMap = makeCategoriesMap()
  const categoryKeys = Object.keys(categoryMap)
  // repairItems
  const repairMap = makeReapirableItemsMap()
  const repairKeys = Object.keys(repairMap)
  for (let i = 0; i < data.length; i++) {
    if (durability[data[i].name]) {
      newData[i].maxDurability = durability[data[i].name]
    }
    if (categoryKeys.includes(data[i].name)) {
      newData[i].enchantCategories = categoryMap[data[i].name]
    }
    if (repairKeys.includes(data[i].name)) {
      newData[i].repairWith = repairMap[data[i].name]
    }
  }
  fs.writeFile('items.json', JSON.stringify(newData, null, 2))
  console.log('Done!')
}

main()
