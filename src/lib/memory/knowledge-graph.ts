/**
 * @file knowledge-graph.ts
 * @description Knowledge graph for JL institutional memory - patterns, campaigns, and relationships
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

// ===========================================
// Types
// ===========================================

/**
 * Node types in the JL knowledge graph
 */
export type JLNodeType = 
  | 'pattern'          // Strategic pattern (e.g., "Think Small", "Cultural Hijack")
  | 'campaign'         // Specific campaign
  | 'tactic'           // Tactical execution
  | 'cultural_moment'  // Cultural context/moment leveraged
  | 'brand'            // Client brand
  | 'framework_section'; // 8-Part Framework section

/**
 * Edge types representing relationships
 */
export type JLEdgeType =
  | 'used_in'          // Pattern used in campaign
  | 'similar_to'       // Similar approaches
  | 'evolved_from'     // Pattern evolution
  | 'counters'         // Counters negative perception
  | 'leverages'        // Leverages cultural moment
  | 'maps_to';         // Maps to framework section

/**
 * A node in the knowledge graph
 */
export interface KnowledgeNode {
  id: string;
  type: JLNodeType;
  label: string;
  data: {
    client?: string;
    year?: number;
    frameworkSection?: number;  // 1-9 for framework sections
    effectiveness?: number;     // 0-1 score if measured
    description?: string;
    sourceDocuments?: string[];
  };
  createdAt: Date;
}

/**
 * An edge connecting two nodes
 */
export interface KnowledgeEdge {
  from: string;
  to: string;
  type: JLEdgeType;
  weight: number;  // Strength of relationship (0-1)
  metadata?: Record<string, unknown>;
}

/**
 * Export format for persistence
 */
export interface GraphExport {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  metadata: {
    exportedAt: Date;
    nodeCount: number;
    edgeCount: number;
    version: string;
  };
}

// ===========================================
// Knowledge Graph Class
// ===========================================

export class KnowledgeGraph {
  private nodes: Map<string, KnowledgeNode> = new Map();
  private edges: KnowledgeEdge[] = [];

  /**
   * Add a node to the graph
   */
  addNode(node: KnowledgeNode): void {
    this.nodes.set(node.id, node);
  }

  /**
   * Add an edge between nodes
   */
  addEdge(edge: KnowledgeEdge): void {
    if (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) {
      throw new Error(`Cannot add edge: nodes ${edge.from} or ${edge.to} do not exist`);
    }
    this.edges.push(edge);
  }

