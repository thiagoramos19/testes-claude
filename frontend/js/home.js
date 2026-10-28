// Tela inicial: stories, publicar postagem, filtros e feed (UC08, UC09, UC10)

const NOMES_MIDIA = { IMAGEM: "Imagem", MUSICA: "Música", LIVRO: "Livro", ARQUIVO: "Arquivo" };
const ICONES_MIDIA = { IMAGEM: "imagem", MUSICA: "musica", LIVRO: "livro", ARQUIVO: "clipe" };

// Exemplos enquanto stories e eventos ainda nao tem endpoint
const stories = ["Ciclano Silva", "Thiago Ramos Ivo", "Beltrano Santos", "Fulano de Tal"];
const proximosEventos = [
    { nome: "Acende o Farol - Atlética ADM", data: "2026-12-03T18:00", local: "Campus Pasteur - CCH" },
    { nome: "Workshop de Prototipagem IHC", data: "2026-12-04T14:00", local: "CCET - Auditório" },
];

let postagens = [];
let filtroAtual = "TODOS";
let tipoMidia = "NENHUMA";

// Postagens que batem com o filtro escolhido
function postagensFiltradas() {
    if (filtroAtual === "TODOS") return postagens;
    if (filtroAtual === "EMPREGO") return postagens.filter((p) => /vaga|est[aá]gio|emprego|oportunidade/i.test(p.texto));
    return postagens.filter((p) => p.campusAutor === filtroAtual);
}

function cartaoPostagem(p) {
    const midia = NOMES_MIDIA[p.tipoMidia]
        ? `<span class="etiqueta etiqueta-midia">${icone(ICONES_MIDIA[p.tipoMidia])}${NOMES_MIDIA[p.tipoMidia]}</span>`
        : "";
    const imagem = p.imagemLocal ? `<img class="postagem-imagem" src="${p.imagemLocal}" alt="Imagem da postagem">` : "";
    const comentarios = (p.comentarios ?? []).map((c) => `
        <li>${avatar(c.nomeAutor, "avatar-mini")}<p><strong>${escapar(c.nomeAutor)}</strong> ${escapar(c.texto)}</p></li>
    `).join("");

    return `
        <article class="cartao postagem" data-id="${p.id}">
            <header class="postagem-autor">
                ${avatar(p.nomeAutor)}
                <div>
                    <h3>${escapar(p.nomeAutor)}</h3>
                    <p class="suave pequeno">${escapar(p.cursoAutor)} · ${escapar(p.campusAutor)} · ${tempoRelativo(p.dataHoraCriacao)}</p>
                </div>
            </header>
            ${p.texto ? `<p class="postagem-texto">${escapar(p.texto)}</p>` : ""}
            ${imagem}
            ${midia}
            <ul class="comentarios">${comentarios}</ul>
            <form class="comentar">
                <input class="entrada" name="comentario" placeholder="Escreva um comentário" maxlength="255" aria-label="Comentário">
                <button class="botao-icone" type="submit" aria-label="Enviar comentário">${icone("enviar")}</button>
            </form>
        </article>
    `;
}

function renderizarFeed() {
    const feed = document.getElementById("feed");
    const lista = postagensFiltradas();

    if (lista.length === 0) {
        // FE01 do UC08: nenhum post para o filtro
        feed.innerHTML = `
            <div class="aviso-vazio">
                <p>Não há publicações para esse filtro.</p>
                <button class="botao botao-secundario" type="button" id="limpar-filtro">Ver tudo</button>
            </div>`;
        document.getElementById("limpar-filtro").addEventListener("click", () => aplicarFiltro("TODOS"));
        return;
    }
    feed.innerHTML = lista.map(cartaoPostagem).join("");
}

function aplicarFiltro(filtro) {
    filtroAtual = filtro;
    document.querySelectorAll("#filtros .etiqueta").forEach((botao) => {
        botao.classList.toggle("ativo", botao.dataset.filtro === filtro);
    });
    renderizarFeed();
}

