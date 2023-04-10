import { MonsterService } from "../../src/domain/services/monster";
import { MonsterRepository } from "../../src/domain/repositories/monster";
import { expect } from "chai";
import { MonsterData, MonsterFilter, Pagination, Sort } from "../../src/domain/dtos/monster";
import { ObjectId } from "mongoose/lib/types";

describe("Monster Service", () => {
  describe("Create Monster", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async create(input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data: MonsterData = {
        name: "pikachu",
        category: "pokemon listrik",
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: ["FLYING"],
      };
      const result = await monsterService.create(data);
      expect(result.error).to.be.false;
      expect(result.data).to.equal("SUCCESS");
    });

    it("Validation Field Name Empty", async () => {
      class MockRepository extends MonsterRepository {
        async create(input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: null,
        category: "pokemon listrik",
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: [],
      };
      const result = await monsterService.create(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("name is a required field");
    });

    it("Validation Field Category Empty", async () => {
      class MockRepository extends MonsterRepository {
        async create(input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: null,
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: [],
      };
      const result = await monsterService.create(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("category is a required field");
    });

    it("Validation Field Stats Empty", async () => {
      class MockRepository extends MonsterRepository {
        async create(input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: "pokemon listrik",
        description: "",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: null,
        isCatched: false,
        types: [],
      };
      const result = await monsterService.create(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("stats cannot be null");
    });
    it("Validation Field Type Null", async () => {
      class MockRepository extends MonsterRepository {
        async create(input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: "pokemon listrik",
        description: "",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: null,
      };
      const result = await monsterService.create(data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("Pick at least 1 Type");
    });
  });
  describe("Update Monster", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async update(id, input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data: MonsterData = {
        name: "pikachu",
        category: "pokemon listrik",
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: [],
      };
      const result = await monsterService.update(new ObjectId(), data);
      expect(result.error).to.be.false;
      expect(result.data).to.equal("Data Successfully Updated");
    });
    it("Validation Field Name Empty", async () => {
      class MockRepository extends MonsterRepository {
        async update(id, input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: null,
        category: "pokemon listrik",
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: [],
      };
      const result = await monsterService.update(new ObjectId(), data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("name is a required field");
    });

    it("Validation Field Category Empty", async () => {
      class MockRepository extends MonsterRepository {
        async update(id, input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: null,
        description: "pokemonnya listrik",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: [],
      };
      const result = await monsterService.update(new ObjectId(), data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("category is a required field");
    });

    it("Validation Field Stats Empty", async () => {
      class MockRepository extends MonsterRepository {
        async update(id, input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: "pokemon listrik",
        description: "",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: null,
        isCatched: false,
        types: [],
      };
      const result = await monsterService.update(new ObjectId(), data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("stats cannot be null");
    });
    it("Validation Field Type Null", async () => {
      class MockRepository extends MonsterRepository {
        async update(id, input) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const data = {
        name: "Pikachu",
        category: "pokemon listrik",
        description: "",
        imageUrl: "http://localhost:4000/weoijkwennlm.png",
        stats: {
          hp: 100,
          attack: 200,
          def: 250,
          speed: 300,
        },
        isCatched: false,
        types: null,
      };
      const result = await monsterService.update(new ObjectId(), data);
      expect(result.error).to.be.true;
      expect(result.message).to.equal("Pick at least 1 Type");
    });
  });

  describe("Delete Monster", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async delete(id) {
          return true;
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const result = await monsterService.delete(new ObjectId());
      expect(result.error).to.be.false;
      expect(result.data).to.equal("Data Successfully Deleted");
    });
  });

  describe("Get Monster By Id", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async getById(id) {
          return {
            stats: {
              speed: 0,
              hp: 100,
              attack: 150,
              def: 125,
            },
            _id: "63f6e7e152ead5e057b40eac",
            name: "Pikachu",
            category: "Pokemon Listrik edited",
            description: "Pokemon Listrik berwarna kuning nan lucu dan imut",
            types: ["ELECTRIC", "FLYING"],
            createdAt: "2023-02-23T04:13:21.250Z",
            updatedAt: "2023-02-24T00:09:16.701Z",
            __v: 0,
            isCatched: true,
          };
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const result = await monsterService.getById(new ObjectId());
      expect(result).to.be.an("object");
    });

    it("It Should Be Null", async () => {
      class MockRepository extends MonsterRepository {
        async getById(id) {
          return null
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const result = await monsterService.getById(new ObjectId());
      expect(result).to.be.null;
    });
  });

  describe("Get All Monster", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async getAll(filter, pagination, sort) {
          return [{
            stats: {
              speed: 0,
              hp: 100,
              attack: 150,
              def: 125,
            },
            _id: "63f6e7e152ead5e057b40eac",
            name: "Pikachu",
            category: "Pokemon Listrik edited",
            description: "Pokemon Listrik berwarna kuning nan lucu dan imut",
            types: ["ELECTRIC", "FLYING"],
            createdAt: "2023-02-23T04:13:21.250Z",
            updatedAt: "2023-02-24T00:09:16.701Z",
            __v: 0,
            isCatched: true,
          }];
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const filter:MonsterFilter = {
         name:"",
         types:[]
      }
      const pagination:Pagination = {
        limit: 10,
        page: 1
      }
      const sort:Sort = {
        id:'ASC',
        name:'ASC'
      }
      const result = await monsterService.getAll(filter, pagination, sort);
      expect(result).to.be.an("array");
      expect(result.length).to.equal
    });
  });

  describe("Capture Monster", () => {
    it("It Should Be Success", async () => {
      class MockRepository extends MonsterRepository {
        async capture(id) {
          return true
        }
      }
      const monsterRepository = new MockRepository();
      const monsterService = new MonsterService(monsterRepository);
      const result = await monsterService.capture(new ObjectId());
      expect(result.error).to.be.false
      expect(result.data).to.equal('Successfully Captured')
    });
  });
});
