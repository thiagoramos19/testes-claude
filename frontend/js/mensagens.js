// Mensagens privadas e Unibot (UC04)

const UNIBOT = "Unibot";
const RESPOSTAS_UNIBOT = {
    1: "Cardápio do bandejão hoje: arroz, feijão, frango assado, salada de alface e tomate. Opção vegetariana: escondidinho de legumes.",
    2: "Horário de aulas (BSI, 4º período): seg e qua 18h-22h · ter 18h-20h · qui 20h-22h.",
};
const MENU_UNIBOT = "Oi! Eu sou o Unibot. Digite 1 para ver o cardápio do bandejão ou 2 para ver o horário de aulas.";

// Exemplos enquanto o endpoint de mensagens nao existe
const conversas = [
    {
        amigo: "Amanda Brandes",
        mensagens: [
            { minha: true, texto: "Oi Amanda, ajustei as telas de protótipo do Unilink!", hora: "19:50" },
            { minha: false, texto: "Perfeito Thiago! Vou atualizar o relatório técnico com as capturas.", hora: "19:55" },
        ],
    },
    { amigo: "Ciclano Silva", mensagens: [{ minha: false, texto: "Bora estudar pra P1?", hora: "12:21" }] },
    { amigo: UNIBOT, mensagens: [{ minha: false, texto: MENU_UNIBOT, hora: "" }] },
];
let conversaAberta = null;

const horaAgora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function avatarConversa(nome) {
    return nome === UNIBOT ? `<span class="avatar tom-2" aria-hidden="true">${icone("robo")}</span>` : avatar(nome);
}

function renderizarLista() {
    document.getElementById("lista-conversas").innerHTML = conversas.map((c, i) => {
        const ultima = c.mensagens[c.mensagens.length - 1];
        return `
            <li>
                <button class="cartao item-lista ${c === conversaAberta ? "ativo" : ""}" type="button" data-indice="${i}">
                    ${avatarConversa(c.amigo)}
                    <span class="item-texto">
                        <strong>${escapar(c.amigo)}</strong>
                        <span class="suave pequeno uma-linha">${ultima.minha ? "Você: " : ""}${escapar(ultima.texto)}</span>
                    </span>
                    <span class="suave pequeno">${ultima.hora}</span>
                </button>
            </li>`;
    }).join("");
}

function renderizarChat() {
    const c = conversaAberta;
    const baloes = c.mensagens.map((m) => `
        <li class="balao ${m.minha ? "meu" : ""}">${escapar(m.texto)}<span>${m.hora}</span></li>
    `).join("");

    document.getElementById("chat").innerHTML = `
        <div class="cartao chat">
            <header class="chat-topo">
                <button class="botao-icone so-celular" type="button" id="voltar-lista" aria-label="Voltar para conversas">${icone("voltar")}</button>
                ${avatarConversa(c.amigo)}
                <h2>${escapar(c.amigo)}</h2>
            </header>
            <ol class="chat-mensagens" id="chat-mensagens">${baloes}</ol>
            <form class="chat-enviar" id="form-mensagem">
                <input class="entrada" id="texto-mensagem" placeholder="Digite uma mensagem" autocomplete="off" aria-label="Mensagem">
                <button class="botao-icone botao-enviar" type="submit" aria-label="Enviar">${icone("enviar")}</button>
            </form>
        </div>`;

    const lista = document.getElementById("chat-mensagens");
    lista.scrollTop = lista.scrollHeight;

    document.getElementById("form-mensagem").addEventListener("submit", enviarMensagem);
    document.getElementById("voltar-lista").addEventListener("click", () => {
        document.getElementById("mensagens").classList.remove("mostrando-detalhe");
    });
    document.getElementById("texto-mensagem").focus();
}

function enviarMensagem(evento) {
    evento.preventDefault();
    const texto = document.getElementById("texto-mensagem").value.trim();
    // FE01: mensagem em branco e ignorada
    if (!texto) return;

    // A gravacao na tabela mensagem entra na semana 2
    conversaAberta.mensagens.push({ minha: true, texto, hora: horaAgora() });
    if (conversaAberta.amigo === UNIBOT) {
        conversaAberta.mensagens.push({ minha: false, texto: RESPOSTAS_UNIBOT[texto] ?? MENU_UNIBOT, hora: horaAgora() });
    }
    renderizarLista();
    renderizarChat();
}

document.getElementById("lista-conversas").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-indice]");
    if (!botao) return;
    conversaAberta = conversas[Number(botao.dataset.indice)];
    document.getElementById("mensagens").classList.add("mostrando-detalhe");
    renderizarLista();
    renderizarChat();
});

renderizarLista();
