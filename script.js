let storedIpData = null;
let storedGeoData = null;

// Typing Bio Animation
async function typeBio() {
    const bioElement = document.getElementById('typingBio');
    const bioText = [
        "Cybersecurity Portfolio",
        "Ethical Hacker | Pentester | Researcher"
    ];

    bioElement.innerHTML = '<span class="typing-cursor"></span>';

    for (let i = 0; i < bioText.length; i++) {
        const line = document.createElement('div');
        line.className = 'bio-line';
        line.textContent = bioText[i];
        line.innerHTML += '<span class="typing-cursor"></span>';
        bioElement.appendChild(line);
        
        await new Promise(resolve => {
            setTimeout(() => {
                line.style.animation = `typing 3.5s steps(${bioText[i].length}, end) forwards`;
                resolve();
            }, i * 3500);
        });
    }

    setTimeout(() => {
        const lines = document.querySelectorAll('.bio-line');
        lines.forEach(line => {
            line.style.animation = 'fadeOut 1s forwards';
        });
        
        setTimeout(() => {
            bioElement.remove();
        }, 1000);
    }, (bioText.length * 3500) + 3000);
}

// Section Toggling
function toggleSection(sectionId) {
    const sections = ['projects', 'ctf', 'contact'];
    const buttons = document.querySelectorAll('.gruv-button');
    
    buttons.forEach(button => {
        button.classList.remove('active');
        if (button.onclick && button.onclick.toString().includes(sectionId)) {
            button.classList.add('active');
        }
    });

    sections.forEach(section => {
        const element = document.getElementById(`${section}Section`);
        element.style.display = section === sectionId ? 'block' : 'none';
    });
}

// Time-based Greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
}

// Terminal Updates
function updateTerminal() {
    const terminal = document.getElementById('visitorInfo');
    const greeting = getGreeting();
    
    if (storedIpData && storedGeoData) {
        terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">$</span> ${greeting}, Welcome to 0xb0rn3's portfolio
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> IP: <span class="gruv-yellow">${storedIpData.ip}</span>
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Location: ${storedGeoData.city}, ${storedGeoData.country_name}
            </div>
            <div class="terminal-line">
                <span class="prompt">$</span> Status: <span class="gruv-green">Secure connection</span>
            </div>
        `;
    }
}

// Visitor Detection
async function detectVisitorInfo() {
    const terminal = document.getElementById('visitorInfo');
    
    terminal.innerHTML = `
        <div class="terminal-line">
            <span class="prompt">$</span> ${getGreeting()}, Welcome to 0xb0rn3's portfolio
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
        setInterval(updateTerminal, 60000);

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
    projectsContainer.innerHTML = '<div class="terminal-line">Loading projects...</div>';

    try {
        const response = await fetch('https://api.github.com/users/0xb0rn3/repos');
        const repos = await response.json();

        const filteredRepos = repos.filter(repo => 
            !["0xb0rn3.github.io", "b0urn3"].includes(repo.name)
        );

        projectsContainer.innerHTML = '';
        
        filteredRepos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <h4 class="project-title">${repo.name}</h4>
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
        points: 250,
        solves: 45
    },
    {
        title: "Network Breach",
        difficulty: "hard",
        description: "Exploit a vulnerable network protocol",
        category: "Network Security",
        points: 500,
        solves: 12
    },
    {
        title: "Cookie Monster",
        difficulty: "easy",
        description: "Web application authentication bypass",
        category: "Web Security",
        points: 100,
        solves: 89
    }
];

function loadCTFChallenges() {
    const ctfContainer = document.getElementById('ctf-challenges');
    ctfContainer.innerHTML = '<div class="terminal-line">Loading challenges...</div>';

    try {
        ctfContainer.innerHTML = '';
        
        ctfChallenges.forEach(challenge => {
            const ctfCard = document.createElement('div');
            ctfCard.className = 'ctf-card';
            ctfCard.innerHTML = `
                <div class="ctf-difficulty ${challenge.difficulty}">${challenge.difficulty.toUpperCase()}</div>
                <h4 class="ctf-title">${challenge.title}</h4>
                <p class="ctf-description">${challenge.description}</p>
                <div class="ctf-stats">
                    <span>Category: ${challenge.category}</span>
                    <span>${challenge.points}pts</span>
                </div>
                <div class="ctf-stats">
                    <span>Solves: ${challenge.solves}</span>
                    <button class="gruv-button" style="margin-top: 0.5rem; padding: 0.3rem 0.8rem;" disabled>
                        <i class="fas fa-lock"></i> Coming Soon
                    </button>
                </div>
            `;
            ctfContainer.appendChild(ctfCard);
        });

    } catch (error) {
        ctfContainer.innerHTML = `
            <div class="terminal-line gruv-red">
                Error loading CTF challenges. Please try again later.
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    detectVisitorInfo();
    loadProjects();
    loadCTFChallenges();
    typeBio();
});
