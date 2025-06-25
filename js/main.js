import ui from "./ui.js"
import api from "./api.js"

const filmesSet = new Set();

async function adicionarChaveAoFilme() {
  try {
    const filmes = await api.buscarFilmes();
    filmes.forEach(filme => {
      const chaveFilme = 
      `${filme.nome.trim().toLowerCase()}-${filme.genero.trim().toLowerCase()}`;
      filmesSet.add(chaveFilme);
    });
  } catch (error) {
    alert("Erro ao adicionar chave ao filme");
  }
}

const regexNome = /^[A-Za-z0-9\s]+$/
const regexGenero = /^[\p{L}\s]+$/u

function validarNome(Nome) {
  return regexNome.test(Nome)
}

function validarGenero(genero) {
  return regexGenero.test(genero)
}

function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '')
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarFilmes()
  adicionarChaveAoFilme()

  const formularioFilme = document.getElementById("filme-form")
  const botaoCancelar = document.getElementById("botao-cancelar")
  const inputBuscaFilmes = document.getElementById("busca-filmes")

  formularioFilme.addEventListener("submit", manipularSubmissaoFormulario)
  botaoCancelar.addEventListener("click", manipularCancelamento)
  inputBuscaFilmes.addEventListener("input", manipularBuscaFilmes)
})

async function manipularSubmissaoFormulario(event) {
  event.preventDefault()
  const id = document.getElementById("filme-id").value
  const nome = document.getElementById("filme-nome").value
  const genero = document.getElementById("filme-genero").value
  const data = document.getElementById("filme-data").value

  const nomeSemEspacos = removerEspacos(nome)
  const generoSemEspacos = removerEspacos(genero)

  if (!nomeSemEspacos || !generoSemEspacos || !data) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!validarNome(nomeSemEspacos)) {
    alert("Nome inválido! O nome deve conter apenas letras, números e espaços.");
    nome.value = "";
    return;
  }

  if (!validarGenero(generoSemEspacos)) {
    alert("Gênero inválido! O gênero deve conter apenas letras.");
    genero.value = "";
    return;
  }

  if (!validarData(data)) {
    alert("Data inválida! A data deve ser igual ou anterior à data atual.");
    return;
  }

  const chaveNovoFilme = `${nome.trim().toLowerCase()}-${genero.trim().toLowerCase()}`;

  if(filmesSet.has(chaveNovoFilme)) {
    alert("Filme já cadastrado!");
    return;
  }

  try {
    if (id) {
      await api.editarFilme({ id, nome, genero, data })
    } else {
      await api.salvarFilme({ nome, genero, data })
    }
    ui.renderizarFilmes()
  } catch {
    alert("Erro ao salvar filme")
  }
}

function manipularCancelamento() {
  ui.limparFormulario()
}

async function manipularBuscaFilmes() {
  const termoPesquisado = document.getElementById("busca-filmes").value

  try {
    const filmes = await api.buscarFilmesPorTermo(termoPesquisado)
    ui.renderizarFilmes(filmes);
  } catch (error) {
    alert("Filme com este termo não encontrado!");
  }
}

function validarData(data) {
  const dataAtual = new Date();
  const dataInformada = new Date(data);
  return dataInformada <= dataAtual;
}