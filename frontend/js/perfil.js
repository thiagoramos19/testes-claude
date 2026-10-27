// Seu perfil e editar biografia (UC07)

// Exemplo da carga inicial enquanto o endpoint de perfil nao existe
const usuario = usuarioAtual();
const perfil = {
    nome: usuario?.nome ?? "Thiago Ramos Ivo",
    curso: "Sistemas de Informação",
    campus: "CCET",
    amigos: 2,
    eventos: 1,
    gostos: "Desenvolver interfaces, Jogar futebol, Ouvir podcasts",
    frase: "Código limpo é a alma do negócio.",
    mood: "Focado nas entregas do PI2",
    funfact: "Consigo codar ouvindo música instrumental por 8h seguidas",
};

const CAMPOS_BIO = [
    { chave: "gostos", rotulo: "Três coisas que amo" },
    { chave: "frase", rotulo: "Uma frase que me define" },
    { chave: "mood", rotulo: "Mood atual" },
    { chave: "funfact", rotulo: "Fun fact / red flag" },
];

const formBio = document.getElementById("form-bio");
const leitura = document.getElementById("bio-leitura");
const botaoEditar = document.getElementById("editar-bio");

function renderizarPerfil() {
    document.getElementById("perfil-avatar").innerHTML = avatar(perfil.nome, "avatar-grande");
    document.getElementById("perfil-nome").textContent = perfil.nome;
    document.getElementById("perfil-curso").textContent = `${perfil.curso} · ${perfil.campus}`;
    document.getElementById("qtd-amigos").textContent = perfil.amigos;
    document.getElementById("qtd-eventos").textContent = perfil.eventos;
    leitura.innerHTML = CAMPOS_BIO.map(({ chave, rotulo }) => `
        <dt>${rotulo}</dt>
        <dd>${perfil[chave] ? escapar(perfil[chave]) : '<span class="suave">Ainda não preenchido</span>'}</dd>
    `).join("");
}

function modoEdicao(editando) {
    formBio.classList.toggle("oculto", !editando);
    leitura.classList.toggle("oculto", editando);
    botaoEditar.classList.toggle("oculto", editando);
}

botaoEditar.addEventListener("click", () => {
    CAMPOS_BIO.forEach(({ chave }) => {
        const entrada = document.getElementById(`bio-${chave}`);
        entrada.value = perfil[chave];
        entrada.dispatchEvent(new Event("input"));
    });
    modoEdicao(true);
});

// FA01: voltar descarta o que foi digitado
document.getElementById("cancelar-bio").addEventListener("click", () => modoEdicao(false));

formBio.addEventListener("submit", (evento) => {
    evento.preventDefault();
    // A gravacao na tabela perfil entra na semana 2
    CAMPOS_BIO.forEach(({ chave }) => {
        perfil[chave] = document.getElementById(`bio-${chave}`).value.trim();
    });
    renderizarPerfil();
    modoEdicao(false);
    toast("Perfil atualizado com sucesso!");
});

document.getElementById("sair").addEventListener("click", sair);

renderizarPerfil();
