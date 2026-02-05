/**
 * @file server.js
 * @description Progress Dashboard Server for The Participation Translator
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Load tasks data
function loadTasks() {
  const tasksPath = path.join(__dirname, 'tasks.json');
  const data = fs.readFileSync(tasksPath, 'utf-8');
  return JSON.parse(data);
}

// Calculate overall progress
function calculateOverallProgress(phases) {
  const totalTasks = phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = phases.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'complete').length, 0);
  return Math.round((completedTasks / totalTasks) * 100);
}

// Generate HTML
function generateHTML(data) {
  const overallProgress = calculateOverallProgress(data.phases);
  const totalTasks = data.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = data.phases.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'complete').length, 0);
  const inProgressTasks = data.phases.reduce((sum, p) => 
    sum + p.tasks.filter(t => t.status === 'in_progress').length, 0);
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Participation Translator - Progress Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 2rem;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #334155;
    }
    .header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header .version {
      background: #334155;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .header .updated {
      color: #94a3b8;
      font-size: 0.875rem;
    }
    
    /* Overview Cards */
    .overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.25rem;
    }
    .card-label {
      color: #94a3b8;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .card-value {
      font-size: 2rem;
      font-weight: 700;
    }
    .card-value.green { color: #4ade80; }
    .card-value.blue { color: #60a5fa; }
    .card-value.yellow { color: #facc15; }
    .card-value.purple { color: #a78bfa; }
    
    /* Overall Progress */
    .overall-progress {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .overall-progress h2 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }
    .progress-bar-container {
      background: #334155;
      border-radius: 9999px;
      height: 1.5rem;
      overflow: hidden;
      position: relative;
    }
    .progress-bar {
      background: linear-gradient(90deg, #4ade80, #60a5fa);
      height: 100%;
      border-radius: 9999px;
      transition: width 0.5s ease;
    }
    .progress-text {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    /* Phases */
    .phases { margin-bottom: 2rem; }
    .phases h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
    .phase {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .phase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .phase-header:hover { background: #334155; }
    .phase-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .phase-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .phase-badge.complete { background: #166534; color: #4ade80; }
    .phase-badge.in_progress { background: #1e40af; color: #60a5fa; }
    .phase-badge.pending { background: #374151; color: #9ca3af; }
    .phase-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .phase-progress-bar {
      width: 120px;
      height: 8px;
      background: #334155;
      border-radius: 9999px;
      overflow: hidden;
    }
    .phase-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4ade80, #60a5fa);
      border-radius: 9999px;
    }
    .phase-progress-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #94a3b8;
      min-width: 3rem;
    }
    .phase-tasks {
      display: none;
      padding: 0 1.25rem 1.25rem;
    }
    .phase.expanded .phase-tasks { display: block; }
    .task {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #334155;
    }
    .task:last-child { border-bottom: none; }
    .task-status {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    .task-status.complete { background: #166534; color: #4ade80; }
    .task-status.in_progress { background: #1e40af; color: #60a5fa; }
    .task-status.pending { background: #374151; color: #6b7280; }
    .task-name { flex: 1; }
    .task-notes {
      color: #64748b;
      font-size: 0.75rem;
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    
    /* Testing Section */
    .testing {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .testing h2 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    .test-method {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .test-method h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .test-method p {
      color: #94a3b8;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }
    .test-coverage {
      list-style: none;
    }
    .test-coverage li {
      font-size: 0.8rem;
      color: #64748b;
      padding: 0.25rem 0;
      padding-left: 1rem;
      position: relative;
    }
    .test-coverage li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #475569;
    }
    
    /* Metrics */
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .metric {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
    }
    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #60a5fa;
    }
    .metric-label {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      color: #64748b;
      font-size: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #334155;
    }
    .footer a { color: #60a5fa; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
    
    /* Expand icon */
    .expand-icon {
      transition: transform 0.2s;
    }
    .phase.expanded .expand-icon {
      transform: rotate(180deg);
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div>
        <h1>🎯 The Participation Translator</h1>
        <p class="updated">Last updated: ${data.project.lastUpdated}</p>
      </div>
      <span class="version">v${data.project.version}</span>
    </header>
    
    <section class="overview">
      <div class="card">
        <div class="card-label">Overall Progress</div>
        <div class="card-value blue">${overallProgress}%</div>
      </div>
      <div class="card">
        <div class="card-label">Completed</div>
        <div class="card-value green">${completedTasks}</div>
      </div>
      <div class="card">
        <div class="card-label">In Progress</div>
        <div class="card-value yellow">${inProgressTasks}</div>
      </div>
      <div class="card">
        <div class="card-label">Pending</div>
        <div class="card-value purple">${pendingTasks}</div>
      </div>
      <div class="card">
        <div class="card-label">Total Tasks</div>
        <div class="card-value">${totalTasks}</div>
      </div>
    </section>
    
    <section class="overall-progress">
      <h2>Project Completion</h2>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${overallProgress}%"></div>
        <span class="progress-text">${completedTasks} / ${totalTasks} tasks</span>
      </div>
    </section>
    
    <section class="metrics">
      <div class="metric">
        <div class="metric-value">${data.metrics.documentsIndexed}</div>
        <div class="metric-label">Documents Indexed</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.metrics.totalChunks.toLocaleString()}</div>
        <div class="metric-label">Vector Chunks</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.metrics.creatorsExtracted}</div>
        <div class="metric-label">Creators</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.metrics.mediaIdeasExtracted}</div>
        <div class="metric-label">Media Ideas</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.metrics.culturalAPIs}</div>
        <div class="metric-label">Cultural APIs</div>
      </div>
      <div class="metric">
        <div class="metric-value">${data.metrics.cliTools}</div>
        <div class="metric-label">CLI Tools</div>
      </div>
    </section>
    
    <section class="phases">
      <h2>📋 Implementation Phases</h2>
      ${data.phases.map(phase => {
        const completedCount = phase.tasks.filter(t => t.status === 'complete').length;
        const totalCount = phase.tasks.length;
        return `
        <div class="phase" onclick="this.classList.toggle('expanded')">
          <div class="phase-header">
            <div class="phase-title">
              <span class="phase-badge ${phase.status}">${phase.status.replace('_', ' ')}</span>
              <strong>${phase.name}</strong>
              <span style="color: #64748b; font-size: 0.875rem;">${phase.description}</span>
            </div>
            <div class="phase-progress">
              <div class="phase-progress-bar">
                <div class="phase-progress-fill" style="width: ${phase.progress}%"></div>
              </div>
              <span class="phase-progress-text">${completedCount}/${totalCount}</span>
              <svg class="expand-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="phase-tasks">
            ${phase.tasks.map(task => `
              <div class="task">
                <div class="task-status ${task.status}">${task.status === 'complete' ? '✓' : task.status === 'in_progress' ? '◐' : '○'}</div>
                <span class="task-name">${task.name}</span>
                <span class="task-notes" title="${task.notes}">${task.notes}</span>
              </div>
            `).join('')}
          </div>
        </div>
        `;
      }).join('')}
    </section>
    
    <section class="testing">
      <h2>🧪 Testing Methodologies</h2>
      <div class="test-grid">
        ${data.testing.methodologies.map(method => `
          <div class="test-method">
            <h3>
              <span class="phase-badge ${method.status}">${method.status}</span>
              ${method.name}
            </h3>
            <p>${method.description}</p>
            <ul class="test-coverage">
              ${method.coverage.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </section>
    
    <footer class="footer">
      <p>Participation Translator Progress Dashboard</p>
      <p>Access: Leo, Charley, Maggie | <a href="${data.project.repository}" target="_blank">GitHub Repository</a></p>
      <p style="margin-top: 0.5rem;">Author: Charley Scholz, JLIT | Co-authored: Claude Opus 4.5</p>
    </footer>
  </div>
</body>
</html>`;
}

// Create server
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    try {
      const data = loadTasks();
      const html = generateHTML(data);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading dashboard: ' + error.message);
    }
  } else if (req.url === '/api/tasks') {
    try {
      const data = loadTasks();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🎯 Participation Translator Dashboard`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/tasks`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