async function carregarFeed() {
    try {
        postagens = await api("/postagens");
        renderizarFeed();
    } catch {
        document.getElementById("feed").innerHTML =
            `<p class="aviso-vazio">Não foi possível carregar o feed. Confira se o back-end está ligado.</p>`;
    }
}

// ---------- Publicar postagem ----------

const formPostagem = document.getElementById("form-postagem");
const textoPostagem = document.getElementById("texto-postagem");
const previaImagem = document.getElementById("previa-imagem");

function escolherTipo(tipo) {
    tipoMidia = tipoMidia === tipo ? "NENHUMA" : tipo;
    document.querySelectorAll(".tipos-midia [data-tipo]").forEach((botao) => {
        botao.classList.toggle("ativo", botao.dataset.tipo === tipoMidia);
    });
}

document.querySelectorAll(".tipos-midia [data-tipo]").forEach((botao) => {
    botao.addEventListener("click", () => escolherTipo(botao.dataset.tipo));
});

document.getElementById("arquivo-imagem").addEventListener("change", (evento) => {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    previaImagem.src = URL.createObjectURL(arquivo);
    previaImagem.classList.remove("oculto");
    escolherTipo("IMAGEM");
});

formPostagem.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const texto = textoPostagem.value.trim();
    const temImagem = !previaImagem.classList.contains("oculto");

    // FE01 do UC09: nao publica postagem vazia
    if (!texto && !temImagem) {
        toast("Escreva algo ou anexe uma imagem para postar.");
        textoPostagem.focus();
        return;
    }

    try {
        const nova = await enviar("POST", "/postagens", { emailAutor: EU.email, texto, tipoMidia });
        // O banco nao guarda o arquivo da imagem; a previa fica so nesta tela
        if (temImagem) nova.imagemLocal = previaImagem.src;
        postagens.unshift(nova);
    } catch (erro) {
        toast(erro.message);
        return;
    }

    formPostagem.reset();
    previaImagem.classList.add("oculto");
    escolherTipo("NENHUMA");
    aplicarFiltro("TODOS");
    toast("Postagem publicada!");
});

// ---------- Comentarios ----------

document.getElementById("feed").addEventListener("submit", async (evento) => {
    if (!evento.target.matches(".comentar")) return;
    evento.preventDefault();
    const entrada = evento.target.comentario;
    const texto = entrada.value.trim();
    if (!texto) return;

    const id = Number(evento.target.closest(".postagem").dataset.id);
    try {
        await enviar("POST", `/postagens/${id}/comentarios`, { emailAutor: EU.email, texto });
    } catch (erro) {
        toast(erro.message);
        return;
    }
    const postagem = postagens.find((p) => p.id === id);
    postagem.comentarios = [...postagem.comentarios, { nomeAutor: EU.nome, texto }];
    renderizarFeed();
});

// ---------- Stories e eventos ----------

function renderizarLaterais() {
    const usuario = usuarioAtual();
    document.getElementById("avatar-story").outerHTML = avatar(usuario?.nome ?? usuario?.email ?? "Você", "avatar-story");
    document.getElementById("lista-stories").innerHTML = stories.map((nome) => `
        <button class="story" type="button">
            <span class="story-anel">${avatar(nome, "avatar-story")}</span>
            <span class="story-nome">${escapar(nome.split(" ")[0])}</span>
        </button>
    `).join("");

    document.getElementById("proximos-eventos").innerHTML = proximosEventos.map((e) => {
        const data = new Date(e.data);
        return `
            <li>
                <span class="data-evento"><strong>${data.getDate()}</strong>${data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
                <div><h3>${escapar(e.nome)}</h3><p class="suave pequeno">${escapar(e.local)}</p></div>
            </li>`;
    }).join("");
}

document.getElementById("novo-story").addEventListener("click", () => {
    toast("Publicar stories estará disponível em breve.");
});

document.querySelectorAll("#filtros .etiqueta").forEach((botao) => {
    botao.addEventListener("click", () => aplicarFiltro(botao.dataset.filtro));
});

renderizarLaterais();
carregarFeed();
