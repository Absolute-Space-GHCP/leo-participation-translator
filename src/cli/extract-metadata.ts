/**
 * @file extract-metadata.ts
 * @description Extract structured metadata from Creator and Media markdown files
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-05
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

// ============================================================================
// Types
// ============================================================================

interface Creator {
  name: string;
  category?: string;
  description?: string;
  platforms: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
  context?: string; // Which brand/campaign
  notes?: string;
}

interface MediaIdea {
  title: string;
  platform: string;
  description: string;
  timing?: string;
  cost?: string;
  context?: string; // Which brand/campaign
  notes?: string;
}

// ============================================================================
// Extraction Logic
// ============================================================================

/**
 * Extract creators from markdown content
 */
function extractCreators(content: string): Creator[] {
  const creators: Creator[] = [];
  
  // Pattern to find creator names with follower counts
  // e.g., "Rianne Meijer" followed by follower info
  const creatorPatterns = [
    // Pattern: Name with @handle and follower counts
    /(?:^|\n)(?:###\s*Slide\s+\d+[\s\S]*?)?([\w\s]+?)\s+(?:Our ideal|She|He|They|A |An |is a|known for|Breaking|has gained|is known|Bringing|Trailblazer|carving|Down-to-earth|Recently|Rising|Broke through)[\s\S]*?(?:Links:|IG:|Instagram:|TikTok:|YouTube:|Followers)[\s\S]*?(?:(\d+(?:\.\d+)?[KMkm])\s*(?:followers)?)/gi,
    
    // Pattern: @handle mention with followers
    /@([\w\.]+)[\s\S]*?(\d+(?:\.\d+)?[KMkm])\s*(?:followers)?/gi,
    
    // Pattern: Name followed by specific follower format "IG: 1.5M"
    /(?:^|\n)([\w\s]+?)\s+(?:Links:\s*)?(?:IG:\s*(\d+(?:\.\d+)?[KMkm]))?(?:\s*YT:\s*(\d+(?:\.\d+)?[KMkm]))?(?:\s*Tik:\s*(\d+(?:\.\d+)?[KMkm]))?/gi,
  ];

  // Simpler pattern matching for key creators
  const lines = content.split('\n');
  let currentSlide = '';
  let currentContext = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track slide context
    if (line.startsWith('### Slide')) {
      currentSlide = line;
      // Look ahead to get context
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].includes('Uber') || lines[j].includes('Oscar') || 
            lines[j].includes('Papa Johns') || lines[j].includes('Philly')) {
          currentContext = lines[j].match(/(Uber|Oscar|Papa Johns|Philly|U4T)/i)?.[1] || '';
          break;
        }
      }
    }
    
    // Look for creator patterns
    // Pattern: "Name" followed by IG:/YT:/Tik: stats
    const statsMatch = line.match(/^([\w\s\.]+?)\s*(?:Links:\s*)?IG:\s*(\d+(?:\.\d+)?[KMkm])/i);
    if (statsMatch) {
      const name = statsMatch[1].trim();
      if (name.length > 2 && name.length < 50 && !name.includes('###')) {
        const creator: Creator = {
          name,
          category: detectCategory(lines.slice(Math.max(0, i - 10), i + 5).join(' ')),
          platforms: {
            instagram: statsMatch[2],
          },
          context: currentContext,
        };
        
        // Check for other platforms on same or next line
        const nextLines = lines.slice(i, i + 3).join(' ');
        const ytMatch = nextLines.match(/YT:\s*(\d+(?:\.\d+)?[KMkm])/i);
        const tikMatch = nextLines.match(/Tik:\s*(\d+(?:\.\d+)?[KMkm])/i);
        
        if (ytMatch) creator.platforms.youtube = ytMatch[1];
        if (tikMatch) creator.platforms.tiktok = tikMatch[1];
        
        creators.push(creator);
      }
    }
    
    // Pattern: Celebrity names with kids listed
    const celebrityMatch = line.match(/([\w\s]+?)\s+(?:Kids:|Children:)/i);
    if (celebrityMatch && line.includes('(')) {
      const name = celebrityMatch[1].trim();
      if (name.length > 2 && name.length < 40) {
        const existingCreator = creators.find(c => c.name === name);
        if (!existingCreator) {
          creators.push({
            name,
            category: 'Celebrity',
            description: 'Celebrity parent',
            platforms: {},
            context: currentContext,
          });
        }
      }
    }
    
    // Pattern: @handle in text
    const handleMatches = line.matchAll(/@([\w\.]+)/g);
    for (const match of handleMatches) {
      const handle = match[1];
      if (handle.length > 2 && !handle.includes('http')) {
        const existingCreator = creators.find(c => 
          c.name.toLowerCase().includes(handle.toLowerCase()) ||
          Object.values(c.platforms).some(p => p?.toLowerCase().includes(handle.toLowerCase()))
        );
        if (!existingCreator) {
          // Look for follower counts nearby
          const surroundingText = lines.slice(Math.max(0, i - 2), i + 3).join(' ');
          const followerMatch = surroundingText.match(/(\d+(?:\.\d+)?[KMkm])\s*(?:followers|Followers)?/);
          
          creators.push({
            name: `@${handle}`,
            category: detectCategory(surroundingText),
            platforms: {
              instagram: followerMatch?.[1],
            },
            context: currentContext,
          });
        }
      }
    }
  }
  
  // Deduplicate by name
  const uniqueCreators = new Map<string, Creator>();
  for (const creator of creators) {
    const key = creator.name.toLowerCase().replace(/[^a-z]/g, '');
    if (!uniqueCreators.has(key)) {
      uniqueCreators.set(key, creator);
    }
  }
  
  return Array.from(uniqueCreators.values());
}

