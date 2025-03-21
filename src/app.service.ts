import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import {
  KnowledgeItem,
  Department,
  ItemType,
  ProjectContext,
} from './knowledge-items/entities/knowledge-item.entity';
import { faker } from '@faker-js/faker';
import { generateTextVector } from './utils/embedding';
import { v4 as uuidv4 } from 'uuid';
import { Container } from '@azure/cosmos';

export interface GenerateResponse {
  message: string;
  success: boolean;
  count?: number;
  error?: string;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private itemsContainer: Container;
  private items: KnowledgeItem[] = [
    {
      id: uuidv4(),
      title: "Microservice Architecture Best Practices",
      content: "When implementing microservice architecture, maintain separate data storage for each service to ensure loose coupling. Use API gateways for client communication. Implement robust service discovery and circuit breaker patterns to handle failures gracefully. Monitor each service independently but maintain a consolidated dashboard for system-wide visibility.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 8, 15),
      metadata: {
        author: "Jennifer Rodriguez",
        version: "1.2",
        tags: ["microservices", "architecture", "best practices", "cloud native"],
        department: Department.Engineering,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Code Review Guidelines",
      content: "All pull requests must be reviewed by at least two team members. Focus reviews on logic, security, performance, and maintainability. Use automated tools for style checks. Provide constructive feedback and reference company coding standards. Reviews should be completed within 48 hours of submission to maintain velocity.",
      itemType: ItemType.Policy,
      dateCreated: new Date(2024, 9, 5),
      metadata: {
        author: "Michael Chang",
        version: "2.0",
        tags: ["code quality", "collaboration", "developer workflow"],
        department: Department.Engineering,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Vector Database Implementation Guide",
      content: "This guide outlines implementation strategies for vector databases in production. Consider embedding dimensionality, indexing algorithms, and query optimization. ANN (Approximate Nearest Neighbor) search should be favored for large datasets. Implement proper vector normalization before storage. Consider hybrid retrieval approaches combining vector similarity with filtering based on metadata.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 10, 7),
      metadata: {
        author: "Sarah Johnson",
        version: "1.0",
        tags: ["vector database", "embeddings", "similarity search", "AI", "machine learning"],
        department: Department.Engineering,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Database Indexing Strategies",
      content: "Proper indexing is crucial for query performance. Create indexes for frequently queried columns. Avoid over-indexing as it impacts write performance. Use covering indexes for read-heavy operations. For CosmosDB specifically, understand partition key design and RU consumption patterns. Monitor query performance regularly and adjust indexes as needed.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 7, 22),
      metadata: {
        author: "David Kim",
        version: "1.1",
        tags: ["database", "performance", "optimization", "indexing"],
        department: Department.Engineering,
        projectContext: ProjectContext.Department
      }
    },

    // HR Documents
    {
      id: uuidv4(),
      title: "Remote Work Policy",
      content: "Employees may work remotely up to three days per week with manager approval. Remote workers must maintain core hours of 10am-3pm for collaboration. Equipment for home offices can be requested through the HR portal. Performance expectations remain the same regardless of work location. Team meetings should accommodate remote participants with proper video conferencing setup.",
      itemType: ItemType.Policy,
      dateCreated: new Date(2024, 6, 10),
      metadata: {
        author: "Emma Williams",
        version: "3.0",
        tags: ["remote work", "work from home", "flexible work", "hr policy"],
        department: Department.HR,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Annual Review Process",
      content: "Annual performance reviews occur each December. Employees complete a self-assessment form two weeks prior to manager review. Reviews evaluate performance against individual goals and company values. 360-degree feedback is collected from peers and cross-functional partners. Ratings and compensation adjustments are finalized by January 15th.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 8, 1),
      metadata: {
        author: "Robert Chen",
        version: "4.1",
        tags: ["performance review", "evaluation", "annual review", "HR process"],
        department: Department.HR,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Onboarding Checklist Template",
      content: "Day 1: System access setup, welcome email, team introduction. Week 1: Department orientation, tool training, buddy assignment. Month 1: Project assignment, regular 1:1 check-ins, training plan development. 90 Days: Initial performance review, goal setting session, team integration assessment. Use this template to ensure consistent onboarding experiences.",
      itemType: ItemType.Template,
      dateCreated: new Date(2024, 5, 18),
      metadata: {
        author: "Priya Patel",
        version: "2.2",
        tags: ["onboarding", "new hire", "HR template", "employee experience"],
        department: Department.HR,
        projectContext: ProjectContext.Department
      }
    },

    // Finance Documents
    {
      id: uuidv4(),
      title: "Expense Reimbursement Procedure",
      content: "All business expenses must be submitted within 30 days of occurrence. Receipts are required for all expenses over $25. Use the Expensify app for submission with proper categorization and business justification. Manager approval is required before processing. Reimbursements are processed within two business weeks and included in the next payroll cycle.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 7, 12),
      metadata: {
        author: "Thomas Wilson",
        version: "2.3",
        tags: ["expense", "reimbursement", "finance procedure", "compliance"],
        department: Department.Finance,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Annual Budget Planning Guide",
      content: "Department budget planning begins in Q3 for the following fiscal year. Use zero-based budgeting approach for all discretionary spending. Include headcount projections, capital expenses, and operational costs. Historical spending reports are available in the finance portal. Final budget proposals require executive approval by November 15th.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 6, 25),
      metadata: {
        author: "Amanda Lopez",
        version: "1.4",
        tags: ["budget", "financial planning", "fiscal year", "finance guide"],
        department: Department.Finance,
        projectContext: ProjectContext.Department
      }
    },

    // Marketing Documents
    {
      id: uuidv4(),
      title: "Social Media Content Strategy",
      content: "Our social media strategy focuses on brand awareness, customer engagement, and thought leadership. Content mix should be 40% educational, 30% brand storytelling, 20% product information, and 10% promotional. Post frequency: LinkedIn (3x/week), Twitter (daily), Instagram (2x/week). All posts should align with quarterly campaign themes and incorporate designated hashtags.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 9, 10),
      metadata: {
        author: "Jason Garcia",
        version: "2.1",
        tags: ["social media", "content strategy", "digital marketing", "brand building"],
        department: Department.Marketing,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Product Launch Checklist",
      content: "90 days before launch: Finalize messaging and positioning. 60 days before: Create marketing assets and brief sales team. 30 days before: Begin teaser campaign and media outreach. Launch day: Publish press release, activate all channels, monitor social media. Post-launch: Track metrics daily for first week, weekly for first month. Conduct review meeting 30 days post-launch.",
      itemType: ItemType.Template,
      dateCreated: new Date(2024, 10, 5),
      metadata: {
        author: "Nicole Taylor",
        version: "3.0",
        tags: ["product launch", "go-to-market", "marketing plan", "campaign planning"],
        department: Department.Marketing,
        projectContext: ProjectContext.Department
      }
    },

    // PMO Documents
    {
      id: uuidv4(),
      title: "Agile Project Management Framework",
      content: "Our Agile framework uses two-week sprints with story point estimation. Sprint planning occurs on Mondays, daily standups at 9am, reviews on alternate Thursdays, and retrospectives on Fridays. Project health is tracked via velocity charts, burndown metrics, and sprint completion rates. Cross-functional teams should maintain a definition of ready and definition of done.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 8, 20),
      metadata: {
        author: "Daniel Moore",
        version: "2.4",
        tags: ["agile", "scrum", "project management", "sprints", "development methodology"],
        department: Department.PMO,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Risk Assessment Template",
      content: "Identify risks across five categories: technical, resource, schedule, external, and organizational. Rate each risk on likelihood (1-5) and impact (1-5). Calculate risk score as likelihood × impact. Develop mitigation strategies for all risks scoring above 15. Assign risk owners and review status weekly. Update risk register after each significant project milestone.",
      itemType: ItemType.Template,
      dateCreated: new Date(2024, 7, 15),
      metadata: {
        author: "Elizabeth Brown",
        version: "1.3",
        tags: ["risk management", "project planning", "risk assessment", "project governance"],
        department: Department.PMO,
        projectContext: ProjectContext.Department
      }
    },

    // Additional items to showcase search capabilities
    {
      id: uuidv4(),
      title: "Vector Search Implementation in Azure Cosmos DB",
      content: "Azure Cosmos DB supports vector embeddings with efficient ANN (Approximate Nearest Neighbor) search capabilities. Implement proper dimensionality for your embeddings based on your model. The system supports hybrid retrieval combining vector similarity with traditional filters. Performance considerations include index freshness, vector dimensions, and optimal similarity metrics like cosine or euclidean distance.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 10, 12),
      metadata: {
        author: "Alex Thompson",
        version: "1.0",
        tags: ["vector search", "Azure", "Cosmos DB", "embeddings", "similarity search"],
        department: Department.Engineering,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Database Performance Optimization",
      content: "Optimize database performance by implementing proper indexing strategies, query optimization, and regular maintenance. For CosmosDB specifically, choose appropriate partition keys, optimize RU usage, and implement caching where appropriate. Monitor query patterns and adjust indexes accordingly. Consider data access patterns when designing schema to minimize cross-partition queries.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 9, 18),
      metadata: {
        author: "Sophia Martinez",
        version: "2.1",
        tags: ["database", "performance", "optimization", "Cosmos DB", "indexing"],
        department: Department.Engineering,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Hybrid Search Architecture Design",
      content: "Hybrid search combines the strengths of keyword-based and semantic vector search approaches. Design your system to index both raw text for keyword matching and vector embeddings for semantic similarity. Implement a ranking fusion algorithm like Reciprocal Rank Fusion (RRF) to combine results from both approaches. This provides both precise matching and conceptual similarity for optimal search experiences.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 10, 15),
      metadata: {
        author: "Marcus Johnson",
        version: "1.1",
        tags: ["hybrid search", "vector search", "full-text search", "search architecture", "information retrieval"],
        department: Department.Engineering,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Knowledge Management System Implementation",
      content: "Effective knowledge management systems require both technical implementation and cultural adoption. Implement tagging taxonomies, search capabilities, and intuitive interfaces. Consider vector search for semantic retrieval alongside traditional keyword search. Encourage contribution through recognition and integration with existing workflows. Measure success via engagement metrics, time saved in information retrieval, and knowledge reuse.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 8, 8),
      metadata: {
        author: "Rachel Adams",
        version: "2.0",
        tags: ["knowledge management", "information architecture", "search", "organizational learning"],
        department: Department.PMO,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Full-Text Search Best Practices",
      content: "Implement effective full-text search by considering tokenization, stemming, and stop word removal. Create custom analyzers for domain-specific terminology. Boost fields based on importance, with titles typically weighted higher than body content. Implement faceted navigation using metadata fields. Consider fuzzy matching for typo tolerance and phonetic matching for name searches.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 9, 25),
      metadata: {
        author: "Benjamin Lee",
        version: "1.2",
        tags: ["full-text search", "information retrieval", "search optimization", "indexing"],
        department: Department.Engineering,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Machine Learning Model Deployment Process",
      content: "The ML model deployment process includes validation in staging environments, A/B testing protocols, and monitoring frameworks. Models must meet performance thresholds on benchmark datasets before promotion to production. Implement feature stores for consistent inference. Deployment pipelines should include automated testing, versioning, and rollback capabilities. Monitor model drift and performance degradation.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 10, 2),
      metadata: {
        author: "Aisha Khan",
        version: "2.1",
        tags: ["machine learning", "MLOps", "model deployment", "AI engineering"],
        department: Department.Engineering,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Employee Wellness Program Guidelines",
      content: "Our wellness program offers physical, mental, and financial wellbeing resources. Employees receive $500 annual wellness stipend for approved activities. Mental health services include confidential counseling with no co-pay. Wellness challenges occur quarterly with team and individual recognition. Remote employees have access to virtual fitness classes and meditation sessions. Program participation is entirely voluntary.",
      itemType: ItemType.Policy,
      dateCreated: new Date(2024, 7, 10),
      metadata: {
        author: "Jordan Williams",
        version: "3.2",
        tags: ["wellness", "employee benefits", "mental health", "work-life balance"],
        department: Department.HR,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Data Governance Framework",
      content: "Our data governance framework establishes data ownership, quality standards, and usage policies. Each dataset must have a designated owner responsible for quality and access control. Data classification determines security requirements and retention policies. Regulatory compliance reviews occur quarterly. All data access requires justification and adheres to least-privilege principles. Data lineage must be maintained for all analytics pipelines.",
      itemType: ItemType.Policy,
      dateCreated: new Date(2024, 6, 15),
      metadata: {
        author: "Victoria Chen",
        version: "2.0",
        tags: ["data governance", "compliance", "data management", "data quality"],
        department: Department.PMO,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Marketing Campaign ROI Calculation Template",
      content: "Calculate campaign ROI using this standardized approach: 1) Track all campaign costs including media spend, creative production, and team time. 2) Measure conversions and attribute revenue using multi-touch attribution model. 3) Calculate ROI as (Revenue - Cost) / Cost × 100%. 4) Segment analysis by channel, audience segment, and creative variation. 5) Compare against benchmarks and previous campaigns for context.",
      itemType: ItemType.Template,
      dateCreated: new Date(2024, 8, 5),
      metadata: {
        author: "Ryan Parker",
        version: "1.3",
        tags: ["marketing analytics", "ROI", "campaign measurement", "performance tracking"],
        department: Department.Marketing,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Cloud Cost Optimization Strategies",
      content: "Implement these strategies to optimize cloud costs: Use auto-scaling based on actual demand patterns. Implement resource tagging for accurate cost allocation. Right-size resources based on utilization metrics. Leverage reserved instances for predictable workloads. Set up budget alerts to prevent unexpected spending. Review orphaned resources monthly. Consider spot instances for fault-tolerant batch processing. Implement infrastructure as code to prevent configuration drift.",
      itemType: ItemType.BestPractice,
      dateCreated: new Date(2024, 9, 20),
      metadata: {
        author: "Michelle Torres",
        version: "2.2",
        tags: ["cloud computing", "cost optimization", "Azure", "resource management", "FinOps"],
        department: Department.Finance,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Quarterly Financial Reporting Procedure",
      content: "Quarterly financial reports must be prepared within 10 business days of quarter close. Department heads submit budget variance explanations by day 5. Finance team consolidates reports and prepares executive summary by day 8. Reports include actual vs. budget analysis, key performance indicators, and updated forecasts. Executive review session occurs on day 12, with final distribution to stakeholders by day 15.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 7, 28),
      metadata: {
        author: "Samuel Green",
        version: "3.1",
        tags: ["financial reporting", "quarterly close", "accounting procedures", "budget variance"],
        department: Department.Finance,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "API Design Standards",
      content: "All APIs must follow RESTful principles with resource-oriented endpoints. Use nouns, not verbs, in endpoint paths. Implement consistent error responses with appropriate HTTP status codes. Version APIs in the URL path (e.g., /v1/resources). Require authentication for all non-public endpoints using OAuth 2.0. Document APIs using OpenAPI Specification. Implement rate limiting and provide deprecation notices at least 6 months in advance.",
      itemType: ItemType.Policy,
      dateCreated: new Date(2024, 10, 8),
      metadata: {
        author: "Tiffany Nguyen",
        version: "2.4",
        tags: ["API design", "REST", "web services", "integration", "standards"],
        department: Department.Engineering,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Customer Feedback Collection Methods",
      content: "Collect customer feedback through multiple channels: 1) In-app surveys with max 3 questions and 5-point rating scales. 2) Quarterly NPS surveys to measure loyalty and satisfaction trends. 3) User testing sessions for new features with 5-7 participants. 4) Customer advisory board meetings for strategic direction input. 5) Social media sentiment analysis for brand perception. Consolidate findings monthly in the customer insights dashboard.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 8, 12),
      metadata: {
        author: "Derek Wilson",
        version: "1.4",
        tags: ["customer feedback", "user research", "voice of customer", "product management"],
        department: Department.Marketing,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Security Incident Response Plan",
      content: "This incident response plan outlines steps for addressing security breaches: 1) Detection and reporting within 2 hours of discovery. 2) Assessment and classification by severity within 4 hours. 3) Containment procedures to isolate affected systems. 4) Eradication of threats and vulnerabilities. 5) Recovery and service restoration. 6) Post-incident analysis and documentation. The security team lead serves as incident commander with escalation paths clearly defined.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 6, 20),
      metadata: {
        author: "Lisa Johnson",
        version: "3.0",
        tags: ["security", "incident response", "data breach", "cybersecurity"],
        department: Department.Engineering,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Vendor Selection Process",
      content: "The vendor selection process includes requirements definition, RFP development, vendor research, and structured evaluation. Form a cross-functional evaluation committee. Score proposals against weighted criteria including capabilities, cost, support, security compliance, and integration requirements. Conduct reference checks and product demonstrations before final selection. Contract negotiations must involve legal and procurement teams.",
      itemType: ItemType.Procedure,
      dateCreated: new Date(2024, 7, 5),
      metadata: {
        author: "Carlos Rodriguez",
        version: "2.1",
        tags: ["procurement", "vendor management", "supplier selection", "RFP process"],
        department: Department.PMO,
        projectContext: ProjectContext.Department
      }
    },
    {
      id: uuidv4(),
      title: "Remote Team Building Activities",
      content: "Effective remote team building activities include virtual coffee chats, online game sessions, remote workshops, and digital recognition programs. Schedule monthly team socials with themed activities. Use collaboration tools for asynchronous team challenges. Implement a buddy system for new hires. Send quarterly care packages to remote team members. Rotate meeting facilitation to increase engagement and distribute leadership opportunities.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 9, 15),
      metadata: {
        author: "Natalie Barnes",
        version: "1.2",
        tags: ["team building", "remote work", "employee engagement", "virtual collaboration"],
        department: Department.HR,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Content Vector Search Implementation",
      content: "When implementing content vector search, first choose an appropriate embedding model that aligns with your domain. Vector dimensionality typically ranges from 384 to 1536 based on the model. Store vectors in a database optimized for similarity search like Cosmos DB with vector capabilities. Implement approximate nearest neighbor algorithms for performance at scale. Consider hybrid approaches that combine semantic similarity with keyword filtering for optimal results.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 10, 18),
      metadata: {
        author: "Alan Zhang",
        version: "1.0",
        tags: ["vector search", "embeddings", "semantic search", "information retrieval", "AI"],
        department: Department.Engineering,
        projectContext: ProjectContext.Team
      }
    },
    {
      id: uuidv4(),
      title: "Brand Voice and Tone Guidelines",
      content: "Our brand voice is confident but not arrogant, expert but accessible, and innovative but practical. Adjust tone based on channel and audience: more professional for white papers and case studies, more conversational for social media and blog posts. Avoid jargon when addressing general audiences. Use active voice and present tense when possible. Humor should be subtle and inclusive. All content should emphasize customer outcomes rather than technical features.",
      itemType: ItemType.Guide,
      dateCreated: new Date(2024, 8, 25),
      metadata: {
        author: "Erica Foster",
        version: "2.3",
        tags: ["brand guidelines", "content marketing", "communication", "messaging"],
        department: Department.Marketing,
        projectContext: ProjectContext.Enterprise
      }
    },
    {
      id: uuidv4(),
      title: "Project Post-Mortem Template",
      content: "Conduct project post-mortems within two weeks of project completion. Use this structured format: 1) Project summary and objectives. 2) Key achievements and metrics. 3) Things that went well (process, tools, team). 4) Areas for improvement with root cause analysis. 5) Specific actionable recommendations. 6) Follow-up ownership and timelines. Involve all team members and create a blame-free environment to encourage honest feedback.",
      itemType: ItemType.Template,
      dateCreated: new Date(2024, 7, 22),
      metadata: {
        author: "Omar Hassan",
        version: "1.3",
        tags: ["project management", "retrospective", "lessons learned", "continuous improvement"],
        department: Department.PMO,
        projectContext: ProjectContext.Department
      }
    }
  ];

  constructor(private readonly databaseService: DatabaseService
  ) {
  }

  async onModuleInit() {
    this.itemsContainer = this.databaseService.getContainer();
  }

  async generateFakeKnowledgeItems(): Promise<GenerateResponse> {
    try {
      let count = 0;

      for (let item of this.items) {
        item.contentVector = await generateTextVector(item.content);
        item.metadataVector = await generateTextVector(JSON.stringify(item.metadata));
        await this.itemsContainer.items.create(item);
        count++;
      }

      return {
        message: `Successfully generated and inserted ${count} items`,
        success: true,
        count: count
      }

    } catch (error) {
      this.logger.error(`Failed to generate items: ${error.message}`);
      return {
        message: 'Failed to generate items',
        success: false,
        error: error.message,
      };

    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
