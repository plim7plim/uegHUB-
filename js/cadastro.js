import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const form = document.getElementById("registerForm");

const steps = [...document.querySelectorAll(".step")];

const nextButtons = [...document.querySelectorAll(".next-button")];

const prevButtons = [...document.querySelectorAll(".prev-button")];

const stepLabel = document.getElementById("stepLabel");

const progressPercent =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");


const nome = document.getElementById("nome");

const email =
    document.getElementById("emailCadastro");

const senha =
    document.getElementById("senhaCadastro");

const curso =
    document.getElementById("curso");

const periodo =
    document.getElementById("periodo");

const bio =
    document.getElementById("bio");

const github =
    document.getElementById("github");

const linkedin =
    document.getElementById("linkedin");

const message =
    document.getElementById("registerMessage");

const submitText =
    document.getElementById("submitText");


let currentStep = 1;


// ========================================
// ATUALIZAR ETAPA
// ========================================

function updateStep() {

    steps.forEach((step) => {

        step.classList.toggle(
            "active",
            Number(step.dataset.step) === currentStep
        );

    });


    const percent =
        Math.round((currentStep / 3) * 100);


    stepLabel.textContent =
        `ETAPA ${currentStep} DE 3`;

    progressPercent.textContent =
        `${percent}%`;

    progressBar.style.width =
        `${percent}%`;

    message.textContent = "";

}


// ========================================
// VALIDAÇÃO
// ========================================

function validateStep(step) {

    if (step === 1) {

        if (!nome.value.trim()) {

            showError("Digite seu nome.");

            nome.focus();

            return false;
        }


        if (!email.checkValidity()) {

            showError("Digite um e-mail válido.");

            email.focus();

            return false;
        }


        if (senha.value.length < 6) {

            showError(
                "A senha precisa ter pelo menos 6 caracteres."
            );

            senha.focus();

            return false;
        }

    }


    if (step === 2) {

        if (!curso.value) {

            showError("Selecione seu curso.");

            curso.focus();

            return false;
        }


        if (!periodo.value) {

            showError("Selecione seu período.");

            periodo.focus();

            return false;
        }

    }


    return true;
}


// ========================================
// ERRO
// ========================================

function showError(text) {

    message.classList.remove(
        "success-message"
    );

    message.textContent = text;

}


// ========================================
// BOTÃO PRÓXIMO
// ========================================

nextButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if (!validateStep(currentStep)) {
            return;
        }


        currentStep++;

        updateStep();

    });

});


// ========================================
// BOTÃO VOLTAR
// ========================================

prevButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if (currentStep > 1) {

            currentStep--;

            updateStep();

        }

    });

});


// ========================================
// ESCOLHAS
// ========================================

document
    .querySelectorAll(".choice")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                button.classList.toggle(
                    "selected"
                );

            }
        );

    });


// ========================================
// PEGAR ESCOLHAS
// ========================================

function getSelectedValues(containerId) {

    return [
        ...document.querySelectorAll(
            `#${containerId} .choice.selected`
        )
    ].map(
        (button) => button.dataset.value
    );

}


// ========================================
// CONTADOR DA BIO
// ========================================

bio.addEventListener("input", () => {

    document.getElementById(
        "bioCount"
    ).textContent = bio.value.length;

});


// ========================================
// MOSTRAR SENHA
// ========================================

document
    .getElementById("toggleRegisterPassword")
    .addEventListener("click", (event) => {

        const showing =
            senha.type === "text";


        senha.type =
            showing
                ? "password"
                : "text";


        event.currentTarget.textContent =
            showing
                ? "◉"
                : "◌";


        event.currentTarget.setAttribute(
            "aria-label",
            showing
                ? "Mostrar senha"
                : "Ocultar senha"
        );

    });


// ========================================
// CADASTRO
// ========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!validateStep(3)) {
            return;
        }


        // Pega as escolhas
        const tecnologias =
            getSelectedValues(
                "technologies"
            );


        const interesses =
            getSelectedValues(
                "interests"
            );


        const hobbies =
            getSelectedValues(
                "hobbies"
            );


        const naoGosta =
            getSelectedValues(
                "dislikes"
            );


        message.textContent = "";

        submitText.textContent =
            "Criando...";


        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        submitButton.disabled = true;


        try {

            // ====================================
            // 1. CRIAR USUÁRIO NO AUTHENTICATION
            // ====================================

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email.value.trim(),
                    senha.value
                );


            const user =
                credential.user;


            console.log(
                "✅ Usuário criado:",
                user.uid
            );


            // ====================================
            // 2. CRIAR PERFIL NO FIRESTORE
            // ====================================

            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {

                    nome:
                        nome.value.trim(),

                    email:
                        user.email,

                    curso:
                        curso.value,

                    periodo:
                        Number(periodo.value),

                    bio:
                        bio.value.trim(),

                    github:
                        github.value.trim(),

                    linkedin:
                        linkedin.value.trim(),

                    fotoUrl:
                        "",

                    interesses:
                        interesses,

                    tecnologias:
                        tecnologias,

                    hobbies:
                        hobbies,

                    naoGosta:
                        naoGosta,

                    criadoEm:
                        serverTimestamp()

                }
            );


            console.log(
                "✅ Perfil salvo no Firestore!"
            );


            // ====================================
            // SUCESSO
            // ====================================

            message.classList.add(
                "success-message"
            );


            message.textContent =
                "Perfil criado com sucesso! 🚀";


            submitText.textContent =
                "Perfil criado";


            console.log("⏳ Redirecionando em 1s...");

            setTimeout(() => {

                console.log("➡️ Executando redirect agora");

                window.location.href = "feed.html";

            }, 1000);


        } catch (error) {

            // ====================================
            // ERRO
            // ====================================

            console.error(
                "🔥 ERRO FIREBASE:",
                error
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "Mensagem:",
                error.message
            );


            submitButton.disabled =
                false;


            submitText.textContent =
                "Criar meu perfil 🚀";


            message.classList.remove(
                "success-message"
            );


            message.textContent =
                `${error.code || "erro"} — ${error.message || "Erro desconhecido"}`;

        }

    }
);
updateStep();