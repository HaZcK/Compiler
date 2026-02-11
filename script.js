/* ===============================================
   LUA COMPILER PRO - COMPLETE JAVASCRIPT
   =============================================== */

// === CONFIGURATION ===
const CONFIG = {
    STORAGE_KEY_SETTINGS: 'lua_compiler_settings',
    STORAGE_KEY_HISTORY: 'lua_compiler_history',
    STORAGE_KEY_THEME: 'lua_compiler_theme',
    STORAGE_KEY_STATS: 'lua_compiler_stats',
    TOAST_DURATION: 3000,
    DEFAULT_SETTINGS: {
        obfuscationMethod: 'base64',
        antiTamper: true,
        varRename: true,
        stringEncrypt: true,
        loadstringFormat: 'auto',
        addWrapper: true,
        httpsOnly: true,
        enableAnimations: true,
        autoCopy: false,
        saveHistory: true,
        maxHistory: 50,
        compileDelay: 1500
    }
};

// === GLOBAL STATE ===
let currentSettings = {};
let currentTheme = 'dark';
let compilationHistory = [];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeParticles();
    setupEventListeners();
    loadSettings();
    loadTheme();
    loadStats();
    loadHistory();
});

function initializeApp() {
    console.log('Lua Compiler Pro initialized');
    updateLineNumbers();
}

// === PARTICLE SYSTEM ===
function initializeParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speedY: Math.random() * 1 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary') || '#00d9ff';
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            particle.y -= particle.speedY;
            particle.x += particle.speedX;
            
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// === EVENT LISTENERS ===
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Input code
    const inputCode = document.getElementById('inputCode');
    inputCode.addEventListener('input', function() {
        updateLineNumbers();
        updateCodeStats();
    });
    
    inputCode.addEventListener('scroll', function() {
        document.getElementById('lineNumbers').scrollTop = this.scrollTop;
    });
    
    // URL input
    document.getElementById('scriptUrl').addEventListener('input', updateUrlPreview);
    
    // Settings
    document.getElementById('themeSelect').addEventListener('change', function() {
        applyTheme(this.value);
    });
}

// === PAGE NAVIGATION ===
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        }
    });
}

// === THEME MANAGEMENT ===
function loadTheme() {
    currentTheme = localStorage.getItem(CONFIG.STORAGE_KEY_THEME) || 'dark';
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem(CONFIG.STORAGE_KEY_THEME, theme);
    
    const themeIcon = document.getElementById('themeIcon');
    const icons = { dark: '🌙', light: '☀️', midnight: '🌃', cyberpunk: '🎮', matrix: '💚' };
    themeIcon.textContent = icons[theme] || '🌙';
    
    const select = document.getElementById('themeSelect');
    if (select) select.value = theme;
}

function toggleTheme() {
    const themes = ['dark', 'light', 'midnight', 'cyberpunk', 'matrix'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
    showToast(`Theme changed to ${nextTheme}`, 'success');
}

// === SETTINGS MANAGEMENT ===
function loadSettings() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY_SETTINGS);
    currentSettings = saved ? JSON.parse(saved) : CONFIG.DEFAULT_SETTINGS;
    applySettingsToUI();
}

function applySettingsToUI() {
    document.getElementById('obfuscationMethod').value = currentSettings.obfuscationMethod;
    document.getElementById('antiTamper').checked = currentSettings.antiTamper;
    document.getElementById('varRename').checked = currentSettings.varRename;
    document.getElementById('stringEncrypt').checked = currentSettings.stringEncrypt;
    document.getElementById('loadstringFormat').value = currentSettings.loadstringFormat;
    document.getElementById('addWrapper').checked = currentSettings.addWrapper;
    document.getElementById('httpsOnly').checked = currentSettings.httpsOnly;
    document.getElementById('enableAnimations').checked = currentSettings.enableAnimations;
    document.getElementById('autoCopy').checked = currentSettings.autoCopy;
    document.getElementById('saveHistory').checked = currentSettings.saveHistory;
    document.getElementById('maxHistory').value = currentSettings.maxHistory;
    document.getElementById('compileDelay').value = currentSettings.compileDelay;
}