/**
 * Detect creator category from surrounding text
 */
function detectCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('beauty') || lowerText.includes('makeup') || lowerText.includes('cosmetic')) {
    return 'Beauty';
  }
  if (lowerText.includes('food') || lowerText.includes('cooking') || lowerText.includes('chef') || lowerText.includes('recipe')) {
    return 'Food';
  }
  if (lowerText.includes('lifestyle')) {
    return 'Lifestyle';
  }
  if (lowerText.includes('celebrity') || lowerText.includes('actor') || lowerText.includes('actress') || lowerText.includes('singer')) {
    return 'Celebrity';
  }
  if (lowerText.includes('gaming') || lowerText.includes('gamer')) {
    return 'Gaming';
  }
  if (lowerText.includes('fashion') || lowerText.includes('style')) {
    return 'Fashion';
  }
  if (lowerText.includes('music') || lowerText.includes('musician') || lowerText.includes('artist')) {
    return 'Music';
  }
  if (lowerText.includes('sports') || lowerText.includes('nfl') || lowerText.includes('nba')) {
    return 'Sports';
  }
  if (lowerText.includes('parenting') || lowerText.includes('mom') || lowerText.includes('dad')) {
    return 'Parenting';
  }
  if (lowerText.includes('teen') || lowerText.includes('influencer')) {
    return 'Teen Influencer';
  }
  
  return 'General';
}

/**
 * Extract media ideas from markdown content
 */
