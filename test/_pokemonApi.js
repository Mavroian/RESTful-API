const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { createServer } = require("../src/server");
chai.should();
const { pokemon, attacks, types } = require("../src/data/index");
const expect = require("chai").expect;
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
      let expected;
      for (const poke of pokemon) {
        if (poke.id === "042") {
          expected = poke;
        }
      }
      JSON.parse(res.text).should.eql(expected);
    });
  });
  describe("GET /api/pokemons/:name", () => {
    it("It should return the Pokemon with given name.", async () => {
      let expected = 0;
      for (const poke of pokemon) {
        if (poke.name === "Mew") {
          expected = poke;
        }
      }
      const res = await request.get("/api/pokemons/Mew");
      res.should.be.json;
      JSON.parse(res.text).should.eql(expected);
    });
  });
  describe("PATCH /api/pokemons/:idOrName", () => {
    it("should make partial modifications to a Pokemon", async () => {
      const res = await request
        .patch("/api/pokemons/Mew")
        .send({ name: "Meeeeeew" });
      const expected = { name: "Meeeeeew" };
      const pokemonUpdated = JSON.parse(res.text);
      pokemonUpdated.name.should.eql(expected.name);
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
      const expected = [
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
      JSON.parse(res.text).should.eql(expected);
    });
  });
  describe("GET /api/pokemon/:idOrName/evolutions/previous", () => {
    it("should return the previous evolutions a Pokemon has", async () => {
      const res = await request.get("/api/pokemons/134/evolutions/previous");
      const expected = [
        {
          id: 133,
          name: "Eevee",
        },
      ];
      JSON.parse(res.text).should.eql(expected);
    });
  });
  describe("GET /api/types", () => {
    it("It should return a list of all available types", async () => {
      const res = await request.get("/api/types");
      const expected = types;
      JSON.parse(res.text).should.eql(expected);
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
      const expected = "Butterfly";
      JSON.parse(res.text)[JSON.parse(res.text).length - 1].should.eql(
        expected
      );
    });
  });
  describe("DELETE /api/types", () => {
    it("should delete a type", async () => {
      const res = await request
        .delete("/api/types/")
        .query({ type: "Butterfly" });
      const expected = "Dragon";
      JSON.parse(res.text).length.should.eql(17);
      JSON.parse(res.text)[JSON.parse(res.text).length - 1].should.eql(
        expected
      );
    });
  });
  describe("GET /api/types/:type/pokemons", () => {
    it("should return all Pokemon that are of a given type", async () => {
      const res = await request.get("/api/types/Flying/pokemons");
      const expected = [];
      const obj = {};
      for (const poke of pokemon) {
        if (poke.type === "Flying") {
          obj.id = poke.id;
          obj.name = poke.name;
          expected.push(obj);
        }
      }
      JSON.parse(res.text).should.eql(expected);
    });
  });
  describe("GET /api/attacks", () => {
    it("should return a list of all attacks ", async () => {
      const res = await request.get("/api/attacks");
      const expected = attacks;
      JSON.parse(res.text).should.eql(expected);
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
      const expected = attacks.fast;
      JSON.parse(res.text).should.eql(expected);
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
      const expected = attacks.special;
      JSON.parse(res.text).should.eql(expected);
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
    it("should return all Pokemon (id and name) that have an attack with the given name", async () => {
      const res = await request.get("/api/attacks/Psycho Cut/pokemon");
      const arry = [];
      const expected = {};

      for (const key in pokemon.attacks) {
        for (const type of pokemon.attacks[key]) {
          if (type.name === "Zen Headbutt") {
            expected.name = pokemon.name;
            expected.id = pokemon.id;
            arry.push(expected);
          }
        }
      }
      JSON.parse(res.text).should.eql(expected);
    });
  });

  describe("`POST /api/attacks/fast` or `POST /api/attacks/special`", () => {
    it("Add a fast attack", async () => {
      const fakeObj = {
        name: "Back Stab",
        type: "Steel",
        damage: 50,
      };
      const res = await request.post("/api/attacks/fast").send(fakeObj);

      attacks.fast.push(fakeObj);

      JSON.parse(res.text).should.eql(attacks.fast[attacks.fast.length - 1]);
    });
    it("Add a special attack", async () => {
      const fakeObj = {
        name: "Lightning Strike",
        type: "Nature",
        damage: 100,
      };
      const res = await request.post("/api/attacks/special").send(fakeObj);

      attacks.special.push(fakeObj);

      JSON.parse(res.text).should.eql(
        attacks.special[attacks.special.length - 1]
      );
    });
  });
  describe("PATCH /api/attacks/:name", () => {
    it("should modifies specified attack", async () => {
      const fakeObj = {
        name: "Love Bomb",
        type: "Normal",
        damage: 40,
      };
      const res = await request.patch("/api/attacks/Seed Bomb").send(fakeObj);
      for (const type in attacks) {
        for (const attack of attacks[type]) {
          if (attack.name === "Seed Bomb") {
            Object.assign(attack, fakeObj);
          }
        }
      }
      JSON.parse(res.text).should.eql(fakeObj);
    });
  });
  describe("DELETE /api/attacyardks/:name", () => {
    it("should delete an attack", async () => {
      let expected = 0;
      for (const type in attacks) {
        for (let i = 0; i < attacks[type].length; i++) {
          if (attacks[type][i].name === "Power Whip") {
            expected = attacks[type][i];
          }
        }
      }

      const res = await request.delete("/api/attacks/Power Whip");
      expect(attacks.special[0].name).to.eql("Love Bomb");
      JSON.parse(res.text).should.eql(expected);
    });
  });
});
