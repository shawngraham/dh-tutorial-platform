import type { ModuleDefinition } from '../types/index.ts';

export const modules: ModuleDefinition[] = [
  {
    id: 'orientation',
    title: 'Orientation',
    description: 'Welcome! A quick introduction to the interface and concepts powering this platform.',
    estimatedHours: .10,
    prerequisites: [],
    lessons: ['orientation-01'],
    track: 'foundations',
    disciplines: [],
    keywords: ['files', 'directories', 'data formats', 'encoding', 'version control'],
  },
  {
    id: 'digital-literacy-foundations',
    title: 'Digital Literacy Foundations',
    description: 'Understanding files, data formats, plain text vs binary, character encoding, and version control concepts.',
    estimatedHours: 1,
    prerequisites: [],
    lessons: ['digital-literacy-01', 'digital-literacy-02', 'digital-literacy-03'],
    track: 'foundations',
    disciplines: [],
    keywords: ['files', 'directories', 'data formats', 'encoding', 'version control'],
  },
  {
    id: 'python-basics',
    title: 'Python Basics for Humanists',
    description: 'Variables, data types, control flow, functions, file I/O, and working with libraries.',
    estimatedHours: 1,
    prerequisites: ['digital-literacy-foundations'],
    lessons: ['python-basics-01', 'python-basics-02', 'python-basics-03', 'python-basics-04', 'python-basics-05'],
    track: 'foundations',
    disciplines: [],
    keywords: ['python', 'variables', 'functions', 'loops', 'files'],
  },
  {
    id: 'text-analysis-fundamentals',
    title: 'Text Analysis Fundamentals',
    description: 'String operations, regular expressions, word frequency, text cleaning, NLP basics with NLTK.',
    estimatedHours: 1,
    prerequisites: ['python-basics'],
    lessons: ['text-analysis-01', 'text-analysis-02', 'text-analysis-03', 'text-analysis-04', 'text-analysis-05', 'text-analysis-06'],
    track: 'textual-scholarship',
    disciplines: ['literature', 'linguistics', 'history', 'philosophy', 'religious-studies', 'classics', 'anthropology'],
    keywords: ['text', 'nlp', 'regex', 'frequency', 'nltk'],
  },
  {
    id: 'structured-data',
    title: 'Working with Structured Data',
    description: 'CSV files, Pandas basics, filtering, sorting, grouping, merging datasets, and metadata.',
    estimatedHours: 1,
    prerequisites: ['python-basics'],
    lessons: ['structured-data-01', 'structured-data-02', 'structured-data-03', 'structured-data-04','structured-data-05', 'structured-data-06'],
    track: 'data-issues',
    disciplines: ['history', 'art-history', 'linguistics', 'archaeology', 'classics', 'music', 'anthropology', 'religious-studies', 'philosophy'],
    keywords: ['csv', 'pandas', 'tabular', 'metadata', 'dataframe'],
  },
  {
    id: 'data-visualization',
    title: 'Data Visualization for DH',
    description: 'Visualization principles, bar/line/scatter plots, customization, timelines, physicalization, and geographic visualization.',
    estimatedHours: 1,
    prerequisites: ['python-basics'],
    lessons: ['data-viz-01', 'data-viz-02', 'data-viz-03', 'data-viz-04', 'data-viz-05', 'data-viz-06','data-viz-07','data-viz-08','data-viz-09'],
    track: 'data-issues',
    disciplines: ['history', 'art-history', 'literature', 'archaeology', 'linguistics', 'music', 'anthropology', 'sociology'],
    keywords: ['matplotlib', 'visualization', 'charts', 'graphs', 'maps'],
  },
  {
    id: 'web-data-collection',
    title: 'Web Data Collection',
    description: 'HTML structure, web scraping ethics, BeautifulSoup, APIs and JSON, rate limiting.',
    estimatedHours: 1,
    prerequisites: ['python-basics'],
    lessons: ['web-data-01', 'web-data-02', 'web-data-03', 'web-data-04'],
    track: 'data-issues',
    disciplines: ['history', 'literature', 'classics', 'archaeology', 'anthropology', 'art-history'],
    keywords: ['web', 'scraping', 'api', 'html', 'json'],
  },
    {
    id: 'data-sonification',
    title: 'Data Sonification for DH',
    description: 'Translating data into sound: parameter mapping, rhythmic sequences, and multimodal audio representations of humanities datasets.',
    estimatedHours: 1,
    prerequisites: ['python-basics'],
    lessons: ['sonification-01', 'sonification-02', 'sonification-03'],
    track: 'creative-critical',
    disciplines: ['music', 'history', 'literature', 'archaeology', 'anthropology'],
    keywords: ['sonification', 'audio', 'midi', 'mapping', 'multimodal'],
  },
  {
    id: 'topic-modeling',
    title: 'Topic Modeling with LDA',
    description: 'Explore the conceptual foundations of Latent Dirichlet Allocation (LDA), text preprocessing for modeling, training models with Gensim, and interpreting document-topic distributions.',
    estimatedHours: 1,
    prerequisites: ['text-analysis-fundamentals'],
    lessons: [
      'topic-modeling-01',
      'topic-modeling-02',
      'topic-modeling-03',
      'topic-modeling-04',
    ],
    track: 'textual-scholarship',
    disciplines: ['literature', 'history', 'sociology', 'archaeology', 'philosophy', 'religious-studies', 'classics', 'anthropology'],
    keywords: ['lda', 'topic modeling', 'gensim', 'distant reading', 'nlp', 'unsupervised learning'],
  },
  {
  id: 'network-analysis',
  title: 'Network Analysis for Humanists',
  description: 'Modeling relationships using nodes and edges. Learn to build, visualize, and analyze networks using NetworkX.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'structured-data'],
  lessons: [
    'network-analysis-01', // Intro to Graph Theory terms
    'network-analysis-02', // Creating Nodes and Edges with NetworkX
    'network-analysis-03', // Centrality measures (Degree, Betweenness)
    'network-analysis-04', // Visualizing Networks
    'network-analysis-05',  // Case Study: Correspondence networks or Character maps
    'network-analysis-06'
  ],
  track: 'spatial-relational',
  disciplines: ['history', 'sociology', 'literature', 'anthropology', 'philosophy', 'classics', 'art-history', 'music', 'religious-studies'],
  keywords: ['graphs', 'nodes', 'edges', 'networkx', 'relationships'],
},
{
  id: 'geospatial-analysis',
  title: 'Mapping and Geospatial Data',
  description: 'Introduction to GIS concepts for python. plotting coordinates, working with Shapefiles/GeoJSON, and creating interactive maps.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'structured-data'],
  lessons: [
    'geospatial-01', // Coordinate systems and Projections
    'geospatial-02', // Intro to GeoPandas
    'geospatial-03', // Plotting points on maps
    'geospatial-04', // Creating interactive maps with Folium
    'geospatial-05', // Manipulating geodata
  ],
  track: 'spatial-relational',
  disciplines: ['history', 'archaeology', 'anthropology', 'classics', 'religious-studies'],
  keywords: ['gis', 'maps', 'geopandas', 'folium', 'coordinates', 'spatial'],
},
{
  id: 'image-analysis',
  title: 'Computer Vision for Humanities',
  description: 'Programmatic analysis of image collections. Color extraction, similarity detection, and metadata generation from visual data.',
  estimatedHours: 1,
  prerequisites: ['python-basics'],
  lessons: [
    'image-analysis-01', // pixels as data (numpy arrays)
    'image-analysis-02', // Processing images with Pillow/OpenCV
    'image-analysis-03', // Color histograms and extraction
    'image-analysis-04', // Detecting visual similarity
  ],
  track: 'creative-critical',
  disciplines: ['art-history', 'media-studies', 'history', 'archaeology', 'classics', 'anthropology', 'religious-studies'],
  keywords: ['computer vision', 'images', 'pixels', 'color analysis', 'opencv'],
},
{
  id: 'sentiment-analysis',
  title: 'Sentiment and Emotion Analysis',
  description: 'Computational approaches to detecting emotional valence in text. Using lexicons and ML classifiers to track narrative arcs.',
  estimatedHours: 1,
  prerequisites: ['text-analysis-fundamentals'],
  lessons: [
    'sentiment-01', // Theory: Dictionary vs ML approaches
    'sentiment-02', // Using VADER for social data
    'sentiment-03', // Plotting emotional arcs in novels
    'sentiment-04', // Limitations and bias in sentiment tools
  ],
  track: 'textual-scholarship',
  disciplines: ['literature', 'linguistics', 'sociology', 'marketing', 'history', 'religious-studies'],
  keywords: ['sentiment', 'emotions', 'vader', 'textblob', 'valence'],
},
{
  id: 'relational-models',
  title: 'Relational Models & Cultural Mapping',
  description: 'Explore how DH researchers move from text to "space." Learn about Word Vectors, Knowledge Graphs, and how to represent historical relationships as mathematical triples.',
  estimatedHours: 1,
  prerequisites: ['python-basics','network-analysis'],
  lessons: ['rel-mod-01', 'rel-mod-02', 'rel-mod-03', 'rel-mod-04', 'rel-mod-05'],
  track: 'spatial-relational',
  disciplines: ['linguistics', 'history', 'philosophy', 'classics', 'religious-studies'],
  keywords: ['embeddings', 'word2vec', 'knowledge-graphs', 'linked-data'],
},
{
  id: 'generative-poetics',
  title: 'Generative Poetics and Creative Coding',
  description: 'Using algorithms to generate literature and art. Explore Markov chains, context-free grammars, and the Oulipo movement as a foundation for computational creativity.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'text-analysis-fundamentals'],
  lessons: [
    'generative-01', // The Oulipo and Constraint-based Writing
    'generative-02', // Stochastic Text: Building Markov Chain Generators
    'generative-03', // Recursive Structures: Context-Free Grammars (Tracery-style logic)
    'generative-04', // Erasure and Deformance: Algorithmic editing of existing corpora
    'generative-05', // Visualizing Poetry: Combining text generation with Matplotlib/Pillow
  ],
  track: 'creative-critical',
  disciplines: ['literature', 'media-studies', 'creative-writing', 'art-history', 'music', 'linguistics'],
  keywords: ['generative', 'markov chains', 'oulipo', 'creative coding', 'deformance', 'poetry'],
},
{
  id: 'critical-data',
  title: 'Algorithmic Bias and Critical Data Studies',
  description: 'Examine how classification systems, missing data, feedback loops, and language tools encode bias. Learn to audit datasets, measure representation, and write data biographies.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'text-analysis-fundamentals'],
  lessons: [
    'critical-data-01', // Counting What Counts: How Categories Shape Data
    'critical-data-02', // The Gaps in the Archive: Measuring Representation
    'critical-data-03', // Feedback Loops: When Output Becomes Input
    'critical-data-04', // Auditing a Word List: Bias in Language Tools
    'critical-data-05', // Writing a Data Biography
  ],
  track: 'data-issues',
  disciplines: ['history', 'sociology', 'linguistics', 'literature', 'anthropology'],
  keywords: ['bias', 'classification', 'representation', 'data feminism', 'critical data studies', 'ethics'],
},
{
  id: 'oral-history',
  title: 'Oral History and Transcribed Audio Text Analysis',
  description: 'Analyze oral history transcripts as structured data. Explore speaker turns, pauses, silences, conversational power dynamics, and keyword concordances in testimony.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'text-analysis-fundamentals'],
  lessons: [
    'oral-history-01', // The Shape of Speech: Understanding Transcripts as Data
    'oral-history-02', // Silence and Pause: What Gaps Tell Us
    'oral-history-03', // Turn-Taking and Power: Analyzing Conversation Structure
    'oral-history-04', // Concordance and Keywords in Oral Testimony
  ],
  track: 'textual-scholarship',
  disciplines: ['history', 'anthropology', 'sociology', 'linguistics', 'folklore'],
  keywords: ['oral history', 'transcripts', 'conversation analysis', 'kwic', 'concordance', 'silences'],
},
{
  id: 'interactive-fiction',
  title: 'Interactive Fiction and Hypertext Narratives',
  description: 'Build branching narratives using Python dictionaries and control flow. Explore hypertext theory, state tracking, narrative graph analysis, and procedural story generation.',
  estimatedHours: 1,
  prerequisites: ['python-basics'],
  lessons: [
    'if-01', // The Forking Path: Stories as Dictionaries
    'if-02', // State and Memory: Tracking the Reader's Journey
    'if-03', // Graph of Stories: Mapping Narrative Structure
    'if-04', // Generating Worlds: Procedural Story Fragments
  ],
  track: 'creative-critical',
  disciplines: ['literature', 'creative-writing', 'media-studies', 'game-studies'],
  keywords: ['interactive fiction', 'hypertext', 'branching narrative', 'procedural generation', 'ergodic literature'],
},
{
  id: 'reproducibility',
  title: 'Reproducibility and Documentation',
  description: 'Learn to document your DH research workflow for transparency and reproducibility. Build processing logs, validate naming conventions, verify data integrity with checksums, and generate methods reports.',
  estimatedHours: 1,
  prerequisites: ['python-basics'],
  lessons: [
    'repro-01', // The Lab Notebook: Why Documentation Matters
    'repro-02', // Naming Things: Conventions that Save Your Future Self
    'repro-03', // Checksums and Integrity: Proving Nothing Changed
    'repro-04', // The Methods Section: Generating Human-Readable Reports
  ],
  track: 'foundations',
  disciplines: ['history', 'literature', 'archaeology', 'linguistics'],
  keywords: ['reproducibility', 'documentation', 'checksums', 'methods', 'naming conventions', 'data integrity'],
},
{
  id: 'llm-foundations',
  title: 'Understanding Large Language Models',
  description: 'Explore the architecture and cultural implications of large language models. From vectors and embeddings to self-attention, recurrent networks, and RLHF alignment — and why LLMs are complex systems built on a vast statistical representation of human language.',
  estimatedHours: 1,
  prerequisites: ['text-analysis-fundamentals'],
  lessons: ['llm-01', 'llm-02', 'llm-03', 'llm-04', 'llm-05'],
  track: 'textual-scholarship',
  disciplines: ['literature', 'history', 'sociology', 'philosophy', 'linguistics', 'media-studies', 'anthropology'],
  keywords: ['llm', 'transformers', 'embeddings', 'attention', 'rlhf', 'alignment', 'language models', 'neural networks'],
},
{
  id: 'dh-pipeline',
  title: 'Putting It All Together: A DH Research Pipeline',
  description: 'A capstone module that walks through a complete DH research workflow — from loading and cleaning a historical newspaper corpus, to extracting features, comparing subsets, and reporting results.',
  estimatedHours: 1,
  prerequisites: ['python-basics', 'text-analysis-fundamentals', 'structured-data', 'data-visualization'],
  lessons: [
    'pipeline-01', // Stage 1: Loading and Cleaning Your Corpus
    'pipeline-02', // Stage 2: Extracting Features and Counting Patterns
    'pipeline-03', // Stage 3: Comparing and Cross-Tabulating
    'pipeline-04', // Stage 4: Reporting Results
  ],
  track: 'foundations',
  disciplines: ['history', 'literature', 'sociology', 'media-studies'],
  keywords: ['pipeline', 'workflow', 'corpus analysis', 'distant reading', 'capstone', 'integration'],
},
];

export function getModuleById(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}

export function getModulesByTrack(track: ModuleDefinition['track']): ModuleDefinition[] {
  return modules.filter((m) => m.track === track);
}