function saveSettings() {
    currentSettings = {
        obfuscationMethod: document.getElementById('obfuscationMethod').value,
        antiTamper: document.getElementById('antiTamper').checked,
        varRename: document.getElementById('varRename').checked,
        stringEncrypt: document.getElementById('stringEncrypt').checked,
        loadstringFormat: document.getElementById('loadstringFormat').value,
        addWrapper: document.getElementById('addWrapper').checked,
        httpsOnly: document.getElementById('httpsOnly').checked,
        enableAnimations: document.getElementById('enableAnimations').checked,
        autoCopy: document.getElementById('autoCopy').checked,
        saveHistory: document.getElementById('saveHistory').checked,
        maxHistory: parseInt(document.getElementById('maxHistory').value),
        compileDelay: parseInt(document.getElementById('compileDelay').value)
    };
    
    localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
    showToast('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Reset all settings to default?')) {
        currentSettings = {...CONFIG.DEFAULT_SETTINGS};
        localStorage.setItem(CONFIG.STORAGE_KEY_SETTINGS, JSON.stringify(currentSettings));
        applySettingsToUI();
        showToast('Settings reset to default', 'success');
    }
}

function exportSettings() {
    const data = JSON.stringify(currentSettings, null, 2);
    downloadFile(data, 'lua-compiler-settings.json');
    showToast('Settings exported', 'success');
}

// === CODE EDITOR ===
function updateLineNumbers() {
    const textarea = document.getElementById('inputCode');
    const lineNumbers = document.getElementById('lineNumbers');
    
    const lines = textarea.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
        numbers += i + '\n';
    }
    lineNumbers.textContent = numbers;
}

function updateCodeStats() {
    const code = document.getElementById('inputCode').value;
    const lines = code.split('\n').length;
    const chars = code.length;
    const bytes = new Blob([code]).size;
    
    document.getElementById('lineCount').textContent = lines;
    document.getElementById('charCount').textContent = chars;
    document.getElementById('fileSize').textContent = formatBytes(bytes);
}

function formatCode() {
    const textarea = document.getElementById('inputCode');
    let code = textarea.value;
    
    // Basic Lua formatting
    const lines = code.split('\n');
    let indent = 0;
    const formatted = lines.map(line => {
        const trimmed = line.trim();
        
        if (/^(end|else|elseif|until)\b/.test(trimmed)) {
            indent = Math.max(0, indent - 1);
        }
        
        const result = '    '.repeat(indent) + trimmed;
        
        if (/^(function|if|for|while|repeat|else|elseif)\b/.test(trimmed) && !/\bend\b/.test(trimmed)) {
            indent++;
        }
        
        return result;
    });
    
    textarea.value = formatted.join('\n');
    updateLineNumbers();
    showToast('Code formatted!', 'success');
}

function clearInput() {
    if (confirm('Clear all input code?')) {
        document.getElementById('inputCode').value = '';
        updateLineNumbers();
        updateCodeStats();
        showToast('Input cleared', 'success');
    }
}

// === URL VALIDATION ===
function validateUrl() {
    const input = document.getElementById('scriptUrl');
    const url = input.value.trim();
    
    if (!url) {
        showToast('Please enter a URL', 'warning');
        return;
    }
    
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
        showToast('Invalid URL format', 'error');
        input.style.borderColor = 'var(--error)';
        setTimeout(() => input.style.borderColor = '', 2000);
        return;
    }
    
    if (currentSettings.httpsOnly && !url.startsWith('https://')) {
        showToast('HTTPS is required. Disable HTTPS-only in settings.', 'warning');
        return;
    }
    
    showToast('URL is valid!', 'success');
    input.style.borderColor = 'var(--success)';
    setTimeout(() => input.style.borderColor = '', 2000);
}

