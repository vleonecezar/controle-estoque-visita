const addItemButton = document.querySelector('#add-button')
const form = document.querySelector('#form')
const cancelButtonForm = document.querySelector('#cancel-button-form')
const inventoryOptions = document.querySelector('#inventory-options')
const itensList = document.querySelector('#itens-list')
const actionsTh = document.querySelector('#actions')

const fillCurrentInventory = () => {
  const names = outputInventory.map(item => item.name)

  let setCurrentArray = inputInventory.filter(item => !names.includes(item.name))
  return setCurrentArray
}

let inputInventory = []
let outputInventory = []


const openForm = () => form.style.display = 'inherit'
const closeForm = () => form.style.display = 'none'

const addItensIntoArray = inventory => {
  const date = document.querySelector('#date').value
  const name = document.querySelector('#name').value
  const quantity = document.querySelector('#quantity').value
  const price = document.querySelector('#price').value
  
  const id = isUniqueID()
  const totalPrice = quantity * price
  
  inventory.push(
    {
      id: id,
      date: date,
      name: name,
      quantity: quantity,
      price: price,
      totalprice: totalPrice
    }
  )
}

const generetedID = () => Math.round(Math.random() * inputInventory.length)

const isUniqueID = () => {
  const inventoryIds = inputInventory.map(item => item.id)
  let uniqueId = generetedID()
  while (inventoryIds.includes(uniqueId))
    uniqueId = generetedID()
  return uniqueId
}

const addItemIntoDOM = inventory => {
  itensList.innerHTML = ''

  inventory.forEach(item => {
    itensList.innerHTML += `
    <tr>
      <td>${item.date}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>R$ ${item.price}</td>
      <td>R$ ${item.totalprice}</td>
      ${isHiddenButtons()}
    </tr>
  `
  })
}

const isHiddenButtons = () => {
  const choosenOption = inventoryOptions.options[inventoryOptions.selectedIndex].value
  let content

  if (choosenOption === 'current')
    content = ''
  else
    content = `
      <td>
        <button id="edit">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button id="trash">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `
  return content
}

const mainOperations = operation => {
  const choosenOption = inventoryOptions.options[inventoryOptions.selectedIndex].value
  
  switch (choosenOption) {
    case 'current':
      addItemIntoDOM(fillCurrentInventory())
      break;

    case 'input':
      operation(inputInventory)
      break;

    case 'output':
      operation(outputInventory)
      break;
  
    default:
      break;
  }
}

const handleFormSubmit = () => {
  event.preventDefault()

  mainOperations(addItensIntoArray)
  mainOperations(addItemIntoDOM)

  closeForm()
}

const handleDOMInformation = () => {
  mainOperations(addItemIntoDOM)
}

mainOperations(addItemIntoDOM)

addItemButton.addEventListener('click', openForm)
form.addEventListener('submit', handleFormSubmit)
inventoryOptions.addEventListener('change', handleDOMInformation)
cancelButtonForm.addEventListener('click', closeForm)