
// GLOBAL VARIABLES

const menuInventory = document.querySelector('#menu-inventory')
const menuVisit = document.querySelector('#menu-visit')
const tableHead = document.querySelector('#table-head')
const registerButton = document.querySelector('#register-button')
const cancelRegisterButton = document.querySelector('#cancel-register-button')
const cancelOperationsButton = document.querySelector('#cancel-operations-button')
const cancelVisitButton = document.querySelector('#cancel-visit-button')
const operationButton = document.querySelector('#operation-button')
const operations = document.querySelector('#operations')
const searchInput = document.querySelector('#search')
const registerForm = document.querySelector('#register-form')
const visitForm = document.querySelector('#visit-form')
const operationForm = document.querySelector('#operation-form')
const previousButton = document.querySelector('#previous')
const nextButton = document.querySelector('#next')

let firstArrayItem = 0  // FIRST PARAMETER FROM SLICE 
let arrayLimiter = 3  // SECOND PARAMETER FROM SLICE
let currentPage = 1
let pageQuantity = 1

// ----- LOCAL STORAGE -----

const localStorageInventory = JSON.parse( localStorage.getItem( 'inventory' ) )
let inventory = localStorage.getItem('inventory') != null ? localStorageInventory : []

const localStorageVisit = JSON.parse( localStorage.getItem( 'visit' ) )
let visit = localStorage.getItem('visit') != null ? localStorageVisit : []

const updateLocalStorege = () => {
	localStorage.setItem( 'inventory', JSON.stringify( inventory ) )
	localStorage.setItem( 'visit', JSON.stringify( visit ) )
}

