const express  = require("express");
const cors     = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // Rota que lista todos os repositórios;
  const retornoRep = repositories;
  return response.send(retornoRep);
  // should be able to list the repositories
});

app.post("/repositories", (request, response) => {
  /**
   * A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o github desse
   * repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato:
   *  { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 };
   * certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
   */
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }
  repositories.push(repository);
  return response.json(repository);
  // should be able to create a new repository
});

app.put("/repositories/:id", (request, response) => {
/**
 * A rota deve alterar apenas o título, a url e as techs do repositório que
 * possua o id igual ao id presente nos parâmetros da rota;
 * não esquece de passar os likes antigos
 */
const { id }                = request.params;
const { title, url, techs } = request.body;
const repoIndex = repositories.findIndex(repository => repository.id === id);

if(repoIndex < 0){
  return response.status(400).json({
    error: "Specified repository does not exist."
  })
}
const oldLikes = repositories[repoIndex].likes;
const myRepo = {
  id,
  title,
  url,
  techs,
  likes: oldLikes
};

repositories[repoIndex] = myRepo;
return response.json(myRepo);
// should be able to update repository AND he HAS to exist.
});

app.delete("/repositories/:id", (request, response) => {
  // autoexplicativo
  const { id }    = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0){
    return response.status(400).json({
      error: "Specified repository does not exist."
    })
  };

  repositories.splice(repoIndex, 1);
  return response.status(204).send();  
});

app.post("/repositories/:id/like", (request, response) => {
  // teste não está esperando retorno algum, mas é sempre bom retornar algo
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if(!repository){
    return response.status(400).json({
      error: `No repository found with id [${id}]`
    })
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
