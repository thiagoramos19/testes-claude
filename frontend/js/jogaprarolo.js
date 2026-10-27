// Joga pra Rolo: anunciar (UC11) e comprar com Pix simulado (UC05)

// Exemplos da carga inicial enquanto o endpoint de produtos nao existe
const produtos = [
    { id: 1, titulo: "Livro de História Contemporânea - Usado", preco: 35, vendedor: "Beltrano Santos", status: "DISPONÍVEL" },
    { id: 2, titulo: "Calculadora Científica Casio FX-82MS", preco: 50, vendedor: "Ciclano Silva", status: "RESERVADO" },
    { id: 3, titulo: "Memória RAM 8GB DDR4", preco: 120, vendedor: "Fulano de Tal", status: "DISPONÍVEL" },
];
const pedidos = [];
let abaAtual = "ofertas";
let produtoEmCompra = null;

const reais = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function itemProduto(p, comoPedido) {
    let acao = `<button class="botao" type="button" data-comprar="${p.id}">Comprar</button>`;
    if (p.status !== "DISPONÍVEL") acao = `<span class="etiqueta">${p.status === "VENDIDO" ? "Vendido" : "Reservado"}</span>`;
    if (p.meu) acao = `<span class="etiqueta">Seu anúncio</span>`;
    if (comoPedido) acao = `<a class="botao botao-secundario" href="mensagens.html">${icone("mensagem")}Conversar</a>`;

    return `
        <li class="cartao produto">
            ${avatar(p.vendedor)}
            <div class="item-texto">
                <strong>${escapar(p.titulo)}</strong>
                <span class="suave pequeno">${escapar(p.vendedor)}</span>
            </div>
            <div class="produto-acao">
                <span class="preco">${reais(p.preco)}</span>
                ${acao}
            </div>
        </li>`;
}

function renderizarLista() {
    const lista = abaAtual === "ofertas" ? produtos : pedidos;
    const vazio = abaAtual === "ofertas" ? "Nenhuma oferta no momento." : "Você ainda não comprou nenhum produto.";
    document.getElementById("lista-produtos").innerHTML = lista.length
        ? lista.map((p) => itemProduto(p, abaAtual === "pedidos")).join("")
        : `<li class="aviso-vazio">${vazio}</li>`;
}

// FA01: alternar entre Ofertas e Meus pedidos
document.querySelectorAll(".abas .etiqueta").forEach((aba) => {
    aba.addEventListener("click", () => {
        abaAtual = aba.dataset.aba;
        document.querySelectorAll(".abas .etiqueta").forEach((a) => {
            a.classList.toggle("ativo", a === aba);
            a.setAttribute("aria-selected", a === aba);
        });
        renderizarLista();
    });
});

// ---------- Comprar ----------

const janelaPix = document.getElementById("janela-pix");

document.getElementById("lista-produtos").addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-comprar]");
    if (!botao) return;
    produtoEmCompra = produtos.find((p) => p.id === Number(botao.dataset.comprar));
    produtoEmCompra.status = "RESERVADO";
    document.getElementById("pix-resumo").textContent = `${produtoEmCompra.titulo} · ${reais(produtoEmCompra.preco)}`;
    document.getElementById("pix-codigo").value =
        `00020126unilink.pix${produtoEmCompra.id}5204000053039865406${produtoEmCompra.preco.toFixed(2)}`;
    renderizarLista();
    janelaPix.showModal();
});

// FE01: desistir devolve o produto para Disponivel
function cancelarCompra() {
    if (!produtoEmCompra) return;
    produtoEmCompra.status = "DISPONÍVEL";
    produtoEmCompra = null;
    renderizarLista();
}

document.getElementById("pix-voltar").addEventListener("click", () => janelaPix.close());
janelaPix.addEventListener("close", cancelarCompra);

document.getElementById("pix-concluir").addEventListener("click", () => {
    // A reserva no banco (status e fk_email_reserva) entra na semana 2
    pedidos.unshift(produtoEmCompra);
    toast(`Seu pedido foi processado, converse com ${produtoEmCompra.vendedor.split(" ")[0]}!`);
    produtoEmCompra = null;
    janelaPix.close();
    document.querySelector('[data-aba="pedidos"]').click();
});

// ---------- Anunciar ----------

const formOferta = document.getElementById("form-oferta");

formOferta.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparErros(formOferta);
    const titulo = document.getElementById("titulo");
    const preco = document.getElementById("preco");
    const valor = Number(preco.value.replace(",", "."));
    let ok = true;

    if (!titulo.value.trim()) {
        marcarErro(titulo, "Descreva o produto");
        ok = false;
    }
    if (!preco.value.trim() || Number.isNaN(valor) || valor < 0) {
        marcarErro(preco, "Digite um preço válido, ex.: 25,00");
        ok = false;
    }
    if (!ok) return;

    const usuario = usuarioAtual();
    produtos.unshift({
        id: Date.now(),
        titulo: titulo.value.trim(),
        preco: valor,
        vendedor: usuario?.nome ?? usuario?.email ?? "Você",
        status: "DISPONÍVEL",
        meu: true,
    });
    formOferta.reset();
    document.querySelector('[data-aba="ofertas"]').click();
    toast("Oferta criada!");
});

renderizarLista();
