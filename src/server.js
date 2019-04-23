const { pokemon, attacks, types } = require("./data");
const express = require("express");

const createServer = () => {
  const app = express();
  app.get("/api/pokemons", (req, res) => {
    const { limit } = req.query;
    if (limit) {
      const poke = [];
      for (let i = 0; i < limit; i++) {
        poke.push(pokemon[i]);
      }
      res.send(poke);
    } else {
      res.send(pokemon);
    }
  });
  app.use(express.json());

  app.post("/api/pokemons", (req, res) => {
    res.json(req.body);
  });

  app.get("/api/pokemons/:param", (req, res) => {
    const { param } = req.params;
    for (const poke of pokemon) {
      if (~~param > 1) {
        if (~~poke.id === ~~param) {
          res.send(poke);
        }
      } else if (poke.name.toLowerCase() === param.toLowerCase()) {
        res.send(poke);
      }
    }
  });

  app.use(express.json());
  app.patch("/api/pokemons/:idOrName", (req, res) => {
    const { idOrName } = req.params;
    const changeThisPokemon = req.body;
    // refactor necessary
    function modifyPokemon(pokemon) {
      pokemon[Object.keys(changeThisPokemon).toString()] = Object.values(
        changeThisPokemon
      ).toString();
      res.send(pokemon);
    }
    for (const poke of pokemon) {
      if (~~idOrName > 1) {
        if (~~poke.id === ~~idOrName) {
          modifyPokemon(poke);
        }
      } else if (poke.name.toLowerCase() === idOrName.toLowerCase()) {
        modifyPokemon(poke);
      }
    }
  });
  app.delete("/api/pokemons/:idOrName", (req, res) => {
    const { idOrName } = req.params;
    function modifyPokemon(index) {
      pokemon.splice(index, 1);
    }
    for (let i = 0; i < pokemon.length; i++) {
      if (~~idOrName > 0) {
        if (~~pokemon[i].id === ~~idOrName) {
          modifyPokemon(i);
        }
      } else if (pokemon[i].name.toLowerCase() === idOrName.toLowerCase()) {
        modifyPokemon(i);
      }
    }
    res.send(pokemon);
  });
  app.get("/api/pokemons/:idOrName/evolutions", (req, res) => {
    const { idOrName } = req.params;
    let evolutionArray = [];
    const findEvolutions = (index) => {
      evolutionArray = pokemon[index].evolutions;
    };
    for (let i = 0; i < pokemon.length; i++) {
      if (~~idOrName > 1) {
        if (~~pokemon[i].id === ~~idOrName) {
          findEvolutions(i);
          break;
        }
      } else if (pokemon[i].name.toLowerCase() === idOrName.toLowerCase()) {
        findEvolutions(i);
        break;
      }
    }
    res.send(evolutionArray);
  });
  app.get("/api/pokemons/:idOrName/evolutions/previous", (req, res) => {
    const { idOrName } = req.params;
    let previousArray = [];
    const findPrevious = (index) => {
      previousArray = pokemon[index]["Previous evolution(s)"];
    };
    for (let i = 0; i < pokemon.length; i++) {
      if (~~idOrName > 1) {
        if (~~pokemon[i].id === ~~idOrName) {
          findPrevious(i);
          break;
        }
      } else if (pokemon[i].name.toLowerCase() === idOrName.toLowerCase()) {
        findPrevious(i);
        break;
      }
    }
    res.send(previousArray);
  });
  app.get("/api/types", (req, res) => {
    const { limit } = req.query;
    if (limit) {
      const poke = [];
      for (let i = 0; i < limit; i++) {
        poke.push(types[i]);
      }
      res.send(poke);
    } else {
      res.send(types);
    }
  });
  app.use(express.json());
  app.post("/api/types", (req, res) => {
    types.push(req.body.type);
    res.send(types);
  });

  app.delete("/api/types", (req, res) => {
    const target = req.query;
    for (let i = 0; i < types.length; i++) {
      if (types[i] === target.type) {
        types.splice(i, 1);
      }
    }
    res.send(types);
  });
  app.get("/api/types/:type/pokemons", (req, res) => {
    const { type } = req.params;
    const array = [];
    const obj = {};
    for (const poke of pokemon) {
      if (poke.type === type) {
        obj.id = poke.id;
        obj.name = poke.name;
        array.push(obj);
      }
    }
    res.send(array);
  });
  app.get("/api/attacks/", (req, res) => {
    const { limit } = req.query;
    let array = [];
    if (!limit) {
      array = attacks;
    } else {
      for (let i = 0; i < limit; i++) {
        array.push(attacks.fast[i]);
      }
    }
    res.send(array);
  });
  app.get("/api/attacks/fast", (req, res) => {
    const { limit } = req.query;
    let fastAttacks = [];
    if (!limit) {
      fastAttacks = attacks.fast;
    } else {
      for (let i = 0; i < limit; i++) {
        fastAttacks.push(attacks.fast[i]);
      }
    }
    res.send(fastAttacks);
  });

  app.get("/api/attacks/special", (req, res) => {
    const { limit } = req.query;
    let array = [];
    if (!limit) {
      array = attacks.special;
    } else {
      for (let i = 0; i < limit; i++) {
        array.push(attacks.special[i]);
      }
    }
    res.send(array);
  });
  app.get("/api/attacks/:name", (req, res) => {
    const { name } = req.params;
    for (const type in attacks) {
      for (const attack of attacks[type]) {
        if (attack.name === name) {
          res.send(attack);
        }
      }
    }
  });

  return app;
};
module.exports = { createServer };
/**
 * Use this file to create and set up your express server
 */