// VISIT

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
    <th>Data</th>
    <th>Nome</th>
    <th>Endereço</th>
    <th>Responsável</th>
    <th>Telefone</th>
    <th id="actions">Ações</th>
  `
}

// MENU SETTINGS

const handleMenuOptions = (display, hide) => {
  display.style.backgroundColor = 'rgb(231, 231, 231)'
  display.style.marginRight = '-0.5px'
  display.style.borderTop = '1px solid rgba(0, 0, 0, 0.199)'
  display.style.borderBottom = '1px solid rgba(0, 0, 0, 0.199)'

  hide.style.backgroundColor = 'transparent'
  hide.style.marginRight = '0'
  hide.style.borderTop = '1px solid transparent'
  hide.style.borderBottom = '1px solid transparent'
}

const displayChosenMenuOption = event => {
  const chosenOption = event.target.id

  if ( chosenOption === 'menu-inventory' ) {
    handleMenuOptions( menuInventory, menuVisit )
    displayInventoryTHead()
  } else {
    handleMenuOptions( menuVisit, menuInventory )
    displayVisitTHead()
  }
}

// PAGINATION SETTINGS

const setPageQuantity = () => Math.round( ( inventory.length + 0.5 ) / 3 )

const displayPageNumbers = () => {
  const pageNumber = document.querySelector( '#page-number' )
  pageNumber.innerText = `${ currentPage } de ${ pageQuantity }`
}

const handlePageNumberWhenRemovingItem = () => {
  if ( currentPage > pageQuantity ) {
    currentPage -= 1
    firstArrayItem -= 3
    arrayLimiter -= 3

    if ( currentPage === 0 ) {
      currentPage = 1
      pageQuantity = 1
      firstArrayItem = 0
      arrayLimiter = 3 
    }
  }

  init()
}

const handlePageNumberWhenClicking = e => {
  const eventID = e.target.id
  const greater = arrayLimiter > 3
  const less = arrayLimiter < inventory.length
  const previous = eventID === 'previous' && greater
  const next = eventID === 'next' && less

  if ( previous ) {
    firstArrayItem -= 3
    arrayLimiter -= 3
    currentPage -= 1
  } else if ( next ) {
    firstArrayItem += 3
    arrayLimiter += 3
    currentPage += 1
  } 

  init()
}

// ----- SEARCH -----

const getSearchedItem = name => {
  const filteredItens = inventory.filter( item => item.name.includes( name ) )
  return filteredItens
}

const verifySearchFieldAndDisplayItems = () => {
  const searchedItem = searchInput.value.toLowerCase()
  const notSearching = inventory.slice( firstArrayItem, arrayLimiter )
  const searching = getSearchedItem( searchedItem )
  
  if ( searchedItem === '' && menuInventory ) {
    displayListIntoDOM( notSearching )
  } else {
    displayListIntoDOM( searching )
  }
}

const cleanSearchInput = () => {
  searchInput.value = ''
  init()
}

// ----- DISPLAY LIST INTO DOM -----

const displayListIntoDOM = inventory => {
  const itemsList = document.querySelector( '#itens-list' )
  itemsList.innerHTML = ''
  
  inventory.forEach ( item => {
    itemsList.innerHTML += `
      <tr id='${ item.id }'>
        <td>${ item.date }</td>
        <td>${ item.modDate }</td>
        <td id="item-name">${ item.name }</td>
        <td>${ item.quantity }</td>
        <td>${ FormatCurrency( item.price ) }</td>
        <td>${ FormatCurrency( item.totalPrice ) }</td>
        <td>
          <button id="trash" type="button" onClick="removeItemIntoDOM( ${ item.id } )">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `
  })
}

const removeItemIntoDOM = id => {
  const response = confirm( 'TEM CERTEZA QUE DESEJA DELETAR?' )

  if ( response === true ) {
    inventory = inventory.filter( item => item.id != id )
    pageQuantity = setPageQuantity() 
  }

  handlePageNumberWhenRemovingItem()
}

// ----- REGISTER FORM -----

const isRegisterOrVisitForm = event => {
  const inputName = document.querySelector( '#name' )
  const formID = event.target.id
  const isInventory = menuVisit.style.backgroundColor === 'transparent'

  if ( isInventory ) {
    registerForm.style.display = 'inherit'
  } else {
    visitForm.style.display = 'inherit'
  }

  //cleanForms(formID)
  inputName.focus()
}

const closeRegisterForm = () => registerForm.style.display = 'none'

const closeVisitForm = () => visitForm.style.display = 'none'

const addItemIntoArray = () => {
  const id = isUniqueID()
  const date = getDate()
  const name = document.querySelector( '#name' ).value.toLowerCase()
  const price = document.querySelector( '#price' ).value
  const isNameUsed = inventory.find(item => item.name === name)

  if ( !isNameUsed ) {
    inventory.push({
      id: id,
      date: date,
      modDate: date,
      name: name,
      quantity: 0,
      price: price,
      totalPrice: 0
    })
  
    pageQuantity = setPageQuantity() 
    init()
  } else {
    alert( `JÁ EXISTE ${name.toUpperCase()} NO ESTOQUE` )
  }
}

const handleRegisterFormSubmit = () => {
  event.preventDefault()

  addItemIntoArray()
  init()
  closeRegisterForm()
}

// ----- OPERATION FORM -----

const openOperationsForm = event => {
  const formID = event.target.id

  fillNamesOptions()
  cleanForms(formID)

  operationForm.style.display = 'inherit'
}

const closeOperationForm = () => {
  operationForm.style.display = 'none'

  setInitialOperationColor()
}

const emptyListAlert = () => {
  const itemName = document.querySelector('#operation-item-name').value
  
  if ( itemName === '' ) {
    alert('OPERAÇÃO NÃO CONCLUÍDA. ADICIONE UM ITEM PRIMEIRO.')
  }
}

const setInitialOperationColor = () => {
  operations.style.color = 'green'
}

const handleOperationColor = event => {
  const operationValue = event.target.value
  const notAddOperation = operationValue != 'add'

  if ( notAddOperation ) {
    operations.style.color = 'red'
  } else {
    operations.style.color = 'green'
  }
}

const addOperation = ( name, date, quantity ) => {

  inventory.forEach( item => {
    const totalPrice = item.price * quantity

    if ( item.name === name ) {
      item.modDate = date
      item.quantity += quantity
      item.totalPrice += totalPrice
    }
  })
}

const validQuantity = ( item, name, quantity ) => { 
  return item.name === name && 
  item.quantity > 0 && quantity <= item.quantity
}

const notValidQuantity = ( item, name, quantity ) => { 
  return item.name === name && 
  ( item.quantity === 0 || item.quantity < quantity )
}

const withdrawOperation = ( name, date, quantity ) => {
  inventory.forEach( item => {
    let totalPrice = item.price * quantity

    if ( validQuantity( item, name, quantity ) ) {
      item.modDate = date
      item.quantity -= quantity
      item.totalPrice -= totalPrice
    } else if ( notValidQuantity( item, name, quantity ) ) {
      alert(`QUANTIDADE DE ${item.name.toUpperCase()} MAIOR QUE O DISPONÍVEL.`)
    }
    
  })
}

const handleOperationsFormSubmit = () => {
  event.preventDefault()
  
  const operation = document.querySelector( '#operations' ).value
  const name = document.querySelector( '#operation-item-name' ).value
  const quantity = Number( document.querySelector( '#quantity' ).value )
  const date = getDate()

  if ( operation === 'add' ) {
    addOperation( name, date, quantity )
  } else {
    withdrawOperation( name, date, quantity )
  }

  emptyListAlert()
  closeOperationForm()
  setInitialOperationColor()
  init()
}

const fillNamesOptions = () => {
  const itemsNames = document.querySelector( '#operation-item-name' )
  itemsNames.innerHTML = ''

  inventory.forEach( ({ name }) => {
    itemsNames.innerHTML += `
      <option id="option-name" value="${ name }">${ name }</option>
    `
  })
}

// ----- FORMATTING AND ANOTHER INFOS -----

const generetedID = () => Math.round( Math.random() * inventory.length )

const isUniqueID = () => {
  const inventoryIDs = inventory.map( item => item.id )
  let id = generetedID() + 1

  while ( inventoryIDs.includes( id ) ) {
    id = generetedID() + 1
  }

  return id
}

const getDate = () => {
  const date = new Date()

  return `
    ${ date.getDate() } / 
    ${ date.getUTCMonth() + 1 } / 
    ${ date.getFullYear() }
  `
}

const FormatCurrency = price => {
  return Number( price )
    .toLocaleString( 'pt-br', { style: 'currency', currency: 'BRL' } )
}

const cleanForms = id => {

  if ( id === 'register-button' ) {
    registerForm.reset()
  } else {
    operationForm.reset()
  }
}

// ----- INIT -----

const init = () => {
  verifySearchFieldAndDisplayItems()
  displayPageNumbers()
  updateLocalStorege()
}

handleMenuOptions( menuInventory, menuVisit )
init()

// EVENT LISTENERS

menuInventory.addEventListener('click', displayChosenMenuOption)
menuVisit.addEventListener('click', displayChosenMenuOption)

registerButton.addEventListener('click', isRegisterOrVisitForm)
cancelRegisterButton.addEventListener('click', closeRegisterForm)
cancelVisitButton.addEventListener('click', closeVisitForm)
operationButton.addEventListener('click', openOperationsForm)
cancelOperationsButton.addEventListener('click', closeOperationForm)

operations.addEventListener('change', handleOperationColor)

searchInput.addEventListener('keyup', verifySearchFieldAndDisplayItems)

searchInput.addEventListener('blur', cleanSearchInput)

registerForm.addEventListener('submit', handleRegisterFormSubmit)
operationForm.addEventListener('submit', handleOperationsFormSubmit)
previousButton.addEventListener('click', handlePageNumberWhenClicking)
nextButton.addEventListener('click', handlePageNumberWhenClicking)