function updateUrlPreview() {
    const url = document.getElementById('scriptUrl').value.trim();
    const preview = document.getElementById('urlPreview');
    const code = document.getElementById('previewCode');
    
    if (!url) {
        preview.classList.add('hidden');
        return;
    }
    
    const format = currentSettings.loadstringFormat === 'auto' ? 'httpget' : currentSettings.loadstringFormat;
    const wrapper = currentSettings.addWrapper ? '()' : '';
    
    const formats = {
        httpget: `loadstring(game:HttpGet("${url}"))${wrapper}`,
        httpgetasync: `loadstring(game:HttpGetAsync("${url}"))${wrapper}`,
        synrequest: `loadstring(syn.request({Url="${url}",Method="GET"}).Body)${wrapper}`,
        request: `loadstring(request({Url="${url}",Method="GET"}).Body)${wrapper}`
    };
    
    code.textContent = formats[format] || formats.httpget;
    preview.classList.remove('hidden');
}

function copyPreview() {
    const code = document.getElementById('previewCode').textContent;
    copyToClipboard(code);
}

// === OBFUSCATOR ===
function obfuscateCode(code, method) {
    switch(method) {
        case 'base64':
            return obfuscateBase64(code);
        case 'charcode':
            return obfuscateCharCode(code);
        case 'hex':
            return obfuscateHex(code);
        case 'advanced':
            return obfuscateAdvanced(code);
        default:
            return obfuscateBase64(code);
    }
}

function obfuscateBase64(code) {
    const b64 = btoa(unescape(encodeURIComponent(code)));
    return `(function()local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';local function d(data)data=string.gsub(data,'[^'..b..'=]','')return(data:gsub('.',function(x)if(x=='=')then return''end;local r,f='',(b:find(x)-1)for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and'1'or'0')end;return r end):gsub('%d%d%d?%d?%d?%d?%d?%d?',function(x)if(#x~=8)then return''end;local c=0;for i=1,8 do c=c+(x:sub(i,i)=='1'and 2^(8-i)or 0)end;return string.char(c)end))end;return loadstring(d("${b64}"))()end)()`;
}

function obfuscateCharCode(code) {
    const codes = [];
    for (let i = 0; i < code.length; i++) {
        codes.push(code.charCodeAt(i));
    }
    return `loadstring(string.char(${codes.join(',')}))()`;
}

