/**
 * JL Dev Environment Dashboard - Frontend App
 * ============================================================================
 * Version:     1.2.0
 * Updated:     2025-12-09
 * Purpose:     Frontend JavaScript for dashboard interactivity
 * ============================================================================
 */

// Configuration
const CONFIG = {
  refreshInterval: 30000, // 30 seconds
  apiBase: ''
};

// State
let refreshTimer = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  loadProjectInfo();
  loadAllData();
  startAutoRefresh();
  
  // Manual refresh button
  document.getElementById('refresh-btn').addEventListener('click', () => {
    loadAllData();
  });
  
  // Verify links button
  document.getElementById('verify-links-btn').addEventListener('click', () => {
    verifyLinks();
  });
  
  // Close verification results
  document.getElementById('close-verification').addEventListener('click', () => {
    document.getElementById('link-verification-results').classList.add('hidden');
    document.getElementById('verify-status').className = 'verify-status';
  });
});

// Load project info (version, name)
async function loadProjectInfo() {
  try {
    const response = await fetch('/api/project');
    const data = await response.json();
    
    const versionBadge = document.getElementById('project-version');
    if (versionBadge && data.version) {
      versionBadge.textContent = `v${data.version}`;
    }
  } catch (error) {
    console.warn('Could not load project info:', error);
  }
}

// Start auto-refresh
function startAutoRefresh() {
  refreshTimer = setInterval(() => {
    loadAllData();
  }, CONFIG.refreshInterval);
}

// Load all data
async function loadAllData() {
  updateLastRefresh();
  
  await Promise.all([
    loadSystemInfo(),
    loadRuntimes(),
    loadPackages(),
    loadDevOps(),
    loadAuth(),
    loadAI(),
    loadRepos()
  ]);
  
  updateOverallStatus();
}

// Update last refresh timestamp
function updateLastRefresh() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  document.getElementById('last-updated').textContent = `Last updated: ${timeStr}`;
}

// Load system info
async function loadSystemInfo() {
  try {
    const response = await fetch('/api/system');
    const data = await response.json();
    
    const infoStr = `${data.hostname} • macOS ${data.release} • ${data.chip} • ${data.memory} RAM • Up ${data.uptime}`;
    document.getElementById('system-info').textContent = infoStr;
  } catch (error) {
    document.getElementById('system-info').textContent = 'Failed to load system info';
  }
}