  /**
   * Get node by ID
   */
  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get all nodes of a specific type
   */
  getNodesByType(type: JLNodeType): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter(n => n.type === type);
  }

  /**
   * Get all patterns
   */
  getPatterns(): KnowledgeNode[] {
    return this.getNodesByType('pattern');
  }

  /**
   * Get all campaigns
   */
  getCampaigns(): KnowledgeNode[] {
    return this.getNodesByType('campaign');
  }

  /**
   * Get edges for a specific node
   */
  getEdgesFor(nodeId: string): KnowledgeEdge[] {
    return this.edges.filter(e => e.from === nodeId || e.to === nodeId);
  }

  /**
   * Get connected nodes (neighbors)
   */
  getConnected(nodeId: string): KnowledgeNode[] {
    const edges = this.getEdgesFor(nodeId);
    const connectedIds = new Set<string>();
    
    for (const edge of edges) {
      if (edge.from === nodeId) connectedIds.add(edge.to);
      if (edge.to === nodeId) connectedIds.add(edge.from);
    }

    return Array.from(connectedIds)
      .map(id => this.nodes.get(id))
      .filter((n): n is KnowledgeNode => n !== undefined);
  }

  /**
   * Find patterns used in a specific campaign
   */
  getPatternsForCampaign(campaignId: string): KnowledgeNode[] {
    const edges = this.edges.filter(
      e => e.to === campaignId && e.type === 'used_in'
    );
    return edges
      .map(e => this.nodes.get(e.from))
      .filter((n): n is KnowledgeNode => n !== undefined && n.type === 'pattern');
  }

  /**
   * Find campaigns that used a specific pattern
   */
  getCampaignsUsingPattern(patternId: string): KnowledgeNode[] {
    const edges = this.edges.filter(
      e => e.from === patternId && e.type === 'used_in'
    );
    return edges
      .map(e => this.nodes.get(e.to))
      .filter((n): n is KnowledgeNode => n !== undefined && n.type === 'campaign');
  }

  /**
   * Find patterns similar to a given pattern
   */
  getSimilarPatterns(patternId: string): KnowledgeNode[] {
    const edges = this.edges.filter(
      e => (e.from === patternId || e.to === patternId) && e.type === 'similar_to'
    );
    const similarIds = edges.map(e => 
      e.from === patternId ? e.to : e.from
    );
    return similarIds
      .map(id => this.nodes.get(id))
      .filter((n): n is KnowledgeNode => n !== undefined);
  }

  /**
   * Search nodes by label (case-insensitive)
   */
  searchNodes(query: string): KnowledgeNode[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.nodes.values()).filter(
      n => n.label.toLowerCase().includes(lowerQuery) ||
           n.data.description?.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Find path between two nodes using BFS
   */
  findPath(fromId: string, toId: string): KnowledgeNode[] | null {
    if (!this.nodes.has(fromId) || !this.nodes.has(toId)) return null;
    if (fromId === toId) return [this.nodes.get(fromId)!];

    const visited = new Set<string>();
    const queue: { nodeId: string; path: string[] }[] = [
      { nodeId: fromId, path: [fromId] }
    ];

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const connected = this.getConnected(nodeId);
      for (const node of connected) {
        if (node.id === toId) {
          return [...path, toId].map(id => this.nodes.get(id)!);
        }
        if (!visited.has(node.id)) {
          queue.push({ nodeId: node.id, path: [...path, node.id] });
        }
      }
    }

    return null;
  }

  /**
   * Get framework section coverage for a campaign
   */
  getFrameworkCoverage(campaignId: string): number[] {
    const campaign = this.nodes.get(campaignId);
    if (!campaign) return [];

    const edges = this.edges.filter(
      e => e.from === campaignId && e.type === 'maps_to'
    );
    
    return edges
      .map(e => this.nodes.get(e.to))
      .filter((n): n is KnowledgeNode => n !== undefined && n.type === 'framework_section')
      .map(n => n.data.frameworkSection!)
      .filter((s): s is number => s !== undefined)
      .sort((a, b) => a - b);
  }

  /**
   * Export graph for persistence
   */
  export(): GraphExport {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: [...this.edges],
      metadata: {
        exportedAt: new Date(),
        nodeCount: this.nodes.size,
        edgeCount: this.edges.length,
        version: '1.0.0',
      },
    };
  }

  /**
   * Import graph from export
   */
  import(data: GraphExport): void {
    this.nodes.clear();
    this.edges = [];

    for (const node of data.nodes) {
      this.nodes.set(node.id, {
        ...node,
        createdAt: new Date(node.createdAt),
      });
    }
    this.edges = [...data.edges];
  }

  /**
   * Get graph statistics
   */
  getStats(): {
    nodes: number;
    edges: number;
    patterns: number;
    campaigns: number;
    density: number;
  } {
    const nodeCount = this.nodes.size;
    const edgeCount = this.edges.length;
    const maxEdges = nodeCount * (nodeCount - 1) / 2;
    const density = maxEdges > 0 ? edgeCount / maxEdges : 0;

    return {
      nodes: nodeCount,
      edges: edgeCount,
      patterns: this.getPatterns().length,
      campaigns: this.getCampaigns().length,
      density,
    };
  }

  /**
   * Clear the graph
   */
  clear(): void {
    this.nodes.clear();
    this.edges = [];
  }
}

// ===========================================
// Factory Functions
// ===========================================

/**
 * Create a new empty knowledge graph
 */
export function createKnowledgeGraph(): KnowledgeGraph {
  return new KnowledgeGraph();
}

/**
 * Seed the graph with the 8-Part Framework sections
 */
export function seedFrameworkSections(graph: KnowledgeGraph): void {
  const sections = [
    { id: 'framework_1', label: 'Current Cultural Context', section: 1 },
    { id: 'framework_2', label: 'Brand Credibility', section: 2 },
    { id: 'framework_3', label: 'The Shared Interest', section: 3 },
    { id: 'framework_4', label: 'The Passive Trap', section: 4 },
    { id: 'framework_5', label: 'The Participation Worthy Idea', section: 5 },
    { id: 'framework_6', label: 'Moments and Places', section: 6 },
    { id: 'framework_7', label: 'Mechanics of Participation', section: 7 },
    { id: 'framework_8', label: 'First Responders', section: 8 },
    { id: 'framework_9', label: 'The Ripple Effect', section: 9 },
  ];

  for (const s of sections) {
    graph.addNode({
      id: s.id,
      type: 'framework_section',
      label: s.label,
      data: { frameworkSection: s.section },
      createdAt: new Date(),
    });
  }
}
