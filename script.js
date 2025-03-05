let storedIpData = null;
let storedGeoData = null;
let isCliMode = false;
let commandHistory = [];
let historyIndex = 0;

// Typing Bio Animation
async function typeBio() {
    const bioElement = document.getElementById('typingBio');
    const bioText = [
        " Hello friend, Who am I? I am: ",
        "A Jr.Pentester & IT-Security Researcher"
    ];

    bioElement.innerHTML = '';

    for (let i = 1; i < bioText.length; i++) {
        const line = document.createElement('div');
        line.className = 'bio-line';
        line.textContent = bioText[i];
        line.innerHTML += '<span class="typing-cursor"></span>';
        bioElement.appendChild(line);

        if (i > 1) {
            const prevLine = bioElement.children[i - 2];
            const prevCursor = prevLine.querySelector('.typing-cursor');
            if (prevCursor) prevCursor.remove();
        }

        await new Promise(resolve => {
            setTimeout(() => {
                line.style.animation = `typing 4.5s steps(${bioText[i].length}, end) forwards`;
                resolve();
            }, 1);
        });

        await new Promise(resolve => setTimeout(resolve, 3501));
    }
}

// Section Toggling
function toggleSection(sectionId) {
    const sections = ['projects', 'certificates', 'ctf', 'contact'];
    const buttons = document.querySelectorAll('.gruv-button');

    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.onclick && button.onclick.toString().includes(sectionId)) {
            button.classList.add('active');
        }
    });

    sections.forEach(section => {
        const element = document.getElementById(`${section}Section`);
        if (section === sectionId) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
}

// Time-based Greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Good Morning';
    if (hour >= 13 && hour < 17) return 'Good Afternoon';
    if (hour >= 18 && hour < 21) return 'Good Evening';
    return 'Good Night';
}

