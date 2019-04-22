const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { createServer } = require("../src/server");
chai.should();
const { pokemon, attacks, types } = require("../src/data/index");
/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = createServer();
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });
  describe("GET /api/pokemons", () => {
    it("should return the full list of Pokemon", async () => {
      const res = await request.get("/api/pokemons");
      res.should.be.json;
      JSON.parse(res.text).should.deep.equal(pokemon);
    });
    it("should b able to take a query parameter 'limit=n'", async () => {
      const res = await request.get("/api/pokemons/").query({ limit: 5 });
      const fivePokemons = [];
      for (let i = 0; i < 5; i++) {
        fivePokemons.push(pokemon[i]);
      }
      res.should.be.json;
      JSON.parse(res.text).should.eql(fivePokemons);
    });
  });
  describe("POST /api/pokemons", () => {
    it("should add a Pokemon.", async () => {
      const poke = pokemon[0];
      const res = await request.post("/api/pokemons").send(poke);
      console.log(res.text);
      JSON.parse(res.text).should.eql(poke);
    });
  });
  describe("GET /api/pokemons/:id", () => {
    it("should return the Pokemon with the given id.", async () => {
      const res = await request.get("/api/pokemons/42");
      res.should.be.json;
      let expect;
      for (const poke of pokemon) {
        if (poke.id === "042") {
          expect = poke;
        }
      }
      JSON.parse(res.text).should.eql(expect);
    });
  });
  describe("GET /api/pokemons/:name", () => {
    it("It should return the Pokemon with given name.", async () => {
      let expect = 0;
      for (const poke of pokemon) {
        if (poke.name === "Mew") {
          expect = poke;
        }
      }
      const res = await request.get("/api/pokemons/Mew");
      res.should.be.json;
      JSON.parse(res.text).should.eql(expect);
    });
  });
  describe("PATCH /api/pokemons/:idOrName", () => {
    it("should make partial modifications to a Pokemon", async () => {
      const res = await request
        .patch("/api/pokemons/Mew")
        .send({ name: "Meeeeeew" });
      const expect = { name: "Meeeeeew" };
      const pokemonUpdated = JSON.parse(res.text);
      pokemonUpdated.name.should.eql(expect.name);
    });
  });
  describe("DELETE /api/pokemons/:idOrName", () => {
    it("should delete the given Pokemon", async () => {
      const res = await request.delete("/api/pokemons/150"); // MewTwo
      const arrayPokemon = JSON.parse(res.text);
      const pokemon148 = arrayPokemon[148].id;
      const pokemon149 = arrayPokemon[149].id;
      pokemon148.should.eql("149");
      pokemon149.should.eql("151");

      // const res = await request.delete("/api/pokemons/Mew");
      // JSON.parse(res.text).should.be.undefined;
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions", () => {
    it("should return the evolutions a Pokemon has", async () => {
      const res = await request.get("/api/pokemons/133/evolutions"); // MewTwo
      const expect = [
        {
          id: 134,
          name: "Vaporeon",
        },
        {
          id: 135,
          name: "Jolteon",
        },
        {
          id: 136,
          name: "Flareon",
        },
      ];
      JSON.parse(res.text).should.eql(expect);
    });
  });
});
