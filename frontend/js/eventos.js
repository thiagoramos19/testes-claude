// Agenda de eventos e confirmar presenca (UC06)

// Exemplos da carga inicial enquanto o endpoint de eventos nao existe
const eventos = [
    {
        id: 1, nome: "Acende o Farol - Atlética ADM", data: "2026-12-03T18:00", campus: "CCH",
        local: "Campus Pasteur - CCH", confirmados: 123, banner: "img/evento-acende-o-farol.jpg",
        descricao: "Festa da Atlética de Administração com pulseiras de cores: verde para solteiros, amarelo para enrolados e vermelho para comprometidos.",
    },
    {
        id: 2, nome: "Workshop de Prototipagem IHC", data: "2026-12-04T14:00", campus: "CCET",
        local: "CCET - Auditório", confirmados: 43, banner: null,
        descricao: "Oficina prática de wireframes e protótipos navegáveis para quem cursa Interação Humano-Computador.",
    },
    {
        id: 3, nome: "Semana de Integração dos Calouros", data: "2026-10-05T10:00", campus: "CCET",
        local: "CCET - Pátio", confirmados: 210, banner: null,
        descricao: "Recepção dos calouros com gincana, tour pelo campus e conversa com os centros acadêmicos.",
    },
];

const confirmados = new Set();
let eventoAberto = null;

const formatarData = (data) => new Date(data).toLocaleString("pt-BR", {
    weekday: "short", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
});
const jaPassou = (evento) => new Date(evento.data) < new Date();

function eventosFiltrados() {
    const mes = document.getElementById("filtro-mes").value;
    const campus = document.getElementById("filtro-campus").value;
    return eventos
        .filter((e) => !mes || new Date(e.data).getMonth() + 1 === Number(mes))
        .filter((e) => !campus || e.campus === campus)
        // Proximos primeiro; os que ja passaram vao para o fim da lista
        .sort((a, b) => jaPassou(a) - jaPassou(b) || new Date(a.data) - new Date(b.data));
}

function renderizarLista() {
    const lista = eventosFiltrados();
    document.getElementById("lista-eventos").innerHTML = lista.length
        ? lista.map((e) => {
            const data = new Date(e.data);
            return `
                <li>
                    <button class="cartao item-lista ${e === eventoAberto ? "ativo" : ""}" type="button" data-id="${e.id}">
                        <span class="data-evento"><strong>${data.getDate()}</strong>${data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</span>
                        <span class="item-texto">
                            <strong>${escapar(e.nome)}</strong>
                            <span class="suave pequeno">${escapar(e.local)}${jaPassou(e) ? " · encerrado" : ""}</span>
                        </span>
                    </button>
                </li>`;
        }).join("")
        : `<li class="aviso-vazio">Nenhum evento com esses filtros.</li>`;
}

function renderizarDetalhe() {
    const e = eventoAberto;
    const confirmei = confirmados.has(e.id);

    // FE01: evento que ja passou nao aceita confirmacao
    let acao = `<button class="botao botao-largo" type="button" id="confirmar">Confirmar presença</button>`;
    if (confirmei) acao = `<p class="confirmado">${icone("certo")}Presença confirmada! Aproveite!</p>`;
    if (jaPassou(e)) acao = `<p class="encerrado">Evento encerrado</p>`;

    document.getElementById("detalhe-evento").innerHTML = `
        <button class="botao botao-contorno so-celular" type="button" id="voltar-lista">${icone("voltar")}Eventos</button>
        <article class="cartao detalhe">
            ${e.banner ? `<img class="banner" src="${e.banner}" alt="Cartaz do evento ${escapar(e.nome)}">` : ""}
            <h2>${escapar(e.nome)}</h2>
            <ul class="detalhe-info">
                <li>${icone("relogio")}${formatarData(e.data)}</li>
                <li>${icone("local")}${escapar(e.local)}</li>
            </ul>
            <p>${escapar(e.descricao)}</p>
            <p class="contagem"><strong>${e.confirmados + (confirmei ? 1 : 0)}</strong> confirmaram presença</p>
            ${acao}
            <button class="botao botao-secundario botao-largo" type="button" id="ver-mapa">${icone("local")}Como chegar?</button>
        </article>`;

    document.getElementById("confirmar")?.addEventListener("click", () => {
        // A gravacao em presenca_evento entra na semana 2
        confirmados.add(e.id);
        renderizarDetalhe();
    });
    document.getElementById("ver-mapa").addEventListener("click", () => {
        document.getElementById("mapa-local").textContent = e.local;
        document.getElementById("janela-mapa").showModal();
    });
    document.getElementById("voltar-lista").addEventListener("click", () => {
        document.getElementById("eventos").classList.remove("mostrando-detalhe");
    });
}

document.getElementById("lista-eventos").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-id]");
    if (!botao) return;
    eventoAberto = eventos.find((e) => e.id === Number(botao.dataset.id));
    document.getElementById("eventos").classList.add("mostrando-detalhe");
    renderizarLista();
    renderizarDetalhe();
});

document.getElementById("filtro-mes").addEventListener("change", renderizarLista);
document.getElementById("filtro-campus").addEventListener("change", renderizarLista);

renderizarLista();
