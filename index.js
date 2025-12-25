function capitalizeHyphenated(str) {
    return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
}

const typeColors = {
    'normal': 'type-normal', 'fire': 'type-fire', 'water': 'type-water',
    'electric': 'type-electric', 'grass': 'type-grass', 'ice': 'type-ice',
    'fighting': 'type-fighting', 'poison': 'type-poison', 'ground': 'type-ground',
    'flying': 'type-flying', 'psychic': 'type-psychic', 'bug': 'type-bug',
    'rock': 'type-rock', 'ghost': 'type-ghost', 'dragon': 'type-dragon',
    'dark': 'type-dark', 'steel': 'type-steel', 'fairy': 'type-fairy'
};

let allPokemonCards = [];

async function loadAllPokemon() {
    const container = document.getElementById("pokemonContainer");
    const sidebar = document.getElementById("alphabetSidebar");
    const totalPokemon = 1025;
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.onclick = () => filterByLetter(letter, btn);
        sidebar.appendChild(btn);
    });
    
    for (let id = 1; id <= totalPokemon; id++) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) continue;
            
            const data = await response.json();
            
            const paddedId = data.id.toString().padStart(4, "0");
            const abilitiesString = data.abilities.map(ability => 
                capitalizeHyphenated(ability.ability.name)
            ).join(", ");
            
            const typesHtml = data.types.map(type => {
                const typeName = type.type.name.toLowerCase();
                const className = typeColors[typeName] || 'type-normal';
                const displayName = capitalizeHyphenated(typeName);
                return `<span class="type-badge ${className}">${displayName}</span>`;
            }).join('');
            
            const pokemonCard = document.createElement("div");
            pokemonCard.className = "pokemon-card";
            pokemonCard.dataset.name = data.name;
            
            pokemonCard.innerHTML = `
                <div class="pokemon-name">${capitalizeHyphenated(data.name)}</div>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <div>
                    <div class="pokemon-id">#${paddedId}</div>
                    <div class="pokemon-types">${typesHtml}</div>
                    <div class="pokemon-abilities">${abilitiesString}</div>
                </div>
            `;
            
            container.appendChild(pokemonCard);
            allPokemonCards.push(pokemonCard);
            
        } catch(error) {
            console.error(`Error loading Pokémon #${id}:`, error);
        }
    }
    
    const searchInput = document.getElementById("pokemonSearch");
    searchInput.addEventListener('input', (e) => {
        filterPokemon(e.target.value.toLowerCase());
    });
    
    console.log('Loaded all 1025 Pokémon!');
}

function filterByLetter(letter, button) {
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        allPokemonCards.forEach(card => card.classList.remove('hidden'));
        const container = document.getElementById("pokemonContainer");
        const noResults = container.querySelector('.no-results');
        if (noResults) noResults.remove();
        return;
    }
    
    document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    let hasPokemon = false;
    allPokemonCards.forEach(card => {
        const firstLetter = card.querySelector('.pokemon-name').textContent.charAt(0);
        if (firstLetter === letter) {
            card.classList.remove('hidden');
            hasPokemon = true;
        } else {
            card.classList.add('hidden');
        }
    });
    
    const container = document.getElementById("pokemonContainer");
    if (!hasPokemon) {
        container.innerHTML = '<div class="no-results">No Pokémon found</div>';
    }
}

function filterPokemon(searchTerm) {
    document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
    
    allPokemonCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        if (name.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
    
    const noResults = document.querySelector('.no-results');
    if (noResults) noResults.remove();
}

loadAllPokemon();
