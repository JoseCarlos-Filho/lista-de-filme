import ui from "./ui.js"
import api from "./api.js"

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

  try {
    if (id) {
      await api.editarFilme({ id, nome, genero })
    } else {
      await api.salvarFilme({ nome, genero })
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