/**
 * JL Dev Environment Dashboard - Server
 * ============================================================================
 * Version:     1.2.0
 * Updated:     2025-12-09
 * Purpose:     Express server for local dev environment status dashboard
 * Usage:       npm start (from dashboard/ folder)
 * ============================================================================
 */

const express = require('express');
const { execSync, exec } = require('child_process');
const path = require('path');
const os = require('os');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3333;

// Project configuration
const PROJECT_NAME = 'jl-dev-environment-gm-v1.0';
const PROJECT_VERSION = '1.2.0';

// Standard project path: ~/dev/ai-agents-and-apps-dev/PROJECT_NAME
const PROJECTS_BASE = path.join(os.homedir(), 'dev', 'ai-agents-and-apps-dev');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Run command and return result
function runCommand(cmd, timeout = 5000) {
  try {
    const result = execSync(cmd, { 
      encoding: 'utf8', 
      timeout,
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

// Helper: Check if command exists
function commandExists(cmd) {
  try {
    execSync(`command -v ${cmd}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return true;
  } catch {
    return false;
  }
}

// Helper: Get version of a tool
function getVersion(cmd) {
  const result = runCommand(cmd, 3000);
  if (result.success) {
    // Extract version number from output
    const match = result.output.match(/(\d+\.\d+\.?\d*)/);
    return match ? match[1] : result.output.split('\n')[0];
  }
  return null;
}

// API: System info
app.get('/api/system', (req, res) => {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: runCommand('sw_vers -productVersion').output || os.release(),
    chip: runCommand('uname -m').output,
    memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
    uptime: Math.round(os.uptime() / 3600) + ' hours'
  };
  res.json(info);
});

// API: Runtime status
app.get('/api/runtimes', (req, res) => {
  const runtimes = {
    node: {
      name: 'Node.js',
      installed: commandExists('node'),
      version: getVersion('node -v'),
      status: 'ok'
    },
    npm: {
      name: 'npm',
      installed: commandExists('npm'),
      version: getVersion('npm -v'),
      status: 'ok'
    },
    java: {
      name: 'Java',
      installed: commandExists('java'),
      version: getVersion('java -version 2>&1 | head -1'),
      status: 'ok'
    },
    python: {
      name: 'Python',
      installed: commandExists('python3'),
      version: getVersion('python3 --version'),
      status: 'ok'
    }
  };

  // Update status based on installation
  Object.keys(runtimes).forEach(key => {
    if (!runtimes[key].installed) {
      runtimes[key].status = 'error';
    }
  });

  res.json(runtimes);
});

// API: Package managers
app.get('/api/packages', (req, res) => {
  const nvmDir = path.join(os.homedir(), '.nvm');
  const sdkmanDir = path.join(os.homedir(), '.sdkman');
  
  // Get nvm version from the nvm directory if it exists
  let nvmVersion = null;
  const nvmInstalled = runCommand(`[ -d "${nvmDir}" ] && echo "yes"`).success;
  if (nvmInstalled) {
    // Try to get version from package.json in nvm directory
    const nvmPkgResult = runCommand(`cat "${nvmDir}/package.json" 2>/dev/null | grep '"version"' | head -1`);
    if (nvmPkgResult.success) {
      const match = nvmPkgResult.output.match(/"version":\s*"([^"]+)"/);
      nvmVersion = match ? match[1] : 'installed';
    } else {
      nvmVersion = 'installed';
    }
  }
  
  // Get SDKMAN version
  let sdkmanVersion = null;
  const sdkmanInstalled = runCommand(`[ -d "${sdkmanDir}" ] && echo "yes"`).success;
  if (sdkmanInstalled) {
    const sdkmanVerResult = runCommand(`cat "${sdkmanDir}/var/version" 2>/dev/null`);
    sdkmanVersion = sdkmanVerResult.success ? sdkmanVerResult.output : 'installed';
  }
  
  const packages = {
    homebrew: {
      name: 'Homebrew',
      installed: commandExists('brew'),
      version: getVersion('brew --version | head -1'),
      status: 'ok'
    },
    nvm: {
      name: 'nvm',
      installed: nvmInstalled,
      version: nvmVersion,
      status: 'ok'
    },
    sdkman: {
      name: 'SDKMAN',
      installed: sdkmanInstalled,
      version: sdkmanVersion,
      status: 'ok'
    }
  };

  Object.keys(packages).forEach(key => {
    if (!packages[key].installed) {
      packages[key].status = 'error';
    }
  });

  res.json(packages);
});

// API: DevOps tools
app.get('/api/devops', (req, res) => {
  const dockerInstalled = commandExists('docker');
  const dockerRunning = runCommand('docker info 2>/dev/null').success;
  
  // Get container counts if Docker is running
  let containerCount = 0;
  let imageCount = 0;
  if (dockerRunning) {
    const containers = runCommand('docker ps -q 2>/dev/null');
    containerCount = containers.output ? containers.output.split('\n').filter(Boolean).length : 0;
    const images = runCommand('docker images -q 2>/dev/null');
    imageCount = images.output ? images.output.split('\n').filter(Boolean).length : 0;
  }
  
  const tools = {
    docker: {
      name: 'Docker',
      installed: dockerInstalled,
      version: getVersion('docker --version'),
      running: dockerRunning,
      containers: containerCount,
      images: imageCount,
      status: dockerRunning ? 'ok' : (dockerInstalled ? 'warning' : 'error')
    },
    gcloud: {
      name: 'gcloud CLI',
      installed: commandExists('gcloud'),
      version: getVersion('gcloud --version 2>&1 | head -1'),
      status: commandExists('gcloud') ? 'ok' : 'error'
    },
    gh: {
      name: 'GitHub CLI',
      installed: commandExists('gh'),
      version: getVersion('gh --version | head -1'),
      status: commandExists('gh') ? 'ok' : 'error'
    },
    git: {
      name: 'Git',
      installed: commandExists('git'),
      version: getVersion('git --version'),
      status: 'ok'
    },
    kubectl: {
      name: 'kubectl',
      installed: commandExists('kubectl'),
      version: getVersion('kubectl version --client -o json 2>/dev/null | grep -o \'"gitVersion":"[^"]*"\' | head -1') || 
               getVersion('kubectl version --client 2>/dev/null | head -1') || 'N/A',
      status: commandExists('kubectl') ? 'ok' : 'warning'
    }
  };

  res.json(tools);
});

// API: Project info
app.get('/api/project', (req, res) => {
  res.json({
    name: PROJECT_NAME,
    version: PROJECT_VERSION,
    basePath: PROJECTS_BASE,
    dashboardPort: PORT
  });
});

// API: Authentication status
app.get('/api/auth', (req, res) => {
  const ghAuth = runCommand('gh auth status 2>&1');
  const gcloudAuth = runCommand('gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null');
  const adcExists = runCommand('[ -f ~/.config/gcloud/application_default_credentials.json ] && echo "yes"').success;
  const gcpProject = runCommand('gcloud config get-value project 2>/dev/null');

  const auth = {
    github: {
      name: 'GitHub',
      authenticated: ghAuth.output.includes('Logged in'),
      account: ghAuth.output.includes('Logged in') ? 
        (ghAuth.output.match(/Logged in to github\.com account (\w+)/)?.[1] || 'authenticated') : null,
      status: ghAuth.output.includes('Logged in') ? 'ok' : 'error'
    },
    gcloud: {
      name: 'Google Cloud',
      authenticated: gcloudAuth.success && gcloudAuth.output.length > 0,
      account: gcloudAuth.output || null,
      status: (gcloudAuth.success && gcloudAuth.output.length > 0) ? 'ok' : 'error'
    },
    adc: {
      name: 'GCP ADC',
      configured: adcExists,
      status: adcExists ? 'ok' : 'warning'
    },
    gcpProject: {
      name: 'GCP Project',
      project: gcpProject.output || 'not set',
      status: gcpProject.output ? 'ok' : 'warning'
    }
  };

  res.json(auth);
});

// API: Repository status
app.get('/api/repos', (req, res) => {
  // Standard path: ~/dev/ai-agents-and-apps-dev/PROJECT_NAME
  const devEnvPath = path.join(PROJECTS_BASE, 'jl-dev-environment-gm-v1.0');
  const aiAgentsPath = path.join(PROJECTS_BASE, 'ai-agents-gmaster-build');
  
  // Helper to get repo info safely
  function getRepoInfo(repoPath, repoName) {
    const existsResult = runCommand(`[ -d "${repoPath}" ] && echo "yes"`);
    const exists = existsResult.success && existsResult.output === 'yes';
    
    let branch = 'N/A';
    let clean = true;
    
    if (exists) {
      const branchResult = runCommand(`cd "${repoPath}" && git branch --show-current 2>/dev/null`);
      branch = (branchResult.success && branchResult.output) ? branchResult.output : 'N/A';
      
      const statusResult = runCommand(`cd "${repoPath}" && git status --porcelain 2>/dev/null`);
      clean = statusResult.success && statusResult.output === '';
    }
    
    return {
      name: repoName,
      exists: exists,
      branch: branch,
      status: !exists ? 'error' : (!clean ? 'warning' : 'ok'),
      clean: clean
    };
  }
  
  const repos = {
    devEnv: getRepoInfo(devEnvPath, 'jl-dev-environment-gm-v1.0'),
    aiAgents: getRepoInfo(aiAgentsPath, 'ai-agents-gmaster-build')
  };

  res.json(repos);
});

// API: AI tools status
app.get('/api/ai', (req, res) => {
  const continueConfig = runCommand('[ -f ~/.continue/config.json ] && echo "yes"').success;
  const cursorInstalled = runCommand('[ -d "/Applications/Cursor.app" ] && echo "yes"').success;
  const claudeInstalled = runCommand('command -v claude 2>/dev/null').success;

  const ai = {
    cursor: {
      name: 'Cursor IDE',
      installed: cursorInstalled,
      status: cursorInstalled ? 'ok' : 'error'
    },
    continue: {
      name: 'Continue (Gemini)',
      configured: continueConfig,
      status: continueConfig ? 'ok' : 'warning'
    },
    claude: {
      name: 'Claude CLI',
      installed: claudeInstalled,
      status: claudeInstalled ? 'ok' : 'warning'
    }
  };

  res.json(ai);
});

// Helper functions for direct data collection (avoiding internal HTTP calls)
function getSystemData() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    release: runCommand('sw_vers -productVersion').output || os.release(),
    chip: runCommand('uname -m').output,
    memory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB`,
    uptime: Math.round(os.uptime() / 3600) + ' hours'
  };
}

function getRuntimesData() {
  const runtimes = {
    node: { name: 'Node.js', installed: commandExists('node'), version: getVersion('node -v'), status: 'ok' },
    npm: { name: 'npm', installed: commandExists('npm'), version: getVersion('npm -v'), status: 'ok' },
    java: { name: 'Java', installed: commandExists('java'), version: getVersion('java -version 2>&1 | head -1'), status: 'ok' },
    python: { name: 'Python', installed: commandExists('python3'), version: getVersion('python3 --version'), status: 'ok' }
  };
  Object.keys(runtimes).forEach(key => { if (!runtimes[key].installed) runtimes[key].status = 'error'; });
  return runtimes;
}

function getPackagesData() {
  const nvmDir = path.join(os.homedir(), '.nvm');
  const sdkmanDir = path.join(os.homedir(), '.sdkman');
  const nvmInstalled = runCommand(`[ -d "${nvmDir}" ] && echo "yes"`).success;
  const sdkmanInstalled = runCommand(`[ -d "${sdkmanDir}" ] && echo "yes"`).success;
  
  let nvmVersion = nvmInstalled ? (runCommand(`cat "${nvmDir}/package.json" 2>/dev/null | grep '"version"' | head -1`).output.match(/"version":\s*"([^"]+)"/)?.[1] || 'installed') : null;
  let sdkmanVersion = sdkmanInstalled ? (runCommand(`cat "${sdkmanDir}/var/version" 2>/dev/null`).output || 'installed') : null;
  
  const packages = {
    homebrew: { name: 'Homebrew', installed: commandExists('brew'), version: getVersion('brew --version | head -1'), status: 'ok' },
    nvm: { name: 'nvm', installed: nvmInstalled, version: nvmVersion, status: 'ok' },
    sdkman: { name: 'SDKMAN', installed: sdkmanInstalled, version: sdkmanVersion, status: 'ok' }
  };
  Object.keys(packages).forEach(key => { if (!packages[key].installed) packages[key].status = 'error'; });
  return packages;
}

function getDevOpsData() {
  const dockerInstalled = commandExists('docker');
  const dockerRunning = runCommand('docker info 2>/dev/null').success;
  let containerCount = 0, imageCount = 0;
  if (dockerRunning) {
    containerCount = runCommand('docker ps -q 2>/dev/null').output?.split('\n').filter(Boolean).length || 0;
    imageCount = runCommand('docker images -q 2>/dev/null').output?.split('\n').filter(Boolean).length || 0;
  }
  
  return {
    docker: { name: 'Docker', installed: dockerInstalled, version: getVersion('docker --version'), running: dockerRunning, containers: containerCount, images: imageCount, status: dockerRunning ? 'ok' : (dockerInstalled ? 'warning' : 'error') },
    gcloud: { name: 'gcloud CLI', installed: commandExists('gcloud'), version: getVersion('gcloud --version 2>&1 | head -1'), status: commandExists('gcloud') ? 'ok' : 'error' },
    gh: { name: 'GitHub CLI', installed: commandExists('gh'), version: getVersion('gh --version | head -1'), status: commandExists('gh') ? 'ok' : 'error' },
    git: { name: 'Git', installed: commandExists('git'), version: getVersion('git --version'), status: 'ok' },
    kubectl: { name: 'kubectl', installed: commandExists('kubectl'), version: getVersion('kubectl version --client -o json 2>/dev/null | grep -o \'"gitVersion":"[^"]*"\' | head -1') || getVersion('kubectl version --client 2>/dev/null | head -1') || 'N/A', status: commandExists('kubectl') ? 'ok' : 'warning' }
  };
}

function getAuthData() {
  const ghAuth = runCommand('gh auth status 2>&1');
  const gcloudAuth = runCommand('gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null');
  const adcExists = runCommand('[ -f ~/.config/gcloud/application_default_credentials.json ] && echo "yes"').success;
  const gcpProject = runCommand('gcloud config get-value project 2>/dev/null');
  
  return {
    github: { name: 'GitHub', authenticated: ghAuth.output.includes('Logged in'), account: ghAuth.output.includes('Logged in') ? (ghAuth.output.match(/Logged in to github\.com account (\w+)/)?.[1] || 'authenticated') : null, status: ghAuth.output.includes('Logged in') ? 'ok' : 'error' },
    gcloud: { name: 'Google Cloud', authenticated: gcloudAuth.success && gcloudAuth.output.length > 0, account: gcloudAuth.output || null, status: (gcloudAuth.success && gcloudAuth.output.length > 0) ? 'ok' : 'error' },
    adc: { name: 'GCP ADC', configured: adcExists, status: adcExists ? 'ok' : 'warning' },
    gcpProject: { name: 'GCP Project', project: gcpProject.output || 'not set', status: gcpProject.output ? 'ok' : 'warning' }
  };
}

function getReposData() {
  const devEnvPath = path.join(PROJECTS_BASE, 'jl-dev-environment-gm-v1.0');
  const aiAgentsPath = path.join(PROJECTS_BASE, 'ai-agents-gmaster-build');
  
  // Helper to get repo info safely (same logic as /api/repos)
  function getRepoInfoInternal(repoPath, repoName) {
    const existsResult = runCommand(`[ -d "${repoPath}" ] && echo "yes"`);
    const exists = existsResult.success && existsResult.output === 'yes';
    
    let branch = 'N/A';
    let clean = true;
    
    if (exists) {
      const branchResult = runCommand(`cd "${repoPath}" && git branch --show-current 2>/dev/null`);
      branch = (branchResult.success && branchResult.output) ? branchResult.output : 'N/A';
      
      const statusResult = runCommand(`cd "${repoPath}" && git status --porcelain 2>/dev/null`);
      clean = statusResult.success && statusResult.output === '';
    }
    
    return {
      name: repoName,
      exists: exists,
      branch: branch,
      status: !exists ? 'error' : (!clean ? 'warning' : 'ok'),
      clean: clean
    };
  }
  
  return {
    devEnv: getRepoInfoInternal(devEnvPath, 'jl-dev-environment-gm-v1.0'),
    aiAgents: getRepoInfoInternal(aiAgentsPath, 'ai-agents-gmaster-build')
  };
}

function getAIData() {
  const continueConfig = runCommand('[ -f ~/.continue/config.json ] && echo "yes"').success;
  const cursorInstalled = runCommand('[ -d "/Applications/Cursor.app" ] && echo "yes"').success;
  const claudeInstalled = runCommand('command -v claude 2>/dev/null').success;
  
  return {
    cursor: { name: 'Cursor IDE', installed: cursorInstalled, status: cursorInstalled ? 'ok' : 'error' },
    continue: { name: 'Continue (Gemini)', configured: continueConfig, status: continueConfig ? 'ok' : 'warning' },
    claude: { name: 'Claude CLI', installed: claudeInstalled, status: claudeInstalled ? 'ok' : 'warning' }
  };
}

// API: Full status (all checks) - using direct function calls for efficiency
app.get('/api/status', (req, res) => {
  try {
    const system = getSystemData();
    const runtimes = getRuntimesData();
    const packages = getPackagesData();
    const devops = getDevOpsData();
    const auth = getAuthData();
    const repos = getReposData();
    const ai = getAIData();

    // Calculate overall status
    const allStatuses = [
      ...Object.values(runtimes).map(r => r.status),
      ...Object.values(packages).map(p => p.status),
      ...Object.values(devops).map(d => d.status),
      ...Object.values(auth).map(a => a.status),
      ...Object.values(repos).map(r => r.status),
      ...Object.values(ai).map(a => a.status)
    ];

    const hasError = allStatuses.includes('error');
    const hasWarning = allStatuses.includes('warning');
    const overallStatus = hasError ? 'error' : (hasWarning ? 'warning' : 'ok');

    res.json({
      timestamp: new Date().toISOString(),
      overallStatus,
      project: { name: PROJECT_NAME, version: PROJECT_VERSION },
      system,
      runtimes,
      packages,
      devops,
      auth,
      repos,
      ai
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Link Verification API
// ─────────────────────────────────────────────────────────────────────────────

// Quick Links configuration - same as in index.html
const QUICK_LINKS = [
  // Repositories
  { id: 'github-dev-env', name: 'GitHub (Dev Env)', url: 'https://github.com/Absolute-Space-GHCP/jl-dev-environment-gm-v1.0', category: 'Repositories' },
  { id: 'github-ai-agents', name: 'GitHub (AI Agents)', url: 'https://github.com/Absolute-Space-GHCP/ai-agents-gmaster-build', category: 'Repositories' },
  // Cloud & AI
  { id: 'gcp-console', name: 'GCP Console', url: 'https://console.cloud.google.com', category: 'Cloud & AI' },
  { id: 'vertex-ai', name: 'Vertex AI', url: 'https://console.cloud.google.com/vertex-ai', category: 'Cloud & AI' },
  { id: 'anthropic', name: 'Anthropic Console', url: 'https://console.anthropic.com', category: 'Cloud & AI' },
  { id: 'ai-studio', name: 'Google AI Studio', url: 'https://aistudio.google.com', category: 'Cloud & AI' },
  // Dev Tools
  { id: 'slack-app', name: 'Slack API', url: 'https://api.slack.com', category: 'Dev Tools' },
  { id: 'cursor-docs', name: 'Cursor Docs', url: 'https://cursor.sh/docs', category: 'Dev Tools' },
  { id: 'docker-hub', name: 'Docker Hub', url: 'https://hub.docker.com', category: 'Dev Tools' },
  { id: 'node-docs', name: 'Node.js Docs', url: 'https://nodejs.org/docs/latest-v22.x/api/', category: 'Dev Tools' },
  // Documentation
  { id: 'claude-docs', name: 'Claude Docs', url: 'https://docs.anthropic.com', category: 'Documentation' },
  { id: 'vertex-docs', name: 'Vertex AI Docs', url: 'https://cloud.google.com/vertex-ai/docs', category: 'Documentation' },
  { id: 'homebrew', name: 'Homebrew', url: 'https://brew.sh', category: 'Documentation' },
  { id: 'sdkman', name: 'SDKMAN', url: 'https://sdkman.io', category: 'Documentation' }
];

// Helper: Check a single URL
function checkUrl(urlString, timeout = 10000) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const protocol = url.protocol === 'https:' ? https : http;
      
      const req = protocol.request({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'JL-Dashboard-LinkChecker/1.0'
        }
      }, (res) => {
        const statusCode = res.statusCode;
        let status = 'error';
        
        if (statusCode >= 200 && statusCode < 400) {
          status = 'ok';
        } else if (statusCode === 401 || statusCode === 403) {
          status = 'auth';
        }
        
        resolve({ statusCode, status });
      });
      
      req.on('error', () => {
        resolve({ statusCode: 0, status: 'error' });
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve({ statusCode: 0, status: 'timeout' });
      });
      
      req.end();
    } catch (error) {
      resolve({ statusCode: 0, status: 'error' });
    }
  });
}

// API: Verify all quick links
app.get('/api/verify-links', async (req, res) => {
  const results = {
    timestamp: new Date().toISOString(),
    passed: 0,
    authRequired: 0,
    failed: 0,
    links: []
  };
  
  // Check all links in parallel
  const checks = QUICK_LINKS.map(async (link) => {
    const result = await checkUrl(link.url);
    
    const linkResult = {
      id: link.id,
      name: link.name,
      url: link.url,
      category: link.category,
      statusCode: result.statusCode,
      status: result.status
    };
    
    if (result.status === 'ok') {
      results.passed++;
    } else if (result.status === 'auth') {
      results.authRequired++;
    } else {
      results.failed++;
    }
    
    return linkResult;
  });
  
  results.links = await Promise.all(checks);
  
  // Calculate overall status
  if (results.failed > 0) {
    results.overallStatus = 'error';
  } else if (results.authRequired > 0) {
    results.overallStatus = 'warning';
  } else {
    results.overallStatus = 'ok';
  }
  
  res.json(results);
});

// API: Get quick links configuration
app.get('/api/links', (req, res) => {
  res.json(QUICK_LINKS);
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log(`║       JL Dev Environment Dashboard v${PROJECT_VERSION}                    ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`  Project: ${PROJECT_NAME}`);
  console.log(`  Dashboard running at: http://localhost:${PORT}`);
  console.log(`  Projects base: ${PROJECTS_BASE}`);
  console.log('');
  console.log('  Press Ctrl+C to stop');
  console.log('');
});

