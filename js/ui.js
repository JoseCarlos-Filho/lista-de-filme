import api from "./api.js"

const ui = {

  async preencherFormulario(filmeId) {
    const filme = await api.buscarFilmePorId(filmeId)
    document.getElementById("filme-id").value = filme.id
    document.getElementById("filme-nome").value = filme.nome
    document.getElementById("filme-genero").value = filme.genero
  },

  limparFormulario() {
    document.getElementById("filme-form").reset()
  },

  async renderizarFilmes(filmesFiltrados) {
    const listaFilmes = document.getElementById("lista-filmes")
    listaFilmes.innerHTML = ""
  
    try {
      let filmesParaRenderizar

      if (filmesFiltrados) {
        filmesParaRenderizar = filmesFiltrados
      } else {
        filmesParaRenderizar = await api.buscarFilmes()
      }
      
      filmesParaRenderizar.forEach(ui.adicionarFilmeNaLista)
    } catch {
      alert('Erro ao renderizar filmes')
    }
  },

  adicionarFilmeNaLista(filme) {
    const listaFilmes = document.getElementById("lista-filmes")
    const li = document.createElement("li")
    li.setAttribute("data-id", filme.id)
    li.classList.add("li-filme")

    const filmeNome = document.createElement("div")
    filmeNome.textContent = filme.nome
    filmeNome.classList.add("filme-nome")

    const filmeGenero = document.createElement("div")
    filmeGenero.textContent = filme.genero
    filmeGenero.classList.add("filme-genero")

    const botaoEditar = document.createElement("button")
    botaoEditar.classList.add("botao-editar")
    botaoEditar.onclick = () => ui.preencherFormulario(filme.id)

    const iconeEditar = document.createElement("img")
    iconeEditar.src = "assets/imagens/icone-editar.png"
    iconeEditar.alt = "Editar"
    botaoEditar.appendChild(iconeEditar)

    const botaoExcluir = document.createElement("button")
    botaoExcluir.classList.add("botao-excluir")
    botaoExcluir.onclick = async () => {
      try {
        await api.excluirFilme(filme.id)
        ui.renderizarFilmes()
      } catch (error) {
        alert("Erro ao excluir filme")
        throw error
      }
    }

    const iconeExcluir = document.createElement("img")
    iconeExcluir.src = "assets/imagens/icone-excluir.png"
    iconeExcluir.alt = "Excluir"
    botaoExcluir.appendChild(iconeExcluir)

    const botaoFavorito = document.createElement("button")
    botaoFavorito.classList.add("botao-favorito");
    botaoFavorito.onclick = async () => {
      try {
        filme.favorito = !filme.favorito
        await api.atualizarFavorito(filme.id, filme.favorito)
        ui.renderizarFilmes()
      } catch (error) {
        alert("Erro ao atualizar favorito")
        throw error
      }
    }
    
    const iconeFavorito = document.createElement("img")
    iconeFavorito.src = filme.favorito ?
      "assets/imagens/icone-favorito.png"
      : "assets/imagens/icone-favorito_outline.png"

    iconeFavorito.alt = "icone de favorito"
    botaoFavorito.appendChild(iconeFavorito)

    const icones = document.createElement("div")
    icones.classList.add("icones")
    icones.appendChild(botaoEditar)
    icones.appendChild(botaoExcluir)
    icones.appendChild(botaoFavorito)

    li.appendChild(filmeNome)
    li.appendChild(filmeGenero)
    li.appendChild(icones)
    listaFilmes.appendChild(li)
  }
}

export default ui
