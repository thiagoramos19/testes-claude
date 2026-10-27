// Tela de login (UC02)

const formLogin = document.getElementById("form-login");

formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    limparErros(formLogin);

    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    let valido = true;

    if (!email.value.trim().endsWith("@edu.unirio.br")) {
        marcarErro(email, "Email fora do formato @edu.unirio.br");
        valido = false;
    }
    if (!senha.value) {
        marcarErro(senha, "Digite sua senha");
        valido = false;
    }
    if (!valido) return;

    // A conferencia da senha no banco entra quando o endpoint de login existir (31/10)
    salvarUsuario({ email: email.value.trim() });
    location.href = "home.html";
});
