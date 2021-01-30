
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

const handlePageNumberIntoDOM = () => {
  const pageNumber = document.querySelector( '#page-number' )
  pageNumber.innerText = `${ currentPage } de ${ pageQuantity }`
}

const handlePageNumberOnRemoveItem = () => {
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

const handlePageNumberOnClick = e => {
  if ( e.target.id === 'previous' && arrayLimiter > 3 ) {
    firstArrayItem -= 3
    arrayLimiter -= 3
    currentPage -= 1
  } else if ( e.target.id === 'next' && arrayLimiter < inventory.length ) {
    firstArrayItem += 3
    arrayLimiter += 3
    currentPage += 1
  } 

  init()
}

// ----- SEARCH -----

const getSearchedItems = name => {
  const filteredItens = inventory.filter( item => item.name.includes( name ) )
  return filteredItens
}

const verifySearchFieldAndAddItemsIntoDOM = () => {

  const wantedItem = searchInput.value.toLowerCase()
  
  if ( wantedItem === '' ) {
    addInventoryIntoDOM( inventory.slice( firstArrayItem, arrayLimiter ) )
  } else {
    addInventoryIntoDOM( getSearchedItems( wantedItem ) )
  }
}

const cleanSearchInput = () => {
  searchInput.value = ''
  init()
}

// ----- LIST INTO DOM -----

const addInventoryIntoDOM = inventory => {
  const itensList = document.querySelector( '#itens-list' )
  itensList.innerHTML = ''
  
  inventory.forEach ( item => {
    itensList.innerHTML += `
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
  const choosenAnswer = confirm( 'TEM CERTEZA QUE DESEJA DELETAR?' )

  if ( choosenAnswer === true ) {
    inventory = inventory.filter( item => item.id != id )
    pageQuantity = setPageQuantity() 
  }

  handlePageNumberOnRemoveItem()
}

// ----- REGISTER FORM -----

const openRegisterForm = e => {
  const inputName = document.querySelector( '#name' )

  //cleanForms(e.target.id)
  registerForm.style.display = 'inherit'
  inputName.focus()
}

const closeRegisterForm = () => registerForm.style.display = 'none'

const addItem = () => {

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

  addItem()
  init()
  closeRegisterForm()
}

// ----- OPERATION FORM -----

const openOperationForm = e => {
  fillNamesOptions()
  cleanForms(e.target.id)
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

const handleOperationColor = e => {
  if ( e.target.value != 'add' ) {
    operations.style.color = 'red'
  } 
}

const addOperation = ( name, date, quantity ) => {

  inventory.forEach( item => {
    if ( item.name === name ) {
      item.modDate = date
      item.quantity += quantity
      item.totalPrice += item.price * quantity
    }
  })
}

const isValidQuantity = item => { 
  return item.name === name && 
  item.quantity > 0 && quantity <= item.quantity
}

const isInvalidQuantity = item => { 
  return item.name === name && 
  ( item.quantity === 0 || item.quantity < quantity )
}

const withdrawOperation = ( name, date, quantity ) => {
  inventory.forEach( item => {
    if ( isValidQuantity( item ) ) {
      item.modDate = date
      item.quantity -= quantity
      item.totalPrice -= item.price * quantity
    } else if ( isInvalidQuantity( item ) ) {
      alert(`QUANTIDADE DE ${item.name.toUpperCase()} MAIOR QUE O DISPONÍVEL.`)
    }
  })
}

const handleOperationFormSubmit = () => {
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

  setInitialOperationColor()
  init()
  closeOperationForm()
  emptyListAlert()
}

const fillNamesOptions = () => {
  const itensNames = document.querySelector( '#operation-item-name' )
  itensNames.innerHTML = ''

  inventory.forEach( item => {
    itensNames.innerHTML += `
      <option id="option-name" value="${ item.name }">${ item.name }</option>
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

  verifySearchFieldAndAddItemsIntoDOM()
  handlePageNumberIntoDOM()
  updateLocalStorege()
}

init()

// EVENT LISTENERS

registerButton.addEventListener('click', openRegisterForm)
cancelRegisterButton.addEventListener('click', closeRegisterForm)
operationButton.addEventListener('click', openOperationForm)
cancelOperationButton.addEventListener('click', closeOperationForm)
operations.addEventListener('change', handleOperationColor)
searchInput.addEventListener('keyup', verifySearchFieldAndAddItemsIntoDOM)
searchInput.addEventListener('blur', cleanSearchInput)
registerForm.addEventListener('submit', handleRegisterFormSubmit)
operationForm.addEventListener('submit', handleOperationFormSubmit)
previousButton.addEventListener('click', handlePageNumberOnClick)
nextButton.addEventListener('click', handlePageNumberOnClick)