<#
.SYNOPSIS
    Claude Code Plugin Setup Script for Windows 11
.DESCRIPTION
    Automates the installation and configuration of Claude Code plugins.
.PARAMETER DryRun
    Show what would be done without making changes
.PARAMETER SkipTokens
    Skip GitHub and Slack token configuration
.PARAMETER Help
    Show this help message
.NOTES
    Version: 1.0.0
    Date: 2026-01-09
    Author: Johannes Leonardo Dev Team
#>

param(
    [switch]$DryRun,
    [switch]$SkipTokens,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$Version = "1.0.0"

# Core plugins
$CorePlugins = @("claude-mem", "typescript-lsp", "pyright-lsp")
# External plugins  
$ExternalPlugins = @("github", "slack")

# ============================================================================
# Helper Functions
# ============================================================================

function Write-ColorText {
    param([string]$Text, [string]$Color = "White")
    Write-Host $Text -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 65) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 65) -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([int]$Num, [string]$Desc)
    Write-Host "[$Num] " -ForegroundColor Yellow -NoNewline
    Write-Host $Desc
}

function Write-OK {
    param([string]$Msg)
    Write-Host "  [OK] " -ForegroundColor Green -NoNewline
    Write-Host $Msg
}

function Write-Warn {
    param([string]$Msg)
    Write-Host "  [!] " -ForegroundColor Yellow -NoNewline
    Write-Host $Msg -ForegroundColor Yellow
}

function Write-Err {
    param([string]$Msg)
    Write-Host "  [X] " -ForegroundColor Red -NoNewline
    Write-Host $Msg -ForegroundColor Red
}

function Write-Note {
    param([string]$Msg)
    Write-Host "  --> " -ForegroundColor Cyan -NoNewline
    Write-Host $Msg -ForegroundColor Gray
}

# ============================================================================
# Show Help
# ============================================================================

if ($Help) {
    Write-Header "Claude Code Setup Script v$Version"
    Write-Host "USAGE:"
    Write-Host "    .\claude-code-setup.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "OPTIONS:"
    Write-Host "    -DryRun       Show what would be done without making changes"
    Write-Host "    -SkipTokens   Skip GitHub and Slack token configuration"
    Write-Host "    -Help         Show this help message"
    Write-Host ""
    Write-Host "PLUGINS INSTALLED:"
    Write-Host "    Core: claude-mem, typescript-lsp, pyright-lsp"
    Write-Host "    External: github, slack"
    Write-Host ""
    Write-Host "REQUIREMENTS:"
    Write-Host "    - Claude CLI (npm install -g @anthropic-ai/claude-code)"
    Write-Host "    - GitHub Personal Access Token (optional)"
    Write-Host ""
    exit 0
}

# ============================================================================
# Main Script
# ============================================================================

Write-Header "Claude Code Setup Script v$Version"

if ($DryRun) {
    Write-ColorText "DRY RUN MODE - No changes will be made" "Yellow"
    Write-Host ""
}

# Step 1: Check Claude CLI
Write-Step 1 "Checking Claude CLI installation..."

$claudeExists = $null
try {
    $claudeExists = Get-Command claude -ErrorAction SilentlyContinue
} catch { }

if ($claudeExists) {
    $ver = claude --version 2>&1
    Write-OK "Claude CLI found: $ver"
}
else {
    Write-Warn "Claude CLI not found"
    Write-Note "Attempting to install..."
    
    $npmExists = $null
    try {
        $npmExists = Get-Command npm -ErrorAction SilentlyContinue
    } catch { }
    
    if (-not $npmExists) {
        Write-Err "npm not found. Please install Node.js first."
        Write-Note "Download from: https://nodejs.org/"
        exit 1
    }
    
    if (-not $DryRun) {
        try {
            npm install -g @anthropic-ai/claude-code
            Write-OK "Claude CLI installed successfully"
        }
        catch {
            Write-Err "Failed to install Claude CLI"
            exit 1
        }
    }
    else {
        Write-Note "[DRY RUN] Would run: npm install -g @anthropic-ai/claude-code"
    }
}

