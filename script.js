// ================================
// Chat IA - OdontoCare
// ================================

const chat = document.getElementById("chat");
const messages = document.getElementById("messages");
const input = document.getElementById("message");
const send = document.getElementById("send");

let history = [];

function toggleChat() {
    chat.classList.toggle("hidden");
    if (!chat.classList.contains("hidden")) {
        input.focus();
    }
}

function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {

    messages.innerHTML += `
    <div class="flex justify-end">

        <div class="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] shadow">

            ${text}

        </div>

    </div>`;

    scrollBottom();
}

function addBotMessage(text) {

    messages.innerHTML += `
    <div class="flex">

        <div class="bg-white rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] shadow">

            <div class="flex items-center gap-2 mb-2">

                <i class="bi bi-robot text-blue-600"></i>

                <strong>Assistente IA</strong>

            </div>

            ${text}

        </div>

    </div>`;

    scrollBottom();
}

function showTyping() {

    messages.innerHTML += `
    <div id="typing" class="flex">

        <div class="bg-white rounded-2xl px-4 py-3 shadow">

            <div class="flex gap-1">

                <span class="animate-pulse">•</span>
                <span class="animate-pulse">•</span>
                <span class="animate-pulse">•</span>

            </div>

        </div>

    </div>`;

    scrollBottom();
}

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing)
        typing.remove();

}

async function askAI(text) {

    showTyping();

    history.push({
        role: "user",
        content: text
    });

    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                messages: history

            })

        });

        const data = await response.json();

        removeTyping();

        addBotMessage(data.reply);

        history.push({
            role: "assistant",
            content: data.reply
        });

    }

    catch (e) {

        removeTyping();

        addBotMessage("Não foi possível conectar ao assistente.");

    }

}

async function sendMessage() {

    const text = input.value.trim();

    if (!text)
        return;

    addUserMessage(text);

    input.value = "";

    askAI(text);

}

send.onclick = sendMessage;

input.addEventListener("keypress", e => {

    if (e.key === "Enter")
        sendMessage();

});

document.querySelectorAll(".quick").forEach(btn => {

    btn.onclick = () => {

        input.value = btn.innerText;

        sendMessage();

    };

});