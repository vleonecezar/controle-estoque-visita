const registerButton = document.querySelector('#register-button')
const cancelRegisterButton = document.querySelector('#cancel-register-button')
const operationButton = document.querySelector('#operation-button')
const cancelOperationButton = document.querySelector('#cancel-operation-button')

const registerForm = document.querySelector('#register-form')
const operationForm = document.querySelector('#operation-form')
const itensList = document.querySelector('#itens-list')
const operations = document.querySelector('#operations')
const removeButton = document.querySelector('#trash')

let inventory = []

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

const addInventoryIntoDOM = () => {
  itensList.innerHTML = ''

  inventory.forEach(item => {
    itensList.innerHTML += `
      <tr id='${item.id}'>
        <td>${item.date}</td>
        <td>${item.modDate}</td>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.inventoryValue}</td>
        <td>
          <button id="trash" type="button" onClick="removeItemIntoDOM(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
    console.log(item.inventoryValue)
  })
}

const addItem = () => {
  const id = isUniqueID()
  const date = '05/05/05'
  const name = document.querySelector('#name').value
  const quantity = Number(document.querySelector('#quantity').value)
  const price = document.querySelector('#price').value
  const inventoryValue = quantity * price
  console.log(quantity, inventoryValue)

  inventory.push({
    id: id,
    date: date,
    modDate: date,
    name: name,
    quantity: 0,
    inventoryValue: 0
  })

  addInventoryIntoDOM()
  closeRegisterForm()
}

const fillNamesOptions = () => {
  const itensNames = document.querySelector('#operation-item-name')
  itensNames.innerHTML = ''

  inventory.forEach(item => {
    itensNames.innerHTML += `
      <option value="${item.name}">${item.name}</option>
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
        Number(item.price += price)
        item.inventoryValue += price * quantity
        console.log(item.price, price)
      } else {
        alert('erro')
      }
    })
  } else {
    inventory.forEach(item => {
      if (item.name === name) {
        item.modDate = date
        item.quantity -= quantity
        Number(item.price -= price)
        item.inventoryValue -= price * quantity
        console.log(item.price, price)
      } else {
        alert('erro')
      }
    })
  }
  addInventoryIntoDOM()
  closeOperationForm()
}

const removeItemIntoDOM = id => {
  inventory = inventory.filter(item => item.id != id)

  addInventoryIntoDOM()
}


addInventoryIntoDOM()

registerButton.addEventListener('click', openRegisterForm)
cancelRegisterButton.addEventListener('click', closeRegisterForm)
operationButton.addEventListener('click', openOperationForm)
cancelOperationButton.addEventListener('click', closeOperationForm)
registerForm.addEventListener('submit', handleRegisterFormSubmit)
operationForm.addEventListener('submit', handleOperationFormSubmit)
operations.addEventListener('change', isPriceHidden)