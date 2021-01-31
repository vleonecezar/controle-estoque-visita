
// GLOBAL VARIABLES

const registerButton = document.querySelector('#register-button')
const cancelRegisterButton = document.querySelector('#cancel-register-button')
const operationButton = document.querySelector('#operation-button')
const cancelOperationButton = document.querySelector('#cancel-operation-button')
const operations = document.querySelector('#operations')
const searchInput = document.querySelector('#search')
const registerForm = document.querySelector('#register-form')
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

const updateLocalStorege = () => {
	localStorage.setItem( 'inventory', JSON.stringify( inventory ) ) 
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
  
  if ( searchedItem === '' ) {
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

const openRegisterForm = event => {
  const inputName = document.querySelector( '#name' )
  const formID = event.target.id

  //cleanForms(formID)
  registerForm.style.display = 'inherit'
  inputName.focus()
}

const closeRegisterForm = () => registerForm.style.display = 'none'

const addItemIntoArray = () => {
  const id = isUniqueID()
  const date = getDate()
  const name = document.querySelector( '#name' ).value.toLowerCase()
  const price = document.querySelector( '#price' ).value

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
  } 
}

const addOperation = ( name, date, quantity ) => {
  const totalPrice = item.price * quantity

  inventory.forEach( item => {
    if ( item.name === name ) {
      item.modDate = date
      item.quantity += quantity
      item.totalPrice += totalPrice
    }
  })
}

const validQuantity = ( item, name ) => { 
  return item.name === name && 
  item.quantity > 0 && quantity <= item.quantity
}

const notValidQuantity = ( item, name ) => { 
  return item.name === name && 
  ( item.quantity === 0 || item.quantity < quantity )
}

const withdrawOperation = ( name, date, quantity ) => {
  inventory.forEach( item => {

    if ( validQuantity( item, name ) ) {
      item.modDate = date
      item.quantity -= quantity
      item.totalPrice -= item.price * quantity
    } else if ( notValidQuantity( item, name ) ) {
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

init()

// EVENT LISTENERS

registerButton.addEventListener('click', openRegisterForm)
cancelRegisterButton.addEventListener('click', closeRegisterForm)
operationButton.addEventListener('click', openOperationsForm)
cancelOperationButton.addEventListener('click', closeOperationForm)
operations.addEventListener('change', handleOperationColor)
searchInput.addEventListener('keyup', verifySearchFieldAndDisplayItems)
searchInput.addEventListener('blur', cleanSearchInput)
registerForm.addEventListener('submit', handleRegisterFormSubmit)
operationForm.addEventListener('submit', handleOperationsFormSubmit)
previousButton.addEventListener('click', handlePageNumberWhenClicking)
nextButton.addEventListener('click', handlePageNumberWhenClicking)