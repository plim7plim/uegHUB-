import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const profileCard = document.getElementById("profileCard");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));

    if (!snapshot.exists()) {
      profileCard.innerHTML = `
        <p class="card-description">Não encontramos seu perfil no Firestore.</p>
      `;
      return;
    }

    const perfil = snapshot.data();

    profileCard.innerHTML = `
      <div class="profile-top">
        <div>
          <span class="card-kicker">UEG // FEED</span>
          <h2 style="margin-top:8px;">${escapeHtml(perfil.nome || "Sem nome")}</h2>
        </div>
        <button type="button" class="logout-button" id="logoutButton">Sair</button>
      </div>

      <p class="card-description">
        ${escapeHtml(perfil.curso || "Curso não informado")}
        ${perfil.periodo ? ` • ${perfil.periodo}º período` : ""}
      </p>

      <p class="card-description">${escapeHtml(perfil.bio || "Sem bio ainda.")}</p>

      ${renderLinks(perfil)}

      ${renderTagSection("Tecnologias", perfil.tecnologias)}
      ${renderTagSection("Áreas de interesse", perfil.interesses)}
      ${renderTagSection("Hobbies", perfil.hobbies)}
      ${renderTagSection("Não curte", perfil.naoGosta)}
    `;

    document
      .getElementById("logoutButton")
      .addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
      });

  } catch (error) {
    console.error("🔥 ERRO FIREBASE:", error.code, error.message);

    profileCard.innerHTML = `
      <p class="card-description">Erro ao carregar seu perfil. Tente novamente.</p>
    `;
  }

});

function renderTagSection(titulo, lista) {

  if (!lista || lista.length === 0) {
    return `
      <div class="profile-section">
        <h3>${escapeHtml(titulo)}</h3>
        <span class="empty-tag">Nada por aqui ainda.</span>
      </div>
    `;
  }

  const tags = lista
    .map((item) => `<span class="tag">${escapeHtml(item)}</span>`)
    .join("");

  return `
    <div class="profile-section">
      <h3>${escapeHtml(titulo)}</h3>
      <div class="profile-tags">${tags}</div>
    </div>
  `;
}

function renderLinks(perfil) {

  const links = [];

  if (perfil.github) {
    links.push(`<a href="${escapeAttr(perfil.github)}" target="_blank" rel="noopener">GitHub</a>`);
  }

  if (perfil.linkedin) {
    links.push(`<a href="${escapeAttr(perfil.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  }

  if (links.length === 0) {
    return "";
  }

  return `<p class="card-description">${links.join(" • ")}</p>`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/"/g, "&quot;");
}