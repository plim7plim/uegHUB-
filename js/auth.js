/*
 * UEG Hub - Authentication
 *
 * Login conectado ao Firebase Authentication.
 */

import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

const submitButton = loginForm.querySelector('button[type="submit"]');
const submitTextEl = submitButton.querySelector("span");
const submitTextOriginal = submitTextEl.textContent;

togglePassword.addEventListener("click", () => {
  const showing = passwordInput.type === "text";

  passwordInput.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "◉" : "◌";
  togglePassword.setAttribute(
    "aria-label",
    showing ? "Mostrar senha" : "Ocultar senha"
  );
});

forgotPassword.addEventListener("click", async (event) => {
  event.preventDefault();

  loginMessage.classList.remove("success-message");
  loginMessage.textContent = "";

  const email = emailInput.value.trim();

  if (!email) {
    loginMessage.textContent = "Digite seu e-mail para recuperar a senha.";
    emailInput.focus();
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);

    loginMessage.classList.add("success-message");
    loginMessage.textContent =
      "Enviamos um e-mail com as instruções para redefinir sua senha.";
  } catch (error) {
    console.error("🔥 ERRO FIREBASE:", error.code, error.message);

    loginMessage.classList.remove("success-message");
    loginMessage.textContent = mensagemDeErro(error.code);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.classList.remove("success-message");
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

  submitButton.disabled = true;
  submitTextEl.textContent = "Entrando...";

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    console.log("✅ Login realizado:", credential.user.uid);

    loginMessage.classList.add("success-message");
    loginMessage.textContent = "Login realizado! Redirecionando...";

    setTimeout(() => {
      window.location.href = "feed.html";
    }, 800);
  } catch (error) {
    console.error("🔥 ERRO FIREBASE:", error.code, error.message);

    submitButton.disabled = false;
    submitTextEl.textContent = submitTextOriginal;

    loginMessage.classList.remove("success-message");
    loginMessage.textContent = mensagemDeErro(error.code);
  }
});

function mensagemDeErro(codigo) {
  switch (codigo) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-disabled":
      return "Essa conta foi desativada.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/wrong-password":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    default:
      return "Não foi possível entrar. Tente novamente.";
  }
}