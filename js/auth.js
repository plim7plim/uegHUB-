/*
 * UEG Hub - Authentication
 *
 * O Firebase será conectado aqui no próximo passo.
 * Por enquanto, este arquivo só controla a interface do login.
 */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";

  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "◉" : "◌";
  togglePassword.setAttribute(
    "aria-label",
    showing ? "Mostrar senha" : "Ocultar senha"
  );
});

forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();

  loginMessage.textContent =
    "A recuperação de senha será conectada ao Firebase no próximo passo.";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginMessage.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    loginMessage.textContent = "Preencha seu e-mail e sua senha.";
    return;
  }

  if (password.length < 6) {
    loginMessage.textContent = "A senha precisa ter pelo menos 6 caracteres.";
    return;
  }

  loginMessage.textContent =
    "Interface pronta. Agora vamos conectar este formulário ao Firebase.";
});