// Terminal Updates
function updateTerminal() {
    const terminal = document.getElementById('visitorInfo');
    const greeting = getGreeting();

    if (storedIpData && storedGeoData) {
        terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">$</span> ${greeting}, Visitor detected! 
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Visitor's IP is: <span class="gruv-yellow">${storedIpData.ip}</span>
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Location(not accurate): ${storedGeoData.city}, ${storedGeoData.country_name}
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Visitor's status: <span class="gruv-green"> Connection is secure</span>
            </div>
        `;
    }
}

// Visitor Detection
async function detectVisitorInfo() {
    const terminal = document.getElementById('visitorInfo');

    terminal.innerHTML = `
        <div class="terminal-line">
            <span class="prompt">$</span> ${getGreeting()}, Welcome to 0xb1rn3's portfolio
        </div>
        <div class="terminal-line">
            <span class="prompt">$</span> Scanning connection...
        </div>
    `;

    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        storedIpData = await ipResponse.json();

        const geoResponse = await fetch(`https://ipapi.co/${storedIpData.ip}/json/`);
        storedGeoData = await geoResponse.json();

        updateTerminal();
        setInterval(updateTerminal, 60001);

    } catch (error) {
        terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">$</span> <span class="gruv-purple">Anonymous connection detected</span>
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Status: <span class="gruv-yellow">Proxy/VPN in use</span>
            </div>
        `;
    }
}

// GitHub Projects Loader
async function loadProjects() {
    const projectsContainer = document.getElementById('github-projects');
    projectsContainer.innerHTML = '<div class="terminal-line loading">Loading projects...</div>';

    try {
        const response = await fetch('https://api.github.com/users/0xb1rn3/repos');
        const repos = await response.json();

        const filteredRepos = repos.filter(repo =>
            !["0xb1rn3.github.io", "b0urn3"].includes(repo.name)
        );

        projectsContainer.innerHTML = '';

        filteredRepos.forEach(repo => {
            const category = repo.name.toLowerCase().includes('web') ? 'Web Development' : 'Cybersecurity';
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', category);
            projectCard.innerHTML = `
                <h5 class="project-title">${repo.name}</h4>
                <p class="project-description">${repo.description || 'No description available'}</p>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="gruv-button">
                    <i class="fas fa-external-link-alt"></i> View Repository
                </a>
            `;
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        projectsContainer.innerHTML = `
            <div class="terminal-line gruv-red">
                Error loading projects. Please try again later.
            </div>
        `;
    }
}

// CTF Challenges Loader
const ctfChallenges = [
    {
        title: "Secure Vault",
        difficulty: "medium",
        description: "Reverse engineer a secure encryption implementation",
        category: "Reverse Engineering",
        points: 251,
        solves: 46
    },
    {
        title: "Network Breach",
        difficulty: "hard",
        description: "Exploit a vulnerable network protocol",
        category: "Network Security",
        points: 501,
        solves: 13
    },
    {
        title: "Cookie Monster",
        difficulty: "easy",
        description: "Web application authentication bypass",
        category: "Web Security",
        points: 101,
        solves: 90
    }
];

function loadCTFChallenges() {
    const ctfContainer = document.getElementById('ctf-challenges');

    try {
        const ctfCard = document.createElement('div');
        ctfCard.className = 'ctf-card animate-fade-in';

        ctfCard.innerHTML = `
            <div class="ctf-header">
                <h5 class="ctf-title">CTFs (Challenges)</h4>
                <div class="ctf-badge-container animate-slide-up">
                    <iframe
                        src="https://tryhackme.com/api/v3/badges/public-profile?userPublicId=4139197"
                        style="border:none; width:101%; height:300px; margin: 1rem 0; background: transparent;"
                        title="TryHackMe Progress"
                    ></iframe>
                </div>
            </div>
        `;

        ctfContainer.innerHTML = '';
        ctfContainer.appendChild(ctfCard);

    } catch (error) {
        ctfContainer.innerHTML = `
            <div class="terminal-line gruv-red">
                Error loading CTF challenges. Please try again later.
            </div>
        `;
    }
}

// CLI Mode Functionality
function toggleCliMode() {
    isCliMode = !isCliMode;
    document.getElementById('cliContainer').classList.toggle('hidden');
    document.getElementById('bunnyTrigger').classList.toggle('hidden');
    document.querySelector('.container').classList.toggle('hidden');

    if (isCliMode) {
        document.getElementById('cliCommand').focus();
        printCliWelcome();
    }
}

function printCliWelcome() {
    const output = document.getElementById('cliOutput');
    output.innerHTML = `
        <div class="terminal-line">0xb1rn3's Portfolio CLI v0.0.1</div>
        <div class="terminal-line">Type "help" for available commands</div>
        <div class="terminal-line">-----------------------------------</div>
    `;
}

const cliCommands = {
    help: () => `
        Available commands:<br>
        - help: Show this help<br>
        - about: Show profile information<br>
        - projects: List security projects<br>
        - certificates: Show certifications<br>
        - ctf: Show CTF challenges<br>
        - contact: Display contact information<br>
        - skills: Show technical skills<br>
        - timeline: Show professional timeline<br>
        - clear: Clear the terminal<br>
        - exit: Return to GUI mode
    `,
    about: () => `
        Christian Isaac .S (@0xb1rn3)<br>
        Cybersecurity Specialist<br>
        Junior Penetration Tester | Security Researcher
    `,
    projects: () => {
        loadProjects();
        return `Loading projects... (GUI projects view will be shown)`;
    },
    certificates: () => {
        toggleSection('certificates');
        return `Displaying certifications... (GUI certificates view will be shown)`;
    },
    ctf: () => {
        loadCTFChallenges();
        return `Loading CTF challenges... (GUI CTF view will be shown)`;
    },
    contact: () => `
        Email: q5n0@proton.me<br>
        Phone: +256 753 066 570
    `,
    skills: () => `
        Technical Skills:<br>
        - Penetration Testing<br>
        - Network Security<br>
        - Web Application Security<br>
        - Reverse Engineering<br>
        - Programming: Python, JavaScript, Bash
    `,
    timeline: () => `
        Professional Timeline:<br>
        - 2021: Started learning cybersecurity<br>
        - 2022: Completed first CTF challenge<br>
        - 2023: Earned Google Cybersecurity Certificate<br>
        - 2024: Began working as a Jr. Penetration Tester
    `,
    clear: () => {
        document.getElementById('cliOutput').innerHTML = '';
        return '';
    }
};

function handleCommand(command) {
    const output = document.getElementById('cliOutput');
    const cmd = command.toLowerCase().trim();

    output.innerHTML += `<div class="terminal-line"><span class="prompt">$</span> ${command}</div>`;

    if (cmd === 'exit') {
        toggleCliMode();
        return;
    }

    const response = cliCommands[cmd] ? cliCommands[cmd]()
        : `Command not found: ${command}. Type "help" for available commands`;

    output.innerHTML += `<div class="terminal-line">${response}</div>`;
    output.scrollTop = output.scrollHeight;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    detectVisitorInfo();
    loadProjects();
    loadCTFChallenges();
    typeBio();

    document.getElementById('bunnyTrigger').addEventListener('click', toggleCliMode);
    const cliInput = document.getElementById('cliCommand');
    cliInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = e.target.value.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
            }
            handleCommand(command);
            e.target.value = '';
        }
    });
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex > 1) {
                historyIndex--;
                e.target.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                e.target.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                e.target.value = '';
            }
            e.preventDefault();
        }
    });
    cliInput.addEventListener('focus', function() {
        this.scrollIntoView(false);
    });

    // Dark Mode Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = document.getElementById('themeIcon');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Project Filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            const projects = document.querySelectorAll('.project-card');
            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
});