function extractMediaIdeas(content: string): MediaIdea[] {
  const ideas: MediaIdea[] = [];
  
  // Split by slide headers
  const slides = content.split(/### Slide \d+/);
  
  for (const slide of slides) {
    if (!slide.trim() || slide.length < 50) continue;
    
    const lines = slide.split('\n').filter(l => l.trim() && !l.startsWith('---') && !l.startsWith('> **Speaker'));
    if (lines.length === 0) continue;
    
    // Extract title - first line with significant content, or ALL CAPS line
    let title = '';
    let descriptionStart = 0;
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      // Check for ALL CAPS title
      if (line === line.toUpperCase() && line.length > 5 && line.length < 80) {
        title = line;
        descriptionStart = i + 1;
        break;
      }
      // Or use first substantial line
      if (!title && line.length > 10 && line.length < 100 && !line.includes('TIMING') && !line.includes('COST')) {
        title = line.replace(/[‹›#]/g, '').trim();
        descriptionStart = i + 1;
      }
    }
    
    if (!title) {
      title = lines[0]?.replace(/[‹›#]/g, '').trim().slice(0, 80) || 'Untitled';
      descriptionStart = 1;
    }
    
    // Extract other fields from full slide text
    const fullText = slide;
    
    const timingMatch = fullText.match(/TIMING:\s*([^\n]+)/i);
    const costMatch = fullText.match(/COST:\s*([^\n]+)/i);
    
    // Detect platform
    let platform = detectPlatform(fullText);
    
    // Detect context
    let context = '';
    if (fullText.includes('Oscar')) context = 'Oscar Mayer';
    else if (fullText.includes('Papa Johns') || fullText.includes('Papa John')) context = 'Papa Johns';
    else if (fullText.includes('Uber')) context = 'Uber';
    else if (fullText.includes('Philly') || fullText.includes('Philadelphia')) context = 'Philadelphia Cream Cheese';
    
    // Build description from remaining lines
    const descLines = lines.slice(descriptionStart).filter(l => 
      !l.match(/^TIMING:|^COST:|^TO LIVE ON|^R&R/i) &&
      l.length > 10
    );
    const description = descLines.join(' ').slice(0, 500);
    
    if (description.length > 20) {
      ideas.push({
        title,
        platform,
        description,
        timing: timingMatch?.[1]?.trim() || '',
        cost: costMatch?.[1]?.trim() || '',
        context,
      });
    }
  }
  
  return ideas;
}

/**
 * Detect platform from text
 */
function detectPlatform(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('tiktok')) return 'TikTok';
  if (lower.includes('instagram') || lower.includes('reels')) return 'Instagram';
  if (lower.includes('reddit')) return 'Reddit';
  if (lower.includes('youtube')) return 'YouTube';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'Twitter/X';
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('tv') || lower.includes('broadcast')) return 'TV/Broadcast';
  return 'Multi-Platform';
}

/**
 * Convert creators to CSV
 */
function creatorsToCSV(creators: Creator[]): string {
  const headers = ['Name', 'Category', 'Instagram', 'TikTok', 'YouTube', 'Twitter', 'Context', 'Notes'];
  const rows = creators.map(c => [
    c.name,
    c.category || '',
    c.platforms.instagram || '',
    c.platforms.tiktok || '',
    c.platforms.youtube || '',
    c.platforms.twitter || '',
    c.context || '',
    c.notes || '',
  ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
  
  return [headers.join(','), ...rows].join('\n');
}

/**
 * Convert media ideas to CSV
 */
function mediaIdeasToCSV(ideas: MediaIdea[]): string {
  const headers = ['Title', 'Platform', 'Description', 'Timing', 'Cost', 'Context'];
  const rows = ideas.map(i => [
    i.title,
    i.platform,
    i.description.slice(0, 300), // Truncate for CSV readability
    i.timing || '',
    i.cost || '',
    i.context || '',
  ].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
  
  return [headers.join(','), ...rows].join('\n');
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('\n📊 Structured Metadata Extraction\n');
  console.log('──────────────────────────────────────────────────');
  
  const dataDir = join(process.cwd(), 'data');
  const mdDir = join(dataDir, 'markdown');
  const outputDir = join(dataDir, 'metadata');
  
  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });
  
  // Process Creators
  console.log('\n📁 Processing: creators.md');
  try {
    const creatorsContent = await readFile(join(mdDir, 'creators.md'), 'utf-8');
    const creators = extractCreators(creatorsContent);
    
    console.log(`   Found ${creators.length} creators`);
    
    // Save as JSON
    const creatorsJsonPath = join(outputDir, 'creators.json');
    await writeFile(creatorsJsonPath, JSON.stringify(creators, null, 2));
    console.log(`   ✅ Saved: ${creatorsJsonPath}`);
    
    // Save as CSV
    const creatorsCsvPath = join(outputDir, 'creators.csv');
    await writeFile(creatorsCsvPath, creatorsToCSV(creators));
    console.log(`   ✅ Saved: ${creatorsCsvPath}`);
    
    // Show sample
    console.log('\n   Sample creators:');
    for (const c of creators.slice(0, 5)) {
      console.log(`   - ${c.name} (${c.category || 'Unknown'}) - IG: ${c.platforms.instagram || 'N/A'}`);
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
  }
  
  // Process Media Options
  console.log('\n📁 Processing: media.md');
  try {
    const mediaContent = await readFile(join(mdDir, 'media.md'), 'utf-8');
    const mediaIdeas = extractMediaIdeas(mediaContent);
    
    console.log(`   Found ${mediaIdeas.length} media ideas`);
    
    // Save as JSON
    const mediaJsonPath = join(outputDir, 'media-ideas.json');
    await writeFile(mediaJsonPath, JSON.stringify(mediaIdeas, null, 2));
    console.log(`   ✅ Saved: ${mediaJsonPath}`);
    
    // Save as CSV
    const mediaCsvPath = join(outputDir, 'media-ideas.csv');
    await writeFile(mediaCsvPath, mediaIdeasToCSV(mediaIdeas));
    console.log(`   ✅ Saved: ${mediaCsvPath}`);
    
    // Show sample
    console.log('\n   Sample media ideas:');
    for (const m of mediaIdeas.slice(0, 5)) {
      console.log(`   - ${m.title.slice(0, 50)} (${m.platform})`);
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error}`);
  }
  
  console.log('\n──────────────────────────────────────────────────');
  console.log('✨ Metadata extraction complete!\n');
}

main().catch(console.error);
