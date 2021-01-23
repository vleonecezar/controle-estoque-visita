const addItemButton = document.querySelector('#add-button')
const form = document.querySelector('#form')
const cancelButtonForm = document.querySelector('#cancel-button-form')
const inventoryOptions = document.querySelector('#inventory-options')
const itensList = document.querySelector('#itens-list')
const actionsTh = document.querySelector('#actions')

let Inventory = []

const openForm = () => form.style.display = 'inherit'
const closeForm = () => form.style.display = 'none'