/* Local portfolio chatbot for Jomarie Tijada */
(function () {
    const script = document.currentScript;
    const scriptUrl = script ? new URL(script.src, window.location.href) : new URL('assets/js/chat-widget.js', window.location.href);
    const assetBase = scriptUrl.href.replace(/assets\/js\/chat-widget\.js(?:\?.*)?$/, 'assets/');
    const portraitUrl = `${assetBase}images/jom.png`;

    const fallbackKnowledge = {
        profile: {
            name: 'Jomarie Tijada',
            fullName: 'Jomarie Salvio Tijada',
            course: 'BS Computer Science',
            school: 'University of Northern Philippines',
            interests: ['software development', 'AI', 'data analytics', 'web development', 'practical systems'],
            careerGoal: 'to grow as a developer or AI specialist who builds practical, reliable systems that solve real problems'
        },
        projects: [],
        skills: {
            frontend: ['HTML', 'CSS', 'JavaScript', 'React'],
            backend: ['Laravel', 'PHP', 'MySQL'],
            programming: ['Java', 'Python'],
            mobileAndCloud: ['Flutter', 'Firebase'],
            aiData: ['basic AI/ML', 'data analytics']
        },
        experience: ['I build practical academic and portfolio projects while continuing to improve my software development skills.'],
        resume: 'You can download my resume here: <a href="https://drive.google.com/uc?export=download&id=1yYtOe_4uG_el-X6jZbMgWulfy1LGEGqv" download target="_blank" rel="noopener noreferrer" class="font-semibold underline">Download here</a>.',
        contact: 'You can email me at <a href="mailto:jomsalvio@gmail.com" class="font-semibold underline">jomsalvio@gmail.com</a>. You can also use the contact section on this portfolio for the most accurate way to reach me.'
    };

    const knowledge = window.JomarieChatbotKnowledge || fallbackKnowledge;
    const suggestions = [
        { label: '👋 About me', prompt: 'Who are you?' },
        { label: '🧰 Skills', prompt: 'What are your skills?' },
        { label: '🚀 Projects', prompt: 'Tell me about your projects.' },
        { label: '📄 Resume', prompt: 'Do you have a resume?' },
        { label: '💬 Contact', prompt: 'How can I contact you?' },
        { label: '🎯 Career goal', prompt: 'What is your career goal?' }
    ];

    const followUps = [
        'You can also ask me about my projects, skills, resume, or contact info. ✨',
        'Want a quick shortcut? Try asking about my best project or tech stack. 🚀',
        'I can also share my resume, background, or how to contact me. 😊',
        'Feel free to ask for project highlights, education, or career goals too. 💡'
    ];

    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalize(message) {
        return message.toLowerCase().replace(/[^a-z0-9+#\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function hasAny(text, words) {
        return words.some((word) => {
            if (word.length <= 2 && /^[a-z0-9+#]+$/.test(word)) {
                return new RegExp(`(^|\\s)${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(text);
            }

            return text.includes(word);
        });
    }

    function formatList(items) {
        return items.join(', ');
    }

    function pick(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function withFollowUp(message) {
        return `${message}<br><br><span class="chat-follow-up">${pick(followUps)}</span>`;
    }

    function projectList() {
        return knowledge.projects.map((project) => `${project.name}: ${project.summary}`).join('<br><br>');
    }

    function bestProjectResponse() {
        const voteProject = knowledge.projects.find((project) => /vote/i.test(project.name));
        const project = voteProject || knowledge.projects[0];

        if (!project) {
            return 'One of my strongest project areas is building practical systems with clear workflows, useful interfaces, and real problem-solving value.';
        }

        return `One project I would highlight is ${project.name}. ${project.summary} I like it because it combines practical functionality with technologies I want to keep improving.`;
    }

    function getResponse(rawMessage) {
        const text = normalize(rawMessage);

        if (!text) {
            return pick([
                'Type a question and I will answer based on my portfolio. 😊',
                'Ask me anything about Jomarie, like skills, projects, resume, or contact info. 💬',
                'I am ready when you are. Try asking about projects or tech stack. ✨'
            ]);
        }

        if (hasAny(text, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return pick([
                `Hi there! 👋 I'm ${knowledge.profile.name}, a ${knowledge.profile.course} student at ${knowledge.profile.school}. I focus on software development, AI, data analytics, web development, and practical systems.`,
                `Hello! 😊 I'm ${knowledge.profile.name}. I enjoy building practical systems and learning more about AI, data analytics, and web development.`,
                `Hey! 👋 I can help you explore Jomarie's background, skills, projects, resume, and contact details.`
            ]);
        }

        if (hasAny(text, ['thank', 'thanks', 'appreciate'])) {
            return pick([
                'You are very welcome! 😊 Feel free to ask about my skills, projects, education, resume, or contact info.',
                'Anytime! ✨ I can also help you check my best projects or tech stack.',
                'Glad to help! 🙌 Ask me anything else about the portfolio.'
            ]);
        }

        if (hasAny(text, ['resume', 'cv', 'download'])) {
            return pick([
                `Sure! 📄 ${knowledge.resume}`,
                `Yes, my resume is available here: ${knowledge.resume}`,
                `Absolutely. You can grab my resume from this link: ${knowledge.resume}`
            ]);
        }

        if (hasAny(text, ['contact', 'email', 'message', 'hire', 'reach', 'call', 'phone'])) {
            return pick([
                `You can reach me here. 💬 ${knowledge.contact}`,
                `Sure! For contact details: ${knowledge.contact}`,
                `I'd be happy to connect. 😊 ${knowledge.contact}`
            ]);
        }

        if (hasAny(text, ['ai', 'machine learning', 'ml', 'data', 'analytics', 'mask detector', 'therapist'])) {
            return pick([
                'Yes! 🤖 I have experience with basic AI/ML and data-related work. My AI-related projects include an AI Therapist Chatbot and a Mask Detector, and I want to keep growing in AI and data analytics.',
                'AI and data are areas I am really interested in. 📊 I have worked on projects like an AI Therapist Chatbot and a Mask Detector.',
                'Definitely. ✨ I have explored AI/ML through practical projects, especially chatbot concepts, computer vision, and data-focused work.'
            ]);
        }

        if (hasAny(text, ['project', 'portfolio', 'built', 'system', 'app'])) {
            if (hasAny(text, ['best', 'favorite', 'strongest', 'highlight'])) {
                return pick([
                    `🚀 ${bestProjectResponse()}`,
                    `One standout project is this: ${bestProjectResponse()}`,
                    `If I had to highlight one, I would say: ${bestProjectResponse()}`
                ]);
            }

            return pick([
                `Here are some of my projects 🚀<br><br>${projectList()}`,
                `Sure! These are the main projects in my portfolio ✨<br><br>${projectList()}`,
                `I have worked on several practical systems. Here is a quick list 💻<br><br>${projectList()}`
            ]);
        }

        if (hasAny(text, ['who are you', 'about you', 'about me', 'introduce', 'your background', 'profile'])) {
            return pick([
                `I'm ${knowledge.profile.fullName}, a ${knowledge.profile.course} student at ${knowledge.profile.school}. 👋 I enjoy building practical systems and learning technologies related to ${formatList(knowledge.profile.interests)}.`,
                `About me? 😊 I'm ${knowledge.profile.fullName}. I study ${knowledge.profile.course} at ${knowledge.profile.school}, and I like turning ideas into useful systems.`,
                `I'm ${knowledge.profile.name}, a Computer Science student who enjoys software development, AI, data analytics, and web projects. 💻`
            ]);
        }

        if (hasAny(text, ['course', 'school', 'education', 'college', 'university', 'study', 'student'])) {
            return pick([
                `I am taking ${knowledge.profile.course} at ${knowledge.profile.school}. 🎓 My education supports my interest in software development, AI, data analytics, and practical system design.`,
                `I study ${knowledge.profile.course} at ${knowledge.profile.school}. 📚 It gives me a strong base for building real software projects.`,
                `Education-wise, I am a ${knowledge.profile.course} student at ${knowledge.profile.school}. 🎓`
            ]);
        }

        if (hasAny(text, ['skill', 'stack', 'technology', 'technologies', 'programming language', 'tools'])) {
            return pick([
                `My skills include ${formatList(knowledge.skills.frontend)} for frontend work; ${formatList(knowledge.skills.backend)} for backend/database work; ${formatList(knowledge.skills.programming)} for programming; ${formatList(knowledge.skills.mobileAndCloud)} for mobile and cloud-backed apps; and ${formatList(knowledge.skills.aiData)}. 🧰`,
                `Tech stack snapshot 💻 Frontend: ${formatList(knowledge.skills.frontend)}. Backend/database: ${formatList(knowledge.skills.backend)}. Programming: ${formatList(knowledge.skills.programming)}. Mobile/cloud: ${formatList(knowledge.skills.mobileAndCloud)}. AI/data: ${formatList(knowledge.skills.aiData)}.`,
                `I work with a mix of web, backend, mobile, and AI/data tools: ${formatList([...knowledge.skills.frontend, ...knowledge.skills.backend, ...knowledge.skills.programming, ...knowledge.skills.mobileAndCloud, ...knowledge.skills.aiData])}. ✨`
            ]);
        }

        if (hasAny(text, ['experience', 'work', 'ojt', 'internship', 'background'])) {
            return pick([
                `Here is a quick overview of my experience 💼<br><br>${knowledge.experience.join('<br><br>')}`,
                `My experience is mostly hands-on and project-based so far. ✨<br><br>${knowledge.experience.join('<br><br>')}`,
                `I have been building through academic and personal projects. 💻<br><br>${knowledge.experience.join('<br><br>')}`
            ]);
        }

        if (hasAny(text, ['goal', 'career', 'future', 'aspiration', 'plan'])) {
            return pick([
                `My career goal is ${knowledge.profile.careerGoal}. 🎯 I want to keep improving through real projects and become useful in development or AI-focused roles.`,
                `Career-wise, I want ${knowledge.profile.careerGoal}. 🚀 Practical projects are how I keep getting better.`,
                `My plan is to keep growing as a developer, especially in practical software and AI-related work. 🎯`
            ]);
        }

        return withFollowUp(pick([
            'I am not fully sure about that yet, but I can answer portfolio-related questions. 🤔',
            'That one is a little outside my current knowledge, but I can still help with Jomarie\'s portfolio details. 😊',
            'Hmm, I do not have a strong answer for that yet. Try asking something about the portfolio. ✨'
        ]));
    }

    function buildWidget() {
        if (document.getElementById('chat-widget')) return;

        const wrapper = document.createElement('div');
        wrapper.id = 'chat-widget';
        wrapper.className = 'chat-widget fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans';
        wrapper.innerHTML = `
            <div id="chat-window" class="hidden chat-panel w-80 md:w-96 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden transition-all duration-300" role="dialog" aria-modal="false" aria-labelledby="chat-title">
                <div class="chat-header bg-white dark:bg-gray-900 border-b border-gray-200 p-4 flex items-center justify-between">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="relative">
                            <img src="${portraitUrl}" alt="Jomarie Tijada" class="chat-avatar w-10 h-10 rounded-full border border-gray-200 object-cover">
                            <span class="chat-status-dot absolute bottom-0 right-0 w-3 h-3 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></span>
                        </div>
                        <div class="min-w-0">
                            <h3 id="chat-title" class="text-gray-900 dark:text-white font-bold text-sm">${knowledge.profile.name}</h3>
                            <p class="text-gray-500 dark:text-gray-400 text-[10px] tracking-wider uppercase font-medium">Online</p>
                        </div>
                    </div>
                    <button id="close-chat" class="chat-icon-button text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition" type="button" aria-label="Close chat">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>

                <div id="chat-box" class="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950 flex flex-col scroll-smooth">
                    <div class="chat-message chat-message-bot self-start bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-tl-none border border-gray-200 text-sm shadow-sm max-w-[85%]">
                        Hi, I'm Jomarie Tijada, a Computer Science student focused on software development, AI, and data-related projects. I enjoy building practical systems that solve real problems.
                    </div>
                </div>

                <form id="chat-form" class="chat-form p-3 bg-white dark:bg-gray-900 border-t border-gray-200 flex gap-2">
                    <textarea id="message" rows="1" autocomplete="off" class="chat-input flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400" placeholder="Ask about skills, projects, resume..."></textarea>
                    <button type="submit" class="chat-send-button bg-black dark:bg-white text-white dark:text-black w-10 h-10 rounded-xl flex items-center justify-center transition hover:opacity-90" aria-label="Send message" disabled>
                        <i class="fas fa-paper-plane text-sm"></i>
                    </button>
                </form>
            </div>

            <button id="toggle-chat" class="bg-black text-white hover-lift rounded-full shadow-lg flex items-center gap-3 px-6 py-3.5 transition-all duration-300 transform active:scale-95" type="button" aria-label="Open chat" aria-expanded="false" aria-controls="chat-window">
                <span class="chat-launcher-icon">
                    <i class="fas fa-headset text-base"></i>
                </span>
                <span class="font-semibold text-sm">Chat with Jom</span>
            </button>
        `;
        document.body.appendChild(wrapper);
    }

    function addSuggestions(chatBox, messageInput, chatForm) {
        if (!chatBox || document.getElementById('chat-suggestions')) return;

        const suggestionBar = document.createElement('div');
        suggestionBar.id = 'chat-suggestions';
        suggestionBar.className = 'flex flex-wrap gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800';
        suggestionBar.innerHTML = suggestions.map((item) => `
            <button type="button" class="chat-suggestion text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition" data-prompt="${escapeHtml(item.prompt)}">
                ${escapeHtml(item.label)}
            </button>
        `).join('');

        chatBox.insertAdjacentElement('afterend', suggestionBar);
        suggestionBar.addEventListener('click', (event) => {
            const button = event.target.closest('.chat-suggestion');
            if (!button || !messageInput || !chatForm) return;

            messageInput.value = button.dataset.prompt;
            chatForm.requestSubmit();
        });
    }

    function appendUserMessage(chatBox, message) {
        chatBox.insertAdjacentHTML('beforeend', `
            <div class="chat-message chat-message-user self-end bg-black text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] shadow-md">
                ${escapeHtml(message)}
            </div>
        `);
    }

    function appendBotMessage(chatBox, message) {
        const responseId = `local-ai-${Date.now()}`;
        chatBox.insertAdjacentHTML('beforeend', `
            <div id="${responseId}" class="chat-message chat-message-bot self-start bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-2xl rounded-tl-none border border-gray-200 text-sm shadow-sm max-w-[85%]" aria-live="polite">
                <span class="chat-typing" aria-label="Jom is typing"><span></span><span></span><span></span></span>
            </div>
        `);

        const response = document.getElementById(responseId);
        window.setTimeout(() => {
            response.innerHTML = message;
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 220);
    }

    function upgradeExistingMarkup() {
        const wrapper = document.getElementById('chat-widget');
        const chatWindow = document.getElementById('chat-window');
        const closeBtn = document.getElementById('close-chat');
        const chatBox = document.getElementById('chat-box');
        const chatForm = document.getElementById('chat-form');
        const messageInput = document.getElementById('message');
        const submitBtn = chatForm ? chatForm.querySelector('button[type="submit"]') : null;
        const toggleBtn = document.getElementById('toggle-chat');

        if (wrapper) wrapper.classList.add('chat-widget');
        wrapper?.querySelectorAll('.chat-status-dot').forEach((dot) => {
            dot.classList.remove('animate-pulse');
        });
        if (chatWindow) {
            chatWindow.classList.add('chat-panel');
            chatWindow.setAttribute('role', 'dialog');
            chatWindow.setAttribute('aria-modal', 'false');
            chatWindow.setAttribute('aria-labelledby', 'chat-title');
        }
        if (chatWindow) {
            const title = chatWindow.querySelector('h3');
            const status = title ? title.nextElementSibling : null;

            if (title) {
                title.id = 'chat-title';
                title.textContent = knowledge.profile.name;
            }

            if (status) {
                status.textContent = 'Online';
            }
        }
        if (closeBtn) {
            closeBtn.classList.add('chat-icon-button');
            closeBtn.setAttribute('type', 'button');
            closeBtn.setAttribute('aria-label', 'Close chat');
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('type', 'button');
            toggleBtn.setAttribute('aria-label', 'Open chat');
            toggleBtn.setAttribute('aria-expanded', chatWindow && !chatWindow.classList.contains('hidden') ? 'true' : 'false');
            toggleBtn.setAttribute('aria-controls', 'chat-window');
        }
        if (chatBox) {
            chatBox.querySelectorAll(':scope > div').forEach((message) => {
                message.classList.add('chat-message');
                if (message.classList.contains('self-end')) {
                    message.classList.add('chat-message-user');
                } else {
                    message.classList.add('chat-message-bot');
                }
            });
        }
        if (chatForm) chatForm.classList.add('chat-form');
        if (messageInput) {
            messageInput.classList.add('chat-input');
            messageInput.setAttribute('placeholder', 'Ask about skills, projects, resume...');
            if (messageInput.tagName.toLowerCase() === 'input') {
                const textarea = document.createElement('textarea');
                Array.from(messageInput.attributes).forEach((attr) => textarea.setAttribute(attr.name, attr.value));
                textarea.rows = 1;
                textarea.value = messageInput.value;
                messageInput.replaceWith(textarea);
            }
        }
        if (submitBtn) {
            submitBtn.classList.add('chat-send-button');
            submitBtn.setAttribute('aria-label', 'Send message');
        }
    }

    function setOpen(isOpen, chatWindow, toggleBtn, messageInput) {
        chatWindow.classList.toggle('hidden', !isOpen);
        toggleBtn.classList.toggle('chat-open', isOpen);
        toggleBtn.setAttribute('aria-expanded', String(isOpen));

        if (isOpen) {
            window.setTimeout(() => messageInput.focus(), 40);
        }
    }

    function resizeInput(messageInput) {
        messageInput.style.height = 'auto';
        messageInput.style.height = `${Math.min(messageInput.scrollHeight, 112)}px`;
    }

    function initWidget() {
        upgradeExistingMarkup();

        const toggleBtn = document.getElementById('toggle-chat');
        const closeBtn = document.getElementById('close-chat');
        const chatWindow = document.getElementById('chat-window');
        const chatForm = document.getElementById('chat-form');
        const chatBox = document.getElementById('chat-box');
        const messageInput = document.getElementById('message');
        const submitBtn = chatForm ? chatForm.querySelector('button[type="submit"]') : null;

        if (!toggleBtn || !closeBtn || !chatWindow || !chatForm || !chatBox || !messageInput) return;

        if (chatForm.dataset.localChatReady === 'true') return;
        chatForm.dataset.localChatReady = 'true';

        toggleBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            setOpen(chatWindow.classList.contains('hidden'), chatWindow, toggleBtn, messageInput);
        }, true);

        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            setOpen(false, chatWindow, toggleBtn, messageInput);
        }, true);
        addSuggestions(chatBox, messageInput, chatForm);

        const updateSubmitState = () => {
            if (submitBtn) submitBtn.disabled = messageInput.value.trim().length === 0;
            resizeInput(messageInput);
        };

        updateSubmitState();
        messageInput.addEventListener('input', updateSubmitState);
        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                chatForm.requestSubmit();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !chatWindow.classList.contains('hidden')) {
                setOpen(false, chatWindow, toggleBtn, messageInput);
            }
        });

        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const userMsg = messageInput.value.trim();
            if (!userMsg) return;

            appendUserMessage(chatBox, userMsg);
            messageInput.value = '';
            updateSubmitState();
            chatBox.scrollTop = chatBox.scrollHeight;

            appendBotMessage(chatBox, getResponse(userMsg));
            chatBox.scrollTop = chatBox.scrollHeight;
        }, true);
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildWidget();
        initWidget();
    });

    window.JomarieChatbot = {
        getResponse,
        knowledge
    };
})();
