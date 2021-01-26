const registerButton = document.querySelector('#register-button')
const cancelRegisterButton = document.querySelector('#cancel-register-button')
const operationButton = document.querySelector('#operation-button')
const cancelOperationButton = document.querySelector('#cancel-operation-button')
const previousButton = document.querySelector('#previous')
const nextButton = document.querySelector('#next')


const registerForm = document.querySelector('#register-form')
const operationForm = document.querySelector('#operation-form')
const itensList = document.querySelector('#itens-list')
const operations = document.querySelector('#operations')
const removeButton = document.querySelector('#trash')
const searchInput = document.querySelector('#search')
const pageNumber = document.querySelector('#page-number')

let inventory = []

let a = 0
let b = 3

const handlePage = e => {
  
  
  if (e.target.id === 'previous' && b > 3) {
    a -= 3
    b -= 3
  } else if (e.target.id === 'next' && b < inventory.length) {
    a += 3
    b += 3
  }
  console.log(a, b)

  verifySearchFieldAndAddItensIntoDOM()
}

const getDate = () => {
  const date = new Date()
  return `
    ${date.getDate()} / 
    ${date.getUTCMonth() + 1} / 
    ${date.getFullYear()}
  `
}


const openRegisterForm = () => registerForm.style.display = 'inherit'
const closeRegisterForm = () => registerForm.style.display = 'none'
const openOperationForm = () => {
  fillNamesOptions()
  operationForm.style.display = 'inherit'
}
const closeOperationForm = () => operationForm.style.display = 'none'

const generetedID = () => Math.round(Math.random() * inventory.length)

const isUniqueID = () => {
  const inventoryIDs = inventory.map(item => item.id)
  
  let id = generetedID() + 1
  while (inventoryIDs.includes(id)) {
    id = generetedID() + 1
  }

  return id
}

const handleRegisterFormSubmit = () => {
  event.preventDefault()

  addItem()
}

const FormatCurrency = price => {
  return Number(price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}

const addInventoryIntoDOM = inventory => {
  itensList.innerHTML = ''
  
  inventory.slice(a, b).forEach(item => {
    itensList.innerHTML += `
      <tr id='${item.id}'>
        <td>${item.date}</td>
        <td>${item.modDate}</td>
        <td id="item-name">${item.name}</td>
        <td>${item.quantity}</td>
        <td>${FormatCurrency(item.price)}</td>
        <td>${FormatCurrency(item.totalPrice)}</td>
        <td>
          <button id="trash" type="button" onClick="removeItemIntoDOM(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
  })

}

const addItem = () => {
  const id = isUniqueID()
  const date = getDate()
  const name = document.querySelector('#name').value.toLowerCase()
  const quantity = Number(document.querySelector('#quantity').value)
  const price = document.querySelector('#price').value
  const totalPrice = quantity * price

  inventory.push({
    id: id,
    date: date,
    modDate: date,
    name: name,
    quantity: 0,
    price: price,
    totalPrice: 0
  })
  
  verifySearchFieldAndAddItensIntoDOM()
  closeRegisterForm()
}

const fillNamesOptions = () => {
  const itensNames = document.querySelector('#operation-item-name')
  itensNames.innerHTML = ''

  inventory.forEach(item => {
    itensNames.innerHTML += `
      <option id="option-name" value="${item.name}">${item.name}</option>
    `
  })
}

const isPriceHidden = () => {
  const priceField = document.querySelector('#price-field')

  if (operations.value === 'add') {
    priceField.style.display = 'inherit'
  } else {
    priceField.style.display = 'none'
  }
}

const handleOperationFormSubmit = () => {
  event.preventDefault()
  
  const operation = document.querySelector('#operations').value
  const name = document.querySelector('#operation-item-name').value
  console.log(operation, name)

  const quantity = Number(document.querySelector('#quantity').value)
  const price = Number(document.querySelector('#price').value)
  const date = getDate()

  if (operation === 'add') {
    inventory.forEach(item => {
      if (item.name === name) {
        item.modDate = date
        item.quantity += quantity
        item.totalPrice += item.price * quantity
      }
    })
  } else {
    inventory.forEach(item => {
      if (item.name === name) {
        item.modDate = date
        item.quantity -= quantity
        item.totalPrice -= item.price * quantity
      }
    })
  }
  verifySearchFieldAndAddItensIntoDOM()
  closeOperationForm()
}

const removeItemIntoDOM = id => {
  inventory = inventory.filter(item => item.id != id)
  verifySearchFieldAndAddItensIntoDOM()
}

const verifySearchFieldAndAddItensIntoDOM = () => {
  const wantedItem = searchInput.value.toLowerCase()
  const filteredItens = inventory.filter(item => item.name.includes(wantedItem))

  if (wantedItem === '') {
    addInventoryIntoDOM(inventory)
  } else {
    addInventoryIntoDOM(filteredItens)
  }
}

verifySearchFieldAndAddItensIntoDOM()

registerButton.addEventListener('click', openRegisterForm)
cancelRegisterButton.addEventListener('click', closeRegisterForm)
operationButton.addEventListener('click', openOperationForm)
cancelOperationButton.addEventListener('click', closeOperationForm)
registerForm.addEventListener('submit', handleRegisterFormSubmit)
operationForm.addEventListener('submit', handleOperationFormSubmit)
operations.addEventListener('change', isPriceHidden)
searchInput.addEventListener('keyup', verifySearchFieldAndAddItensIntoDOM)
previousButton.addEventListener('click', handlePage)
nextButton.addEventListener('click', handlePage)