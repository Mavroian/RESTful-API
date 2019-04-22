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
      if (~~idOrName > 1) {
        if (~~pokemon[i].id === ~~idOrName) {
          modifyPokemon(i);
        }
      } else if (pokemon[i].name.toLowerCase() === idOrName.toLowerCase()) {
        modifyPokemon(i);
      }
    }
    res.send(pokemon);
  });

  return app;
};
module.exports = { createServer };
/**
 * Use this file to create and set up your express server
 */
