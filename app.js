
////// GLOBAL VARIABLES //////

let menuInventory = document.querySelector('#menu-inventory')
let menuVisit = document.querySelector('#menu-visit')

let firstInventoryArrayItem = 0  // FIRST PARAMETER FROM SLICE 
let inventoryArrayLimiter = 10  // SECOND PARAMETER FROM SLICE
let firstVisitArrayItem = 0  // FIRST PARAMETER FROM SLICE 
let visitArrayLimiter = 10  // SECOND PARAMETER FROM SLICE
let currentInventoryPage = 1
let inventoryPageQuantity = 1
let currentVisitPage = 1
let visitPageQuantity = 1

////// LOCAL STORAGE //////

// INVENTORY
const localStorageInventory = JSON.parse(localStorage.getItem('inventory'))
let inventory = localStorage
  .getItem('inventory') != null ? localStorageInventory : []

const inventoryItemPerPage = () => (
  inventory.slice(firstInventoryArrayItem, inventoryArrayLimiter)
)

const updateInventoryLocalStorege = () => {
  localStorage.setItem('inventory', JSON.stringify(inventory))
}

// VISIT
const localStorageVisit = JSON.parse(localStorage.getItem('visit'))
let visit = localStorage
  .getItem('visit') != null ? localStorageVisit : []

const visitItemPerPage = () => (
  visit.slice(firstVisitArrayItem, visitArrayLimiter)
)

const updateVisitLocalStorege = () => {
  localStorage.setItem('visit', JSON.stringify(visit))
}

////// MENU SETTINGS //////

const chosenOptionStyle = option => {
  option.style.backgroundColor = 'rgb(231, 231, 231)'
  option.style.marginRight = '-0.5px'
  option.style.borderTop = '1px solid rgba(0, 0, 0, 0.199)'
  option.style.borderBottom = '1px solid rgba(0, 0, 0, 0.199)'
}

const notChosenOptionStyle = option => {
  option.style.backgroundColor = 'transparent'
  option.style.marginRight = '0'
  option.style.borderTop = '1px solid transparent'
  option.style.borderBottom = '1px solid transparent'
}

const handleMenuOptions = (chosen, notChosen) => {
  chosenOptionStyle(chosen)
  notChosenOptionStyle(notChosen)
}

const displayChosenOptionOnScreen = event => {
  const chosenOption = event.target.id

  if (chosenOption === 'menu-inventory') {
    handleMenuOptions(menuInventory, menuVisit)
    inventoryTitle()
    displayInventoryTHead()
    displayInventoryOnScreen(inventoryItemPerPage())
    setInitialCurrentPage(inventory)
    setInventoryPageQuantity()
    displayInventoryPageNumbers()
  } else {
    handleMenuOptions(menuVisit, menuInventory)
    visitTitle()
    displayVisitTHead()
    displayVisitOnScreen(visitItemPerPage())
    setInitialCurrentPage(inventory)
    setVisitPageQuantity()
    displayVisitPageNumbers()
  }

  handleOperationButtonAndInput(chosenOption)
}

const tableHead = document.querySelector('#table-head')

const displayInventoryTHead = () => {
  tableHead.innerHTML = `
    <th>Entrada</th>
    <th>Ultima Alteração</th>
    <th>Nome</th>
    <th>Quantidade</th>
    <th>Preço Unitário</th>
    <th>Preço Total</th>
    <th id="actions">Ações</th>
  `
}

const displayVisitTHead = () => {
  tableHead.innerHTML = `
    <th>Data da Visita</th>
    <th>Nome</th>
    <th>Endereço</th>
    <th>Responsável</th>
    <th>Telefone</th>
    <th id="actions">Ações</th>
  `
}

const title = document.querySelector('#header-title')
const inventoryTitle = () => title.innerText = 'Páginas do Estoque'
const visitTitle = () => title.innerText = 'Páginas de Visitas'

menuInventory.addEventListener('click', displayChosenOptionOnScreen)
menuVisit.addEventListener('click', displayChosenOptionOnScreen)

////// PAGINATION SETTINGS //////

const setInitialCurrentPage = () => {
  firstInventoryArrayItem = 0
  inventoryArrayLimiter = 10
  firstVisitArrayItem = 0
  visitArrayLimiter = 10
  currentInventoryPage = 1
  currentVisitPage = 1
}

const setInventoryPageQuantity = () => {
  if (inventory.length === 0) {
    inventoryPageQuantity = 1
  } else {
    inventoryPageQuantity = Math.round((inventory.length + 4) / 10)
  }
}

const setVisitPageQuantity = () => {
  if (visit.length === 0) {
    visitPageQuantity = 1
  } else {
    visitPageQuantity = Math.round((visit.length + 4) / 10)
  }
}

const displayInventoryPageNumbers = () => {
  const pageNumber = document.querySelector('#page-number')
  pageNumber.innerHTML = `
    ${currentInventoryPage} de ${inventoryPageQuantity}
  `
}

const displayVisitPageNumbers = () => {
  const pageNumber = document.querySelector('#page-number')
  pageNumber.innerHTML = `
    ${currentVisitPage} de ${visitPageQuantity}
  `
}

const handleInventoryPageNumberWhenRemovingItem = () => {
  if (currentInventoryPage > inventoryPageQuantity) {
    currentInventoryPage -= 1
    firstInventoryArrayItem -= 10
    inventoryArrayLimiter -= 10

    if (currentInventoryPage === 0) {
      currentInventoryPage = 1
      inventoryPageQuantity = 1
      firstInventoryArrayItem = 0
      inventoryArrayLimiter = 10
    }
  }
  displayInventoryPageNumbers()
}

const handleVisitPageNumberWhenRemovingItem = () => {
  if (currentVisitPage > visitPageQuantity) {
    currentVisitPage -= 1
    firstVisitArrayItem -= 10
    visitArrayLimiter -= 10

    if (currentVisitPage === 0) {
      currentVisitPage = 1
      visitPageQuantity = 1
      firstVisitArrayItem = 0
      visitArrayLimiter = 10
    }
  }
  displayVisitPageNumbers()
}

const handleInventoryPageNumberWhenClicking = event => {
  const eventID = event.target.id
  const previous = eventID === 'previous' && inventoryArrayLimiter > 10
  const next = eventID === 'next' && inventoryArrayLimiter < inventory.length

  if (previous) {
    firstInventoryArrayItem -= 10
    inventoryArrayLimiter -= 10
    currentInventoryPage -= 1
  } else if (next) {
    firstInventoryArrayItem += 10
    inventoryArrayLimiter += 10
    currentInventoryPage += 1
  }

  displayInventoryOnScreen(inventoryItemPerPage())
  displayInventoryPageNumbers()
}

const handleVisitPageNumberWhenClicking = event => {
  const eventID = event.target.id
  const previous = eventID === 'previous' && visitArrayLimiter > 10
  const next = eventID === 'next' && visitArrayLimiter < visit.length

  if (previous) {
    firstVisitArrayItem -= 10
    visitArrayLimiter -= 10
    currentVisitPage -= 1
  } else if (next) {
    firstVisitArrayItem += 10
    visitArrayLimiter += 10
    currentVisitPage += 1
  }

  displayVisitOnScreen(visitItemPerPage())
  displayVisitPageNumbers()
}

const handlePageNumberWhenClicking = event => {
  const isInventory = menuInventory.style.backgroundColor != 'transparent'

  if (isInventory) {
    handleInventoryPageNumberWhenClicking(event)
  } else {
    handleVisitPageNumberWhenClicking(event)
  }
}

const previousButton = document.querySelector('#previous')
const nextButton = document.querySelector('#next')

previousButton.addEventListener('click', handlePageNumberWhenClicking)
nextButton.addEventListener('click', handlePageNumberWhenClicking)

////// SEARCH //////

const searchInput = document.querySelector('#search')

const getSearchedItem = name => {
  const filteredItens = inventory.filter(item => item.name.includes(name))
  return filteredItens
}

const verifySearchFieldAndDisplayOnScreen = () => {
  const searchedItem = searchInput.value.toLowerCase()
  const searching = getSearchedItem(searchedItem)

  if (searchedItem === '') {
    displayInventoryOnScreen(inventoryItemPerPage())
  } else {
    displayInventoryOnScreen(searching)
  }
}

searchInput.addEventListener('keyup', verifySearchFieldAndDisplayOnScreen)

const cleanSearchInput = () => {
  searchInput.value = ''
  displayInventoryOnScreen(inventoryItemPerPage())
}

searchInput.addEventListener('blur', cleanSearchInput)

////// VISIT FORM //////

const closeVisitForm = () => visitForm.style.display = 'none'

document.querySelector('#cancel-visit-button')
  .addEventListener('click', closeVisitForm)

const addVisitIntoArray = () => {
  const id = isUniqueID(visit)
  const date = document.querySelector('#date').value
  const name = document.querySelector('#visit-name').value.toLowerCase()
  const adress = document.querySelector('#adress').value
  const responsible = document.querySelector('#responsible').value
  const phone = document.querySelector('#phone').value
  const isNameUsed = visit.find(item => item.name === name)

  if (phone.length > 11) {
    alert('TELEFONE INVÁLIDO. ULTRAPASSOU O LIMITE DE CARACTERES')
  } else if (phone.length < 10) {
    alert('TELEFONE INVÁLIDO. DEVE TER O MÍNIMO DE 10 CARACTERES.')
  } else if (isNameUsed) {
    alert(`JÁ EXISTE ${name.toUpperCase()} NAS VISITAS`)
  } else {
    visit.push({
      id: id,
      date: date,
      name: name,
      adress: adress,
      responsible: responsible,
      phone: phone,
    })
    
    updateVisitLocalStorege()
    closeVisitForm()
  }
}