# Step 2: Add marketplaces
Write-Host ""
Write-Step 2 "Adding plugin marketplaces..."

$marketplaces = @(
    "https://registry.npmjs.org"
)

foreach ($mp in $marketplaces) {
    Write-Note "Adding: $mp"
    if (-not $DryRun) {
        try {
            $null = claude mcp add-registry $mp 2>&1
            Write-OK "Added marketplace"
        }
        catch {
            Write-Warn "Marketplace may already exist"
        }
    }
    else {
        Write-Note "[DRY RUN] Would add marketplace: $mp"
    }
}

# Step 3: Install core plugins
Write-Host ""
Write-Step 3 "Installing core plugins..."

foreach ($plugin in $CorePlugins) {
    Write-Note "Installing: $plugin"
    if (-not $DryRun) {
        try {
            $null = claude mcp install $plugin 2>&1
            Write-OK "Installed $plugin"
        }
        catch {
            Write-Warn "$plugin may already be installed"
        }
    }
    else {
        Write-Note "[DRY RUN] Would install: $plugin"
    }
}

# Step 4: Install external plugins
Write-Host ""
Write-Step 4 "Installing external plugins..."

foreach ($plugin in $ExternalPlugins) {
    Write-Note "Installing: $plugin"
    if (-not $DryRun) {
        try {
            $null = claude mcp install $plugin 2>&1
            Write-OK "Installed $plugin"
        }
        catch {
            Write-Warn "$plugin may already be installed"
        }
    }
    else {
        Write-Note "[DRY RUN] Would install: $plugin"
    }
}

# Step 5: Configure tokens
Write-Host ""
if (-not $SkipTokens) {
    Write-Step 5 "Configuring authentication..."
    
    Write-Host ""
    Write-Host "GitHub Token Configuration" -ForegroundColor Cyan
    Write-Host "Create a token at: https://github.com/settings/tokens/new"
    Write-Host "Required scopes: repo, read:org, user, project"
    Write-Host ""
    
    if (-not $DryRun) {
        $token = Read-Host -Prompt "Enter GitHub Personal Access Token (or press Enter to skip)" -AsSecureString
        $tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
        )
        
        if (-not [string]::IsNullOrWhiteSpace($tokenPlain)) {
            # Ensure profile exists
            $profileDir = Split-Path $PROFILE -Parent
            if (-not (Test-Path $profileDir)) {
                New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
            }
            if (-not (Test-Path $PROFILE)) {
                New-Item -ItemType File -Path $PROFILE -Force | Out-Null
            }
            
            # Add to profile
            $content = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
            if ($content -notmatch "GITHUB_TOKEN.*claude") {
                Add-Content -Path $PROFILE -Value ""
                Add-Content -Path $PROFILE -Value "# GitHub Token for Claude Code"
                Add-Content -Path $PROFILE -Value "`$env:GITHUB_TOKEN = `"$tokenPlain`""
            }
            $env:GITHUB_TOKEN = $tokenPlain
            Write-OK "GitHub token configured"
            $tokenPlain = $null
        }
        else {
            Write-Warn "Skipped GitHub token"
        }
    }
    else {
        Write-Note "[DRY RUN] Would prompt for GitHub token"
    }
}
else {
    Write-Step 5 "Skipping token configuration (-SkipTokens flag)"
}

# Final summary
Write-Header "Setup Complete!"

Write-Host "Claude Code plugins have been configured!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Restart your terminal (or run: . `$PROFILE)"
Write-Host "  2. Verify: claude --version"
Write-Host "  3. List plugins: claude mcp list"
Write-Host "  4. Test: cd your-project && claude"
Write-Host ""
Write-Host "TROUBLESHOOTING:" -ForegroundColor Cyan
Write-Host "  * If 'claude' not found: restart terminal"
Write-Host "  * If plugins fail: claude mcp install <plugin> --force"
Write-Host "  * Documentation: scripts/setup/README.md"
Write-Host ""

if ($DryRun) {
    Write-ColorText "[DRY RUN] No changes were made." "Yellow"
}

Write-Host "Done!" -ForegroundColor Green