// Load runtimes
async function loadRuntimes() {
  try {
    const response = await fetch('/api/runtimes');
    const data = await response.json();
    
    const container = document.getElementById('runtimes-content');
    container.innerHTML = Object.values(data).map(item => `
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${item.status}"></span>
          <span class="status-name">${item.name}</span>
        </div>
        <span class="status-value ${item.version ? 'highlight' : ''}">${item.version || 'Not installed'}</span>
      </div>
    `).join('');
    
    updateSectionStatus('runtimes', data);
  } catch (error) {
    document.getElementById('runtimes-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Load package managers
async function loadPackages() {
  try {
    const response = await fetch('/api/packages');
    const data = await response.json();
    
    const container = document.getElementById('packages-content');
    container.innerHTML = Object.values(data).map(item => `
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${item.status}"></span>
          <span class="status-name">${item.name}</span>
        </div>
        <span class="status-value ${item.installed ? 'highlight' : ''}">${item.version || 'Not installed'}</span>
      </div>
    `).join('');
    
    updateSectionStatus('packages', data);
  } catch (error) {
    document.getElementById('packages-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Load DevOps tools
async function loadDevOps() {
  try {
    const response = await fetch('/api/devops');
    const data = await response.json();
    
    const container = document.getElementById('devops-content');
    container.innerHTML = Object.values(data).map(item => {
      let statusText = item.version || 'Not installed';
      let extraInfo = '';
      
      if (item.name === 'Docker') {
        if (!item.installed) {
          statusText = 'Not installed';
        } else if (!item.running) {
          statusText = 'Not running';
        } else {
          statusText = item.version;
          extraInfo = ` (${item.containers} containers, ${item.images} images)`;
        }
      }
      
      return `
        <div class="status-item">
          <div class="status-item-left">
            <span class="status-indicator ${item.status}"></span>
            <span class="status-name">${item.name}</span>
          </div>
          <span class="status-value ${item.installed ? 'highlight' : ''}">${statusText}${extraInfo}</span>
        </div>
      `;
    }).join('');
    
    updateSectionStatus('devops', data);
  } catch (error) {
    document.getElementById('devops-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Load authentication status
async function loadAuth() {
  try {
    const response = await fetch('/api/auth');
    const data = await response.json();
    
    const container = document.getElementById('auth-content');
    container.innerHTML = `
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.github.status}"></span>
          <span class="status-name">GitHub</span>
        </div>
        <span class="status-value ${data.github.authenticated ? 'highlight' : ''}">${data.github.account || 'Not authenticated'}</span>
      </div>
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.gcloud.status}"></span>
          <span class="status-name">Google Cloud</span>
        </div>
        <span class="status-value ${data.gcloud.authenticated ? 'highlight' : ''}">${data.gcloud.account || 'Not authenticated'}</span>
      </div>
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.adc.status}"></span>
          <span class="status-name">GCP ADC</span>
        </div>
        <span class="status-value ${data.adc.configured ? 'highlight' : ''}">${data.adc.configured ? 'Configured' : 'Not configured'}</span>
      </div>
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.gcpProject.status}"></span>
          <span class="status-name">GCP Project</span>
        </div>
        <span class="status-value highlight">${data.gcpProject.project}</span>
      </div>
    `;
    
    updateSectionStatus('auth', data);
  } catch (error) {
    document.getElementById('auth-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Load AI tools
async function loadAI() {
  try {
    const response = await fetch('/api/ai');
    const data = await response.json();
    
    const container = document.getElementById('ai-content');
    container.innerHTML = `
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.cursor.status}"></span>
          <span class="status-name">Cursor IDE</span>
        </div>
        <span class="status-value ${data.cursor.installed ? 'highlight' : ''}">${data.cursor.installed ? 'Installed' : 'Not installed'}</span>
      </div>
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.continue.status}"></span>
          <span class="status-name">Continue (Gemini)</span>
        </div>
        <span class="status-value ${data.continue.configured ? 'highlight' : ''}">${data.continue.configured ? 'Configured' : 'Not configured'}</span>
      </div>
      <div class="status-item">
        <div class="status-item-left">
          <span class="status-indicator ${data.claude.status}"></span>
          <span class="status-name">Claude CLI</span>
        </div>
        <span class="status-value ${data.claude.installed ? 'highlight' : ''}">${data.claude.installed ? 'Installed' : 'Not installed'}</span>
      </div>
    `;
    
    updateSectionStatus('ai', data);
  } catch (error) {
    document.getElementById('ai-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Load repositories
async function loadRepos() {
  try {
    const response = await fetch('/api/repos');
    const data = await response.json();
    
    const container = document.getElementById('repos-content');
    container.innerHTML = Object.values(data).map(repo => {
      // Determine status text
      let statusText = '';
      if (!repo.exists) {
        statusText = '<span class="repo-not-found">Not found</span>';
      } else if (repo.clean) {
        statusText = '<span class="repo-clean">✓ Clean</span>';
      } else {
        statusText = '<span class="repo-dirty">● Uncommitted changes</span>';
      }
      
      return `
        <div class="repo-item">
          <div class="repo-info">
            <span class="status-indicator ${repo.status}"></span>
            <span class="repo-name">${repo.name}</span>
            ${repo.exists ? `<span class="repo-branch">${repo.branch}</span>` : ''}
          </div>
          <div class="repo-status">
            ${statusText}
          </div>
        </div>
      `;
    }).join('');
    
    updateSectionStatus('repos', data);
  } catch (error) {
    document.getElementById('repos-content').innerHTML = '<div class="loading">Failed to load</div>';
  }
}

// Update section status indicator
function updateSectionStatus(section, data) {
  const statuses = Object.values(data).map(item => item.status);
  const hasError = statuses.includes('error');
  const hasWarning = statuses.includes('warning');
  
  const indicator = document.querySelector(`.section-status[data-section="${section}"]`);
  if (indicator) {
    indicator.className = `section-status ${hasError ? 'error' : (hasWarning ? 'warning' : 'ok')}`;
  }
}

// Update overall status
function updateOverallStatus() {
  const allIndicators = document.querySelectorAll('.section-status');
  const statuses = Array.from(allIndicators).map(el => {
    if (el.classList.contains('error')) return 'error';
    if (el.classList.contains('warning')) return 'warning';
    if (el.classList.contains('ok')) return 'ok';
    return 'loading';
  });
  
  const hasError = statuses.includes('error');
  const hasWarning = statuses.includes('warning');
  const isLoading = statuses.includes('loading');
  
  const badge = document.getElementById('overall-status');
  badge.className = 'status-badge';
  
  if (isLoading) {
    badge.classList.add('status-loading');
    badge.textContent = 'Checking...';
  } else if (hasError) {
    badge.classList.add('status-error');
    badge.textContent = 'Issues Detected';
  } else if (hasWarning) {
    badge.classList.add('status-warning');
    badge.textContent = 'Warnings';
  } else {
    badge.classList.add('status-ok');
    badge.textContent = 'All Systems Operational';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Link Verification
// ─────────────────────────────────────────────────────────────────────────────

// Verify all quick links
async function verifyLinks() {
  const btn = document.getElementById('verify-links-btn');
  const resultsPanel = document.getElementById('link-verification-results');
  const verifyStatus = document.getElementById('verify-status');
  
  // Show loading state
  btn.classList.add('checking');
  btn.querySelector('.verify-text').textContent = 'Checking...';
  
  try {
    const response = await fetch('/api/verify-links');
    const data = await response.json();
    
    // Update counts
    document.getElementById('verify-passed').textContent = `${data.passed} passed`;
    document.getElementById('verify-auth').textContent = `${data.authRequired} auth`;
    document.getElementById('verify-failed').textContent = `${data.failed} failed`;
    
    // Update status indicator
    verifyStatus.className = `verify-status ${data.overallStatus}`;
    
    // Build details grid
    const detailsContainer = document.getElementById('verification-details');
    detailsContainer.innerHTML = data.links.map(link => `
      <div class="verification-item">
        <span class="status-dot ${link.status}"></span>
        <span class="link-name" title="${link.url}">${link.name}</span>
        <span class="status-code">${link.statusCode || '---'}</span>
      </div>
    `).join('');
    
    // Show results panel
    resultsPanel.classList.remove('hidden');
    
    // Update link buttons with status indicators
    data.links.forEach(link => {
      const linkBtn = document.querySelector(`[data-link-id="${link.id}"]`);
      if (linkBtn) {
        linkBtn.classList.remove('link-ok', 'link-auth', 'link-error');
        linkBtn.classList.add(`link-${link.status}`);
      }
    });
    
  } catch (error) {
    console.error('Link verification failed:', error);
    verifyStatus.className = 'verify-status error';
  } finally {
    // Reset button
    btn.classList.remove('checking');
    btn.querySelector('.verify-text').textContent = 'Verify Links';
  }
}

