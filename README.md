

# 💻 CONTROLE DE ESTOQUE E VISITAS

---

## 🗒️ Sobre o projeto

Esta aplicação web foi idealizada por causa da necessidade de uma empresa ao qual eu trabalhei (não como desenvolvedor). Nela não existia uma maneira eficiente e rápida de controle ou organização dos materiais no estoque e nem de marcações de visitas técnicas. Tudo era feito em planilhas do Excel, deixando o processo muito lento e confuso. Lembrando deste problema, usei o mesmo para praticar nessa aplicação.

Na aplicação existe um menu lateral onde se pode navegar pelas opções de estoque e visitas, ambas as opções exibem uma lista de itens e tem paginação com limite de 10 itens por página.

No estoque é possível cadastrar itens com nome único e preço unitário. É possível gerenciar os itens cadastrados através das operações de adicionar e retirar itens.
A operação 'adicionar' exibe itens cadastrados onde é possível acrescentar a quantidade do item selecionado. O mesmo acontece na operação 'retirar', tirando o fato que será usada para retirar itens e exibirá somente itens cadastrados e com quantidade maior que '0'.

Já nas visitas, pode-se adicionar itens na lista com informações como data da visita, nome da empresa, endereço e nome do responsável.

Todos os itens de ambas as opções tem a possibilidade de serem deletados clicando na lixeira da coluna "ações".

Por não haver um backend e banco de dados, as informações são adicionadas no localStorage, sendo assim persistindo mesmo que a pagina seja fechada ou recarregada.



---

## 🛠 Tecnologias

### Frontend:

-   HTML
-   CSS
-   JavaScript

---

## 🎨 Screens

### Estoque

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="estoque" src="./assets/readme/estoque.jpg" width="400px">
</p>

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="estoque" src="./assets/readme/cadastro_estoque.jpg" width="400px">
</p>

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="estoque" src="./assets/readme/gerenciar_estoque.jpg" width="400px">
</p>

### Visitas

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="estoque" src="./src/assets/readme/visaitas.jpg" width="400px">
</p>

<p align="center" style="display: flex; align-items: flex-start; justify-content: center;">
  <img alt="estoque" src="./assets/readme/cadastro_visitas.jpg" width="400px">
</p>