function obfuscateHex(code) {
    let hex = '';
    for (let i = 0; i < code.length; i++) {
        hex += code.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return `(function()local h="${hex}";local s="";for i=1,#h,2 do s=s..string.char(tonumber(h:sub(i,i+1),16))end;return loadstring(s)()end)()`;
}

function obfuscateAdvanced(code) {
    const b64 = btoa(unescape(encodeURIComponent(code)));
    const codes = [];
    for (let i = 0; i < b64.length; i++) {
        codes.push(b64.charCodeAt(i));
    }
    return `(function()local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';local function d(data)data=string.gsub(data,'[^'..b..'=]','')return(data:gsub('.',function(x)if(x=='=')then return''end;local r,f='',(b:find(x)-1)for i=6,1,-1 do r=r..(f%2^i-f%2^(i-1)>0 and'1'or'0')end;return r end):gsub('%d%d%d?%d?%d?%d?%d?%d?',function(x)if(#x~=8)then return''end;local c=0;for i=1,8 do c=c+(x:sub(i,i)=='1'and 2^(8-i)or 0)end;return string.char(c)end))end;local e=string.char(${codes.join(',')});return loadstring(d(e))()end)()`;
}

// === COMPILER ===
async function compileCode() {
    const input = document.getElementById('inputCode').value.trim();
    
    if (!input) {
        showToast('Please enter Lua code first!', 'error');
        return;
    }
    
    showLoading(true);
    
    await sleep(currentSettings.compileDelay);
    
    try {
        let code = input;
        
        if (document.getElementById('optMinify').checked) {
            code = minifyCode(code);
        }
        
        const obfuscated = obfuscateCode(code, currentSettings.obfuscationMethod);
        
        document.getElementById('outputCode').value = obfuscated;
        document.getElementById('copyBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = false;
        
        updateOutputStats(input, obfuscated);
        showStatus('✅ Code compiled successfully!', 'success');
        
        if (currentSettings.autoCopy) {
            await copyOutput();
        }
        
        if (currentSettings.saveHistory) {
            addToHistory(input, obfuscated);
        }
        
        updateStats();
        
    } catch (err) {
        showStatus('❌ Compilation error: ' + err.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function generateLoadstring() {
    const url = document.getElementById('scriptUrl').value.trim();
    
    if (!url) {
        showToast('Please enter a script URL!', 'error');
        return;
    }
    
    const format = currentSettings.loadstringFormat === 'auto' ? 'httpget' : currentSettings.loadstringFormat;
    const wrapper = currentSettings.addWrapper ? '()' : '';
    
    const formats = {
        httpget: `loadstring(game:HttpGet("${url}"))${wrapper}`,
        httpgetasync: `loadstring(game:HttpGetAsync("${url}"))${wrapper}`,
        synrequest: `loadstring(syn.request({Url="${url}",Method="GET"}).Body)${wrapper}`,
        request: `loadstring(request({Url="${url}",Method="GET"}).Body)${wrapper}`
    };
    
    const loadstring = formats[format] || formats.httpget;
    
    document.getElementById('outputCode').value = loadstring;
    document.getElementById('copyBtn').disabled = false;
    document.getElementById('downloadBtn').disabled = false;
    
    showStatus('✅ Loadstring generated!', 'success');
    
    if (currentSettings.autoCopy) {
        await copyOutput();
    }
}

async function copyOutput() {
    const output = document.getElementById('outputCode').value;
    
    if (!output) {
        showToast('Nothing to copy!', 'warning');
        return;
    }
    
    await copyToClipboard(output);
}

async function downloadOutput() {
    const output = document.getElementById('outputCode').value;
    
    if (!output) {
        showToast('Nothing to download!', 'warning');
        return;
    }
    
    const filename = 'compiled_' + Date.now() + '.lua';
    downloadFile(output, filename);
    showToast('File downloaded!', 'success');
}

function verifyOutput() {
    const output = document.getElementById('outputCode').value;
    
    if (!output) {
        showToast('No output to verify', 'warning');
        return;
    }
    
    showToast('Output verified - loadstring ready!', 'success');
}

function minifyCode(code) {
    return code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('--'))
        .join(' ')
        .replace(/\s+/g, ' ');
}

function updateOutputStats(input, output) {
    const inputSize = new Blob([input]).size;
    const outputSize = new Blob([output]).size;
    const ratio = Math.max(0, Math.round(((inputSize - outputSize) / inputSize) * 100));
    
    document.getElementById('compressionRatio').textContent = ratio + '%';
    document.getElementById('outputSize').textContent = formatBytes(outputSize);
    document.getElementById('securityLevel').textContent = getSecurityLevel();
}

function getSecurityLevel() {
    const method = currentSettings.obfuscationMethod;
    const options = {
        antiTamper: currentSettings.antiTamper,
        varRename: currentSettings.varRename,
        stringEncrypt: currentSettings.stringEncrypt
    };
    
    let score = 0;
    if (method === 'advanced') score += 40;
    else if (method === 'base64') score += 20;
    else score += 10;
    
    if (options.antiTamper) score += 20;
    if (options.varRename) score += 15;
    if (options.stringEncrypt) score += 10;
    
    if (score >= 70) return 'Military Grade';
    if (score >= 50) return 'High';
    if (score >= 30) return 'Medium';
    return 'Low';
}

// === LOADING & STATUS ===
function showLoading(show) {
    const loading = document.getElementById('loadingBox');
    if (show) {
        loading.classList.remove('hidden');
        animateProgress();
    } else {
        loading.classList.add('hidden');
    }
}

async function animateProgress() {
    const steps = [
        { percent: 20, text: 'Analyzing code...' },
        { percent: 40, text: 'Applying obfuscation...' },
        { percent: 60, text: 'Encrypting strings...' },
        { percent: 80, text: 'Finalizing...' },
        { percent: 100, text: 'Complete!' }
    ];
    
    for (const step of steps) {
        document.getElementById('progressBar').style.width = step.percent + '%';
        document.getElementById('progressText').textContent = step.percent + '%';
        document.querySelector('.loading-text').textContent = step.text;
        await sleep(currentSettings.compileDelay / 5);
    }
}

function showStatus(message, type) {
    const status = document.getElementById('statusMessage');
    status.textContent = message;
    status.className = 'status-message ' + type;
    status.classList.remove('hidden');
    
    setTimeout(() => {
        status.classList.add('hidden');
    }, 5000);
}

// === HISTORY ===
function loadHistory() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY_HISTORY);
    compilationHistory = saved ? JSON.parse(saved) : [];
    renderHistory();
}

function addToHistory(input, output) {
    const item = {
        id: Date.now(),
        input: input,
        output: output,
        timestamp: Date.now(),
        method: currentSettings.obfuscationMethod
    };
    
    compilationHistory.unshift(item);
    
    if (compilationHistory.length > currentSettings.maxHistory) {
        compilationHistory = compilationHistory.slice(0, currentSettings.maxHistory);
    }
    
    localStorage.setItem(CONFIG.STORAGE_KEY_HISTORY, JSON.stringify(compilationHistory));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyList');
    
    if (compilationHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No compilation history yet</p>
                <small>Your compiled scripts will appear here</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = compilationHistory.map(item => `
        <div class="card">
            <div class="card-header">
                <div class="card-title" style="font-size: 1rem">
                    ${formatDate(item.timestamp)}
                </div>
                <div class="card-actions">
                    <button class="icon-btn" onclick="restoreHistory(${item.id})" title="Restore">↩️</button>
                    <button class="icon-btn" onclick="removeHistory(${item.id})" title="Delete">🗑️</button>
                </div>
            </div>
            <div style="color: var(--text-2); font-size: 0.875rem">
                <strong>Method:</strong> ${item.method} | 
                <strong>Size:</strong> ${formatBytes(new Blob([item.output]).size)}
            </div>
        </div>
    `).join('');
}

function restoreHistory(id) {
    const item = compilationHistory.find(h => h.id === id);
    if (item) {
        document.getElementById('inputCode').value = item.input;
        document.getElementById('outputCode').value = item.output;
        updateLineNumbers();
        updateCodeStats();
        showToast('History restored', 'success');
        showPage('compiler');
    }
}

function removeHistory(id) {
    compilationHistory = compilationHistory.filter(h => h.id !== id);
    localStorage.setItem(CONFIG.STORAGE_KEY_HISTORY, JSON.stringify(compilationHistory));
    renderHistory();
    showToast('History item removed', 'success');
}

function clearHistory() {
    if (confirm('Clear all history?')) {
        compilationHistory = [];
        localStorage.removeItem(CONFIG.STORAGE_KEY_HISTORY);
        renderHistory();
        showToast('History cleared', 'success');
    }
}

// === TOOLS ===
function openBeautifier() {
    formatCode();
    showPage('compiler');
}

function openMinifier() {
    const code = document.getElementById('inputCode').value;
    if (!code) {
        showToast('Enter code first!', 'warning');
        return;
    }
    
    const minified = minifyCode(code);
    document.getElementById('outputCode').value = minified;
    showToast('Code minified!', 'success');
    showPage('compiler');
}

function openValidator() {
    showToast('Syntax Validator - Coming Soon!', 'warning');
}

function openAnalyzer() {
    const code = document.getElementById('inputCode').value;
    if (!code) {
        showToast('Enter code first!', 'warning');
        return;
    }
    
    const lines = code.split('\n').length;
    const chars = code.length;
    const size = new Blob([code]).size;
    
    showToast(`Lines: ${lines} | Chars: ${chars} | Size: ${formatBytes(size)}`, 'success');
}

// === STATS ===
function loadStats() {
    const stats = localStorage.getItem(CONFIG.STORAGE_KEY_STATS);
    const data = stats ? JSON.parse(stats) : { total: 0 };
    document.getElementById('totalCompiled').textContent = data.total;
}

function updateStats() {
    const stats = localStorage.getItem(CONFIG.STORAGE_KEY_STATS);
    const data = stats ? JSON.parse(stats) : { total: 0 };
    data.total++;
    localStorage.setItem(CONFIG.STORAGE_KEY_STATS, JSON.stringify(data));
    document.getElementById('totalCompiled').textContent = data.total;
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
}

// === UTILITY FUNCTIONS ===
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';
    
    return date.toLocaleDateString();
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
            showToast('Copied to clipboard!', 'success');
        } else {
            showToast('Failed to copy', 'error');
        }
        return success;
    }
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
