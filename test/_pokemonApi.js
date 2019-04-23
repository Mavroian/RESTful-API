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
  describe("GET /api/pokemon/:idOrName/evolutions/previous", () => {
    it("should return the previous evolutions a Pokemon has", async () => {
      const res = await request.get("/api/pokemons/134/evolutions/previous");
      const expect = [
        {
          id: 133,
          name: "Eevee",
        },
      ];
      JSON.parse(res.text).should.eql(expect);
    });
  });
  describe("GET /api/types", () => {
    it("It should return a list of all available types", async () => {
      const res = await request.get("/api/types");
      const expect = types;
      JSON.parse(res.text).should.eql(expect);
    });
    it("should b able to take a query parameter 'limit=n'", async () => {
      const res = await request.get("/api/types/").query({ limit: 5 });
      const fiveTypes = [];
      for (let i = 0; i < 5; i++) {
        fiveTypes.push(types[i]);
      }
      res.should.be.json;
      JSON.parse(res.text).should.eql(fiveTypes);
    });
  });
  describe("POST /api/types", () => {
    it("should add a Type", async () => {
      const obj = {
        type: "Butterfly",
      };
      const res = await request.post("/api/types/").send(obj);
      const expect = "Butterfly";
      JSON.parse(res.text)[JSON.parse(res.text).length - 1].should.eql(expect);
    });
  });
  describe("DELETE /api/types", () => {
    it("should delete a type", async () => {
      const res = await request
        .delete("/api/types/")
        .query({ type: "Butterfly" });
      const expect = "Dragon";
      JSON.parse(res.text).length.should.eql(17);
      JSON.parse(res.text)[JSON.parse(res.text).length - 1].should.eql(expect);
    });
  });
  describe("GET /api/types/:type/pokemons", () => {
    it("should return all Pokemon that are of a given type", async () => {
      const res = await request.get("/api/types/Flying/pokemons");
      const expect = [];
      const obj = {};
      for (const poke of pokemon) {
        if (poke.type === "Flying") {
          obj.id = poke.id;
          obj.name = poke.name;
          expect.push(obj);
        }
      }
      JSON.parse(res.text).should.eql(expect);
    });
  });
  describe("GET /api/attacks", () => {
    it("should return a list of all attacks ", async () => {
      const res = await request.get("/api/attacks");
      const expect = attacks;
      JSON.parse(res.text).should.eql(expect);
    });
    it("should be able to take a query parameter 'limit=n'", async () => {
      const res = await request.get("/api/attacks/").query({ limit: 5 });
      const fiveAttacks = [];

      for (let i = 0; i < 5; i++) {
        fiveAttacks.push(attacks.fast[i]);
      }

      res.should.be.json;
      JSON.parse(res.text).should.eql(fiveAttacks);
    });
  });
  describe("GET /api/attacks/fast", () => {
    it("should return a list of all fast attacks ", async () => {
      const res = await request.get("/api/attacks/fast");
      const expect = attacks.fast;
      JSON.parse(res.text).should.eql(expect);
    });
    it("should be able to take a query parameter 'limit=n'", async () => {
      const res = await request.get("/api/attacks/fast").query({ limit: 5 });
      const fiveAttacks = [];
      for (let i = 0; i < 5; i++) {
        fiveAttacks.push(attacks.fast[i]);
      }
      res.should.be.json;
      JSON.parse(res.text).should.eql(fiveAttacks);
    });
  });
  describe("GET /api/attacks/special", () => {
    it("should return a list of all special attacks ", async () => {
      const res = await request.get("/api/attacks/special");
      const expect = attacks.special;
      JSON.parse(res.text).should.eql(expect);
    });
    it("should be able to take a query parameter 'limit=n'", async () => {
      const res = await request.get("/api/attacks/special").query({ limit: 5 });
      const fiveAttacks = [];
      for (let i = 0; i < 5; i++) {
        fiveAttacks.push(attacks.special[i]);
      }
      res.should.be.json;
      JSON.parse(res.text).should.eql(fiveAttacks);
    });
  });
  describe("GET /api/attacks/:name", () => {
    it("should get a specific attack by name, if it is fast", async () => {
      const res = await request.get("/api/attacks/Psycho Cut");
      const expectFast = {
        name: "Psycho Cut",
        type: "Psychic",
        damage: 7,
      };
      JSON.parse(res.text).should.eql(expectFast);
    });
    it("should get a specific attack by name, if it is special", async () => {
      const res2 = await request.get("/api/attacks/Power Whip");
      const expectSpecial = {
        name: "Power Whip",
        type: "Grass",
        damage: 70,
      };
      JSON.parse(res2.text).should.eql(expectSpecial);
    });
  });
  describe("GET /api/attacks/:name/pokemon", () => {
    it("should returns all Pokemon (id and name) that have an attack with the given name", async () => {
      const res = await request.get("/api/attacks/Psycho Cut/pokemon");
      const arry = [];
      const expect = pokemon.filter((poke) => {
        for (const key in poke.attacks) {
          for (const type of poke.attacks[key]) {
            if (type.name === "Zen Headbutt") arry.push(poke);
          }
        }
      });
      console.log(arry);
    });
  });
});
