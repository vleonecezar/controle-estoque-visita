const inventaryIcon = document.querySelector('#inventory')
const visitIcon = document.querySelector('#visit')
const search = document.querySelector('#search')
const addButton = document.querySelector('#add-button')
const form = document.querySelector('#form')
const addButtonForm = document.querySelector('#add-button-form')



const cancelButtonForm = document.querySelector('#cancel-button-form')
const itensList = document.querySelector('.itens-list')
const editButton = document.querySelector('#edit')
const trashButton = document.querySelector('#trash')
const previousButton = document.querySelector('#previous')
const nextButton = document.querySelector('#next')

let inventoryItens = []


const showFormOnClick = () => form.style.display = 'inherit'
const closeFormOnClick = () => form.style.display = 'none'

const generateId = () => Math.round(Math.random() * inventoryItens.length)
const isUniqueID = () => {
  const inventoryIds = inventoryItens.map(item => item.id)
  let id = generateId()
  while ( inventoryIds.includes(id) ) {
    id = generateId()
  }
  return id
}

const getFormInfo = () => {
  const date = document.querySelector('#date').value
  const id =  isUniqueID()
  const name = document.querySelector('#name').value
  const quantity = document.querySelector('#quantity').value
  const price = document.querySelector('#price').value
  const totalPrice = quantity * price

  addItemIntoArray(date, id, name, quantity, price, totalPrice)
}

const addItemIntoArray = (date, id, name, quantity, price, totalPrice) => {
  event.preventDefault()

  inventoryItens.push({
    date: date, 
    id: id,
    name: name, 
    quantity: quantity, 
    price: price, 
    totalprice: totalPrice
  })

  addItemIntoDOM()
}

const removeItemIntoArray = id => {
  inventoryItens = inventoryItens.filter(item => item.id != id)

  addItemIntoDOM()
}

const addItemIntoDOM = () => {
  itensList.innerHTML = ''

  inventoryItens.forEach(item => {
    itensList.innerHTML += `
    <tr>
      <td>${item.date}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>R$ ${item.price}</td>
      <td>R$ ${item.totalprice}</td>
      <td>
        <button id="edit" onClick="edit(${item.id})">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button id="trash" onClick="removeItemIntoArray(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
    `
  })

  form.style.display = 'none'
}


addButton.addEventListener('click', showFormOnClick)
cancelButtonForm.addEventListener('click', closeFormOnClick)
form.addEventListener('submit', getFormInfo)