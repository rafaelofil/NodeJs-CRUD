const { request, response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());
const uuid = require('uuid');

let funcionarios = [
  {
    id: uuid.v4(),
    nome: 'Rafael',
    função: 'Analista Júnior',
    departamento: 'TI',
    email: 'rafael@email.com',
    telefone: '(24) 99913-2131',
  },
  {
    id: uuid.v4(),
    nome: 'Thaís',
    função: 'Front-end Sénior',
    departamento: 'TI',
    email: 'thais@email.com',
    telefone: '(24) 99915-6042',
  },
];

const checkIdArray = (request, response, next) => {
  const { id } = request.params;
  const funcionario = funcionarios.filter((funçao) => funçao.id === id);
  if (funcionario.length === 0) {
    return response.status(400).json({ Error: 'Id Inexistente.' });
  }
  return next();
};

const checkRegister = (request, response, next) => {
  const { nome, funçao, departamento, email, telefone } = request.body;
  if (!nome || !funçao || !departamento || !email || !telefone) {
    return response
      .status(400)
      .json({ Error: 'Algum campo não foi preenchido.' });
  }
  return next();
};

app.post('/funcionarios', checkRegister, (request, response) => {
  const { nome, funçao, departamento, email, telefone } = request.body;
  const dadosFuncionario = {
    id: uuid.v4(),
    nome,
    funçao,
    departamento,
    email,
    telefone,
  };
  funcionarios = [...funcionarios, dadosFuncionario];
  return response.status(200).json(dadosFuncionario);
});

app.get('/funcionarios', (request, response) => {
  return response.status(200).json(funcionarios);
});

app.get('/funcionarios/:id', checkIdArray, (request, response) => {
  const { id } = request.params;
  const funcionario = funcionarios.filter((funçao) => funçao.id === id);
  return response.status(200).json(funcionario);
});

app.delete('/funcionarios/:id', checkIdArray, (request, response) => {
  const { id } = request.params;
  const indice = funcionarios.findIndex((funçao) => funçao.id === id);
  funcionarios.splice(indice, 1);
  return response
    .status(200)
    .json({ message: 'Registro excluído com sucesso!' });
});

app.put(
  '/funcionarios/:id',
  checkIdArray,
  checkRegister,
  (request, response) => {
    const { nome, funçao, departamento, email, telefone } = request.body;
    const { id } = request.params;
    let indice = funcionarios.findIndex((funçao) => funçao.id === id);
    const dadosFuncionario = {
      id: uuid.v4(),
      nome,
      funçao,
      departamento,
      email,
      telefone,
    };

    funcionarios.splice(indice, 1, dadosFuncionario);
    return response.status(200).json(dadosFuncionario);
  },
);

app.listen(3000, () => {
  console.log('Servidor Rodando!');
});
