const pokeApi = {}

function convertPokeApiDetailToPokemon (pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const[type] = types 

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.height = (pokeDetail.height*0.10).toFixed(2)
    pokemon.weight = (pokeDetail.weight*0.10).toFixed(2)
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)

    const listMoves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name)
    function getRandomId() {
        const randomId = Math.floor(Math.random() * 5)
        return randomId
    }
    pokemon.moves = [listMoves[getRandomId()], listMoves[getRandomId()], listMoves[getRandomId()], listMoves[getRandomId()]]
   

    /*pokemon.baseStats = pokeDetail.stats.map(() => {
        for (let i = 0; i < pokeDetail.stats.length; i++) {
            const element = pokeDetail.stats[i];
            pokemon.baseStats += [element.stat.name, element.base_stat];
        }
        
        return pokemon.baseStats
    })
    pokemon.baseStats = pokeDetail.stats.map((statSlot) => {
        pokemon.baseStats += [statSlot.stat.name, statSlot.base_stat];
        pokemon.baseStats += {name: statSlot.stat.name, base: statSlot.base_stat};
        return pokemon.baseStats
    })*/

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then(response => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&&limit=${limit}`
    return fetch(url)
        .then(response => response.json())
        .then(jsonBody => jsonBody.results)
        .then(pokemons => pokemons.map(pokeApi.getPokemonDetail))
        .then(detailRequest => Promise.all(detailRequest))
        .then(pokemonDetails => pokemonDetails)
        .catch(error => console.log(error))
}