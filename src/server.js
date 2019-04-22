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
  app.patch("");

  return app;
};
module.exports = { createServer };
/**
 * Use this file to create and set up your express server
 */