const removeVisitItem = id => {
  const response = confirm('TEM CERTEZA QUE DESEJA DELETAR?')

  if (response === true) {
    visit = visit.filter(item => item.id != id)
    setVisitPageQuantity()
    handleVisitPageNumberWhenRemovingItem()
    updateVisitLocalStorege()
    displayVisitOnScreen(visitItemPerPage())
  }
}

const formatingPhoneNumber = (phoneNumber) => {
  let ddd = phoneNumber.slice(0,2)
  let partA = 0
  let partB = 0
  let isCellPhone = phoneNumber.length === 11
  let notCellPhone = phoneNumber.length === 10

  if(isCellPhone) {
    partA = phoneNumber.slice(2, 7)
    partB = phoneNumber.slice(7)
  } else if (notCellPhone) {
    partA = phoneNumber.slice(2, 6)
    partB = phoneNumber.slice(6)
  }
  
  return `(${ddd}) ${partA}-${partB}`
}

const displayVisitOnScreen = visit => {
  const itemsList = document.querySelector('#itens-list')
  itemsList.innerHTML = ''

  visit.forEach(item => {
    itemsList.innerHTML += `
      <tr id='${item.id}'>
        <td>${item.date}</td>
        <td id="item-name">${item.name}</td>
        <td>${item.adress}</td>
        <td>${item.responsible}</td>
        <td>${formatingPhoneNumber(item.phone)}</td>
        <td>
          <button id="trash" type="button" onClick="removeVisitItem( ${item.id} )">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
  })
}

const visitForm = document.querySelector('#visit-form')

const handleVisitFormSubmit = event => {
  event.preventDefault()
  addVisitIntoArray()
  setVisitPageQuantity()
  displayVisitOnScreen(visitItemPerPage())
  displayVisitPageNumbers()
}

visitForm.addEventListener('submit', handleVisitFormSubmit)

////// INVENTORY FORM //////

const registerForm = document.querySelector('#register-form')

const openInventoryOrVisitForm = () => {
  const inputName = document.querySelector('#name')
  const isInventory = menuInventory.style.backgroundColor != 'transparent'

  if (isInventory) {
    //cleanInventoryForm()
    registerForm.style.display = 'inherit'
  } else {
    //cleanVisitForm()
    visitForm.style.display = 'inherit'
  }

  inputName.focus()
}

document.querySelector('#register-button')
  .addEventListener('click', openInventoryOrVisitForm)

const closeInventoryForm = () => registerForm.style.display = 'none'

document.querySelector('#cancel-register-button')
  .addEventListener('click', closeInventoryForm)

const addItemIntoArray = () => {
  const id = isUniqueID(inventory)
  const date = getDate()
  const name = document.querySelector('#name').value.toLowerCase()
  const price = document.querySelector('#price').value
  const isNameUsed = inventory.find(item => item.name === name)

  if (!isNameUsed) {
    inventory.push({
      id: id,
      date: date,
      modDate: date,
      name: name,
      quantity: 0,
      price: price,
      totalPrice: 0
    })

    updateInventoryLocalStorege()
    closeInventoryForm()
  } else {
    alert(`JÁ EXISTE ${name.toUpperCase()} NO ESTOQUE`)
  }
}

const removeInventoryItem = id => {
  const response = confirm('TEM CERTEZA QUE DESEJA DELETAR?')

  if (response === true) {
    inventory = inventory.filter(item => item.id != id)
    setInventoryPageQuantity()
    handleInventoryPageNumberWhenRemovingItem()
    updateInventoryLocalStorege()
    displayInventoryOnScreen(inventoryItemPerPage())
  }
}

const displayInventoryOnScreen = inventory => {
  const itemsList = document.querySelector('#itens-list')
  itemsList.innerHTML = ''

  inventory.forEach(item => {
    itemsList.innerHTML += `
      <tr id='${item.id}'>
        <td>${item.date}</td>
        <td>${item.modDate}</td>
        <td id="item-name">${item.name}</td>
        <td>${item.quantity}</td>
        <td>${setCurrency(item.price)}</td>
        <td>${setCurrency(item.totalPrice)}</td>
        <td>
          <button id="trash" type="button" onClick="removeInventoryItem( ${item.id} )">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
  })
}

const handleInventoryFormSubmit = event => {
  event.preventDefault()
  addItemIntoArray()
  setInventoryPageQuantity()
  displayInventoryPageNumbers()
  displayInventoryOnScreen(inventoryItemPerPage())
}

registerForm.addEventListener('submit', handleInventoryFormSubmit)

////// OPERATION FORM //////

const operations = document.querySelector('#operations')
const operationForm = document.querySelector('#operation-form')

const openOperationsForm = () => {
  cleanOperationForm()
  fillNamesOptions()
  operationForm.style.display = 'inherit'
}

const operationButton = document.querySelector('#operation-button')
operationButton.addEventListener('click', openOperationsForm)

const closeOperationForm = () => {
  operationForm.style.display = 'none'
  setInitialOperationColor()
}

document.querySelector('#cancel-operations-button')
  .addEventListener('click', closeOperationForm)

const fillNamesOptions = () => {
  const itemsNames = document.querySelector('#operation-item-name')
  itemsNames.innerHTML = ''

  inventory.forEach(({ name }) => {
    itemsNames.innerHTML += `
      <option id="option-name" value="${name}">${name}</option>
    `
  })
}

const emptyListAlert = () => {
  const itemName = document.querySelector('#operation-item-name').value

  if (itemName === '') {
    alert('OPERAÇÃO NÃO CONCLUÍDA. ADICIONE UM ITEM PRIMEIRO.')
    closeOperationForm()
  }
}

const setInitialOperationColor = () => operations.style.color = 'green'

const handleOperationColor = event => {
  const operationName = event.target.value

  if (operationName === 'add') {
    operations.style.color = 'green'
  } else {
    operations.style.color = 'red'
  }
}

operations.addEventListener('change', handleOperationColor)

const addOperation = (name, date, quantity) => {
  inventory.forEach(item => {
    const totalPrice = item.price * quantity

    if (item.name === name) {
      item.modDate = date
      item.quantity += quantity
      item.totalPrice += totalPrice
      closeOperationForm()
    }
  })
}

const validQuantity = (item, name, quantity) => (
  item.name === name && item.quantity > 0 && quantity <= item.quantity
)

const notValidQuantity = (item, name, quantity) => (
  item.name === name && (item.quantity === 0 || item.quantity < quantity)
)

const withdrawOperation = (name, date, quantity) => {
  inventory.forEach(item => {
    let totalPrice = item.price * quantity

    if (validQuantity(item, name, quantity)) {
      item.modDate = date
      item.quantity -= quantity
      item.totalPrice -= totalPrice
      closeOperationForm()
    } else if (notValidQuantity(item, name, quantity)) {
      alert(`QUANTIDADE DE ${item.name.toUpperCase()} MAIOR QUE O DISPONÍVEL.`)
    }

  })
}

const handleOperationsFormSubmit = event => {
  event.preventDefault()
  const operation = document.querySelector('#operations').value
  const name = document.querySelector('#operation-item-name').value
  const quantity = Number(document.querySelector('#quantity').value)
  const date = getDate()

  if (operation === 'add') {
    addOperation(name, date, quantity)
  } else {
    withdrawOperation(name, date, quantity)
  }
  emptyListAlert()
  setInitialOperationColor()
  displayInventoryOnScreen(inventoryItemPerPage())
}

operationForm.addEventListener('submit', handleOperationsFormSubmit)

const displayButtonAndInputOnScreen = button => {
  searchInput.style.display = 'initial'
  document.querySelector('.search-insert').style.justifyContent = 'space-between'
  document.querySelector('#search-icon').style.display = 'initial'
  button.style.display = 'initial'
}

const hideButtonAndInputOnScreen = button => {
  searchInput.style.display = 'none'
  document.querySelector('.search-insert').style.justifyContent = 'center'
  document.querySelector('#search-icon').style.display = 'none'
  button.style.display = 'none'
}

const handleOperationButtonAndInput = menu => {
  if (menu === 'menu-inventory') {
    displayButtonAndInputOnScreen(operationButton)
  } else {
    hideButtonAndInputOnScreen(operationButton)
  }
}

////// FORMATTING AND ANOTHER INFOS //////

const generetedID = array => Math.round(Math.random() * array.length)
const getArrayIDs = array => array.map(item => item.id)

const isUniqueID = array => {
  let id = generetedID(array)
  let verifieldIDs = getArrayIDs(array)

  while (verifieldIDs.includes(id)) {
    id = generetedID(array)
  }

  return id
}

const getDate = () => {
  const date = new Date()

  return `
    ${date.getDate()} /
    ${date.getUTCMonth() + 1} /
    ${date.getFullYear()}
  `
}

const setCurrency = price => (
  Number(price)
    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
)

const cleanInventoryForm = () => registerForm.reset()
const cleanVisitForm = () => visitForm.reset()
const cleanOperationForm = () => operationForm.reset()

////// INIT //////

const init = () => {
  inventoryTitle()
  handleMenuOptions(menuInventory, menuVisit)
  setInitialCurrentPage(inventory)
  displayInventoryPageNumbers()
  displayInventoryOnScreen(inventoryItemPerPage())
}

init()