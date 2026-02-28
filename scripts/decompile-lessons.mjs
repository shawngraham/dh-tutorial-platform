import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
// Use 'tsx' to allow importing the .ts file directly
import { lessons } from '../src/data/lessons.ts'; 

const OUT_DIR = './lessons-decompiled';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

function formatMarkdown(lesson) {
  let md = `---\n`;
  md += `id: ${lesson.id}\n`;
  md += `title: "${lesson.title.replace(/"/g, '\\"')}"\n`; // Escape quotes for YAML
  md += `moduleId: ${lesson.moduleId}\n`;
  
  md += `prerequisites:\n${lesson.prerequisites?.map(p => `  - ${p}`).join('\n') || ''}\n`;
  md += `estimatedTimeMinutes: ${lesson.estimatedTimeMinutes}\n`;
  md += `difficulty: ${lesson.difficulty}\n`;
  
  md += `learningObjectives:\n${lesson.learningObjectives?.map(o => `  - ${o}`).join('\n') || ''}\n`;
  md += `keywords:\n${lesson.keywords?.map(k => `  - ${k}`).join('\n') || ''}\n`;
  md += `---\n\n`;

  // Main Content
  md += `# ${lesson.title}\n\n`;
  md += lesson.content.trim();
  md += `\n\n---challenges---\n`;

  // Challenges
  if (lesson.challenges && Array.isArray(lesson.challenges)) {
    for (const ch of lesson.challenges) {
      md += `\n### Challenge: ${ch.title}\n\n`;
      md += `- id: ${ch.id}\n`;
      md += `- language: ${ch.language || 'python'}\n`;
      md += `- difficulty: ${ch.difficulty || 'beginner'}\n\n`;
      
      md += `#### Starter Code\n\n\`\`\`${ch.language || 'python'}\n${ch.starterCode?.trim()}\n\`\`\`\n\n`;
      md += `#### Expected Output\n\n\`\`\`\n${ch.expectedOutput?.trim()}\n\`\`\`\n\n`;
      
      md += `#### Hints\n\n`;
      ch.hints?.forEach((hint, i) => {
        md += `${i + 1}. ${hint}\n`;
      });

      md += `\n#### Solution\n\n\`\`\`${ch.language || 'python'}\n${ch.solution?.trim()}\n\`\`\`\n`;
    }
  }

  return md;
}

async function main() {
  console.log(`Processing ${lessons.length} lessons...`);

  for (const lesson of lessons) {
    const mdContent = formatMarkdown(lesson);
    const fileName = `${lesson.id}.md`;
    writeFileSync(join(OUT_DIR, fileName), mdContent, 'utf-8');
    console.log(`  [ok] Created ${fileName}`);
  }

  console.log(`\nSuccess! All files written to ${OUT_DIR}`);
}

main();