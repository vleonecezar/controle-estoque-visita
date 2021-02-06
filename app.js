
// GLOBAL VARIABLES

const menuInventory = document.querySelector('#menu-inventory')
const menuVisit = document.querySelector('#menu-visit')

const operations = document.querySelector('#operations')
const searchInput = document.querySelector('#search')
const registerForm = document.querySelector('#register-form')
const visitForm = document.querySelector('#visit-form')
const operationForm = document.querySelector('#operation-form')
const previousButton = document.querySelector('#previous')
const nextButton = document.querySelector('#next')

let firstInventoryArrayItem = 0  // FIRST PARAMETER FROM SLICE 
let inventoryArrayLimiter = 3  // SECOND PARAMETER FROM SLICE
let firstVisitArrayItem = 0  // FIRST PARAMETER FROM SLICE 
let visitArrayLimiter = 3  // SECOND PARAMETER FROM SLICE
let currentInventoryPage = 1
let inventoryPageQuantity = 1
let currentVisitPage = 1
let visitPageQuantity = 1

// ----- LOCAL STORAGE -----

const localStorageInventory = JSON.parse( localStorage.getItem( 'inventory' ) )
let inventory = localStorage.getItem('inventory') != null ? localStorageInventory : []

const localStorageVisit = JSON.parse( localStorage.getItem( 'visit' ) )
let visit = localStorage.getItem('visit') != null ? localStorageVisit : []

const updateLocalStorege = () => {
	localStorage.setItem( 'inventory', JSON.stringify( inventory ) )
	localStorage.setItem( 'visit', JSON.stringify( visit ) )
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
    verifySearchFieldAndDisplayItems()
    displayPageNumbers()
  } else {
    handleMenuOptions( menuVisit, menuInventory )
    displayVisitTHead()
    verifySearchFieldAndDisplayItems()
    displayPageNumbers()
  }

  handleVisitButtons(chosenOption)
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
    <th>Data</th>
    <th>Nome</th>
    <th>Endereço</th>
    <th>Responsável</th>
    <th>Telefone</th>
    <th id="actions">Ações</th>
  `
}

// PAGINATION SETTINGS

const setInventoryPageQuantity = () => Math.round( ( inventory.length + 0.5 ) / 3 )
const setVisitPageQuantity = () => Math.round( ( visit.length + 0.5 ) / 3 )

const displayInventoryPageNumbers = () => {
  const pageNumber = document.querySelector( '#page-number' )
  pageNumber.innerText = `${ currentInventoryPage } de ${ inventoryPageQuantity }`
}

const displayVisitPageNumbers = () => {
  const pageNumber = document.querySelector( '#page-number' )
  pageNumber.innerText = `${ currentVisitPage } de ${ visitPageQuantity }`
}

const displayPageNumbers = () => {
  if ( menuInventory.style.backgroundColor != 'transparent' ) {
    displayInventoryPageNumbers()
  } else {
    displayVisitPageNumbers()
  }
}

const handleInventoryPageNumberWhenRemovingItem = () => {
  if ( currentInventoryPage > inventoryPageQuantity ) {
    currentInventoryPage -= 1
    firstInventoryArrayItem -= 3
    inventoryArrayLimiter -= 3

    if ( currentInventoryPage === 0 ) {
      currentInventoryPage = 1
      inventoryPageQuantity = 1
      firstInventoryArrayItem = 0
      inventoryArrayLimiter = 3 
    }
  }

  init()
}

const handleVisitPageNumberWhenRemovingItem = () => {
  if ( currentVisitPage > visitPageQuantity ) {
    currentVisitPage -= 1
    firstVisitArrayItem -= 3
    visitArrayLimiter -= 3

    if ( currentVisitPage === 0 ) {
      currentVisitPage = 1
      visitPageQuantity = 1
      firstVisitArrayItem = 0
      visitArrayLimiter = 3 
    }
  }

  init()
}

const handlePageNumberWhenClicking = event => {
  if ( menuInventory.style.backgroundColor != 'transparent' ) {
    handleInventoryPageNumberWhenClicking(event)
  } else {
    handleVisitPageNumberWhenClicking(event)
  }
}

const handleInventoryPageNumberWhenClicking = e => {
  const eventID = e.target.id
  const greater = inventoryArrayLimiter > 3
  const less = inventoryArrayLimiter < inventory.length
  const previous = eventID === 'previous' && greater
  const next = eventID === 'next' && less

  if ( previous ) {
    firstInventoryArrayItem -= 3
    inventoryArrayLimiter -= 3
    currentInventoryPage -= 1
  } else if ( next ) {
    firstInventoryArrayItem += 3
    inventoryArrayLimiter += 3
    currentInventoryPage += 1
  } 

  init()
}

const handleVisitPageNumberWhenClicking = e => {
  const eventID = e.target.id
  const greater = visitArrayLimiter > 3
  const less = visitArrayLimiter < visit.length
  const previous = eventID === 'previous' && greater
  const next = eventID === 'next' && less

  if ( previous ) {
    firstVisitArrayItem -= 3
    visitArrayLimiter -= 3
    currentVisitPage -= 1
  } else if ( next ) {
    firstVisitArrayItem += 3
    visitArrayLimiter += 3
    currentVisitPage += 1
  } 

  init()
}

// ----- SEARCH -----

const getSearchedItem = name => {
  const filteredItens = inventory.filter( item => item.name.includes( name ) )
  return filteredItens
}

const verifySearchFieldAndDisplayItems = () => {
  const isVisitMenu = menuInventory.style.backgroundColor === 'transparent'

  const searchedItem = searchInput.value.toLowerCase()

  const notSearching = inventory.slice( firstInventoryArrayItem, inventoryArrayLimiter )
  const notSearchingVisit = visit.slice( firstVisitArrayItem, visitArrayLimiter )
  const searching = getSearchedItem( searchedItem )

  if ( searchedItem === '' && isVisitMenu ) {
    displayVisitIntoDOM(notSearchingVisit)
  } else if ( searchedItem === '' && !isVisitMenu ) {
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

const displayVisitIntoDOM = visit => {
  const itemsList = document.querySelector( '#itens-list' )
  itemsList.innerHTML = ''
  
  visit.forEach ( item => {
    itemsList.innerHTML += `
      <tr id='${ item.id }'>
        <td>${ item.date }</td>
        <td id="item-name">${ item.name }</td>
        <td>${ item.adress }</td>
        <td>${ item.responsible }</td>
        <td>${ item.phone }</td>
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

  if ( response === true && menuVisit.style.backgroundColor === 'transparent' ) {
    inventory = inventory.filter( item => item.id != id )
    inventoryPageQuantity = setInventoryPageQuantity() 
    handleInventoryPageNumberWhenRemovingItem()
  } else if ( response === true && menuVisit.style.backgroundColor != 'transparent' ) {
    visit = visit.filter( item => item.id != id )
    visitPageQuantity = setVisitPageQuantity() 
    handleVisitPageNumberWhenRemovingItem()
  }
}

// ----- VISIT FORM -----

const handleVisitFormSubmit = () => {
  event.preventDefault()

  addVisitIntoArray()
  init()
  closeVisitForm()
}

const addVisitIntoArray = () => {
  const id = isUniqueID()
  const date = document.querySelector('#date').value
  const name = document.querySelector( '#visit-name' ).value.toLowerCase()
  const adress = document.querySelector( '#adress' ).value
  const responsible = document.querySelector('#responsible').value
  const phone = document.querySelector('#phone').value
  const isNameUsed = visit.find(item => item.name === name)

  if ( !isNameUsed ) {
    visit.push({
      id: id,
      date: date,
      name: name,
      adress: adress,
      responsible: responsible,
      phone: phone,
    })
  
    visitPageQuantity = setVisitPageQuantity() 
    init()
  } else {
    alert( `JÁ EXISTE ${name.toUpperCase()} NAS VISITAS` )
  }
}

const handleVisitButtons = menu => {
  if ( menu === 'menu-inventory' ) {
    searchInput.style.display = 'initial'
    document.querySelector('.search-insert').style.justifyContent = 'space-between'
    document.querySelector('#search-icon').style.display = 'initial'
    operationButton.style.display = 'initial'
  } else {
    searchInput.style.display = 'none'
    document.querySelector('.search-insert').style.justifyContent = 'center'
    document.querySelector('#search-icon').style.display = 'none'
    operationButton.style.display = 'none'
  }
}

// ----- REGISTER FORM -----

// OPEN INVENTORY OR VISIT FORM
document.querySelector('#register-button').addEventListener('click', event => {

  const inputName = document.querySelector( '#name' )
    const formID = event.target.id
    const isInventory = menuInventory.style.backgroundColor != 'transparent'
  
    if ( isInventory ) {
      registerForm.style.display = 'inherit'
    } else {
      visitForm.style.display = 'inherit'
    }
  
    //cleanForms(formID)
    inputName.focus()
})

// CLOSE INVENTORY FORM
const closeRegisterForm = () => {
  registerForm.style.display = 'none'
}

document.querySelector('#cancel-register-button')
  .addEventListener('click', closeRegisterForm())

  


// CLOSE VISIT FORM
const closeVisitForm = () => {
  registerForm.style.display = 'none'
}

document.querySelector('#cancel-visit-button')
  .addEventListener('click', closeVisitForm)


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
  
    inventoryPageQuantity = setInventoryPageQuantity() 
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

// OPEN OPERATIONS FORM
document.querySelector('#operation-button')
  .addEventListener('click', function openOperationsForm(event) {
  const formID = event.target.id

  fillNamesOptions()
  cleanForms(formID)

  operationForm.style.display = 'inherit'
})

// CLOSE OPERATION FORM
const closeOperationForm = () => {
  operationForm.style.display = 'none'
  setInitialOperationColor()
}

document.querySelector('#cancel-operations-button')
  .addEventListener('click', closeOperationForm)

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

const generetedID = () => {
  if ( menuInventory.style.backgroundColor != 'transparent' ) {
    return Math.round( Math.random() * inventory.length )
  } else {
    return Math.round( Math.random() * visit.length )
  }
} 

const isUniqueID = () => {
  let arrayIDs = []
  let id = generetedID() + 1

  if ( menuInventory.style.backgroundColor != 'transparent' ) {
    arrayIDs = inventory.map( item => item.id )

    while ( arrayIDs.includes( id ) ) {
      id = generetedID() + 1
    }
  } else {
    arrayIDs = visit.map( item => item.id )

    while ( arrayIDs.includes( id ) ) {
      id = generetedID() + 1
    }
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


operations.addEventListener('change', handleOperationColor)

searchInput.addEventListener('keyup', verifySearchFieldAndDisplayItems)

searchInput.addEventListener('blur', cleanSearchInput)

registerForm.addEventListener('submit', handleRegisterFormSubmit)
visitForm.addEventListener('submit', handleVisitFormSubmit)
operationForm.addEventListener('submit', handleOperationsFormSubmit)
previousButton.addEventListener('click', handlePageNumberWhenClicking)
nextButton.addEventListener('click', handlePageNumberWhenClicking)

