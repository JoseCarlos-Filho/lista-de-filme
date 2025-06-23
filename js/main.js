import ui from "./ui.js"
import api from "./api.js"

const regexConteudo = /^[A-Za-z\s]{10,}$/

function validarConteudo(conteudo) {
  return regexConteudo.test(conteudo)
}

document.addEventListener("DOMContentLoaded", () => {
  ui.renderizarFilmes()

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

  if (!validarConteudo(nome) || !validarConteudo(genero)) {
    alert("Nome e gênero devem conter pelo menos 10 caracteres alfabéticos.");
    nome.value = "";
    genero.value = "";
    return;
  }

  if (!validarData(data)) {
    alert("Data inválida! A data deve ser igual ou anterior à data atual.");
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