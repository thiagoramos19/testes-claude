// Cards de descobrir e adicionar amigo (UC03)

// Exemplos da carga inicial enquanto o endpoint de perfis nao existe
const perfis = [
    {
        nome: "Ciclano Silva", idade: 21, curso: "Biblioteconomia", campus: "CCH",
        gostos: "Organizar livros por cor, Cultura pop depressiva, Memes intelectuais",
        frase: "Leio tudo que vejo pela frente, inclusive entrelinhas de mensagens de bom dia.",
        mood: "Disposto a recomendar um livro pra cada pessoa que der match.",
        funfact: "Já li a biblioteca inteira do CCH",
    },
    {
        nome: "Fulano de Tal", idade: 23, curso: "Matemática", campus: "CCET",
        gostos: "Cálculo e seus desafios, Sair à noite, Cuidar de planta",
        frase: "Minha vida é 80% concreto e 20% desespero.",
        mood: "Procurando alguém para me ajudar a entender Estatística.",
        funfact: "Sei de cor os primeiros 50 dígitos do Pi",
    },
    {
        nome: "Beltrano Santos", idade: 22, curso: "História", campus: "CCH",
        gostos: "Avaliar filmes no Letterboxd, Música indie underground, Networking",
        frase: "Otimizando minha vida pessoal com a mesma eficiência de uma planilha.",
        mood: "Ansioso para o próximo churrasco da atlética.",
        funfact: "Assisto filmes antigos em velocidade 1.5x",
    },
    {
        nome: "Amanda Brandes", idade: 23, curso: "Sistemas de Informação", campus: "CCET",
        gostos: "Design IHC, Café expresso, Maratona de séries",
        frase: "A simplicidade é o último grau da sofisticação.",
        mood: "Animada para os testes heurísticos",
        funfact: "Tenho uma coleção de cadernos de prototipação",
    },
];

const TAMANHO_MAO = 3;
let mao = [];
let selecionada = null;
let virada = false;

function embaralhar() {
    mao = [...perfis].sort(() => Math.random() - 0.5).slice(0, TAMANHO_MAO);
    selecionada = mao[0] ?? null;
    virada = false;
    renderizar();
}

function frenteCarta(p) {
    return `
        <div class="carta-face carta-frente">
            ${avatar(p.nome, "avatar-grande")}
            <h2>${escapar(p.nome)}, ${p.idade}</h2>
            <p class="suave">${escapar(p.curso)}</p>
            <span class="etiqueta">${icone("local")}${escapar(p.campus)}</span>
        </div>`;
}

function versoCarta(p) {
    const gostos = p.gostos.split(",").map((g) => `<li>${escapar(g.trim())}</li>`).join("");
    return `
        <div class="carta-face carta-verso">
            <h3>Três coisas que amo</h3>
            <ul class="lista-pontos">${gostos}</ul>
            <h3>Sobre mim</h3>
            <p>“${escapar(p.frase)}”</p>
            <h3>Mood atual</h3>
            <p>${escapar(p.mood)}</p>
            <h3>Fun fact / red flag</h3>
            <p>${escapar(p.funfact)}</p>
        </div>`;
}

function renderizar() {
    const palco = document.getElementById("palco");
    const areaMao = document.getElementById("mao");

    // FE01: acabaram os perfis
    if (!selecionada) {
        palco.innerHTML = `<div class="aviso-vazio cartao"><p>Não há mais cartas disponíveis por enquanto.</p></div>`;
        areaMao.innerHTML = "";
        return;
    }

    palco.innerHTML = `
        <div class="carta ${virada ? "virada" : ""}">
            ${frenteCarta(selecionada)}
            ${versoCarta(selecionada)}
        </div>
        <div class="palco-acoes">
            <button class="botao botao-contorno" type="button" id="virar">${virada ? "Ver a frente" : "Virar a carta"}</button>
            <button class="botao" type="button" id="adicionar">${icone("adicionar-amigo")}Adicionar amigo</button>
        </div>`;

    areaMao.innerHTML = mao.map((p, i) => `
        <button class="mini-carta ${p === selecionada ? "ativo" : ""}" type="button" role="option"
                aria-selected="${p === selecionada}" data-indice="${i}">
            ${avatar(p.nome)}
            <span>${escapar(p.nome.split(" ")[0])}</span>
        </button>`).join("");

    document.getElementById("virar").addEventListener("click", () => {
        virada = !virada;
        renderizar();
    });
    document.getElementById("adicionar").addEventListener("click", adicionarAmigo);
}

function adicionarAmigo() {
    // O pedido de amizade no banco (solicitacao_amizade) entra na semana 2
    toast(`Você adicionou ${selecionada.nome.split(" ")[0]} aos amigos, entre no Chat para conversar!`);
    perfis.splice(perfis.indexOf(selecionada), 1);
    mao.splice(mao.indexOf(selecionada), 1);
    selecionada = mao[0] ?? null;
    virada = false;
    renderizar();
}

document.getElementById("mao").addEventListener("click", (evento) => {
    const botao = evento.target.closest(".mini-carta");
    if (!botao) return;
    const escolhida = mao[Number(botao.dataset.indice)];
    // FA02: clicar de novo na carta aberta "abaixa" ela
    virada = escolhida === selecionada ? !virada : false;
    selecionada = escolhida;
    renderizar();
});

document.getElementById("embaralhar").addEventListener("click", embaralhar);

embaralhar();
