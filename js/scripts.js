// variable containing array of objects with data of different pokemon wrapped in a IIFE
let pokemonRepository = (function () {

  let pokemonList = []; // Pokemon array

  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150'; // Pokemon API

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemon) {
    let container = document.querySelector('.pokemon-list');
    let listItem = document.createElement('li');
    let button = document.createElement('button');
    $(listItem).addClass('group-list-item');
    $(button).addClass('btn');
    $(button).addClass('my-button');
    $(button).attr('data-toggle', 'modal');
    $(button).attr('data-target', '#modalCenter');
    button.innerText = pokemon.name;
    listItem.appendChild(button);
    container.appendChild(listItem);

    // Event listener for when a user clicks a button
    button.addEventListener('click', function (event) {
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
    return response.json();
  }).then(function (json) {
    json.results.forEach(function (item) {
      let pokemon = {
        name: item.name,
        detailsUrl: item.url
      };
      add(pokemon);
    });
  }).catch(function (e) {
    console.error(e);
  })
}

function loadDetails(item) {
  let url = item.detailsUrl;
  return fetch(url).then(function (response) {
    return response.json();
  }).then(function (details) {
    // Now we add the details to the item
    item.imageUrl = details.sprites.front_default;
    item.height = details.height;
    item.types = details.types;
  }).catch(function (e) {
    console.error(e);
  });
}

// Modal functionality
let modalContainer = document.querySelector('#modalCenter'); // defines the modal container globally

function showModal(title, text, image) {
  //modalContainer.innerHTML = ''; // Clears all the existing modal content
  let modalBody = $('modal-body');
  let modalTitle = $('modal-title');

  modalTitle.empty();
  modalBody.empty();

  let modal = document.createElement('div');
  modal.classList.add('modal');

  let titleElement = document.querySelector('#modalTitle');
  titleElement.innerText = title;
  console.log(modalTitle);

  let contentElement = document.createElement('p');
  contentElement.innerText = text;

  let myImage = document.createElement('img');
  myImage.src = image;

  modalTitle.appendChild(titleElement);
  modalBody.appendChild(contentElement);
  modalBody.appendChild(myImage);
  modalContainer.appendChild(modal);

  modalContainer.classList.add('is-visible');
}

function hideModal() {
  modalContainer.classList.remove('is-visible');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
    hideModal();
  }
});

modalContainer.addEventListener('click', (e) => { // Event listener for user clicking outside the modal
  let target = e.target;
  if (target === modalContainer) {
    hideModal();
  }
});

document.querySelector('#modalCenter').addEventListener('click', () => {
  showModal('Modal title', 'This is the modal content!');
});

function showDetails(pokemon) {
  loadDetails(pokemon).then(function () {
    console.log(pokemon);
    showModal(pokemon.name,`Height: ${pokemon.height}`, pokemon.imageUrl);
  });
}

return {
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  showDetails: showDetails,
  loadList: loadList,
  loadDetails: loadDetails,
  showModal: showModal,
  hideModal: hideModal
};
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
