/**
 * Migrate Hexo posts to Astro Content Collections format
 */
import fs from 'fs';
import path from 'path';

const HEXO_POSTS_DIR = path.resolve('source/_posts');
const ASTRO_POSTS_DIR = path.resolve('src/content/posts');

// Ensure output directory exists
fs.mkdirSync(ASTRO_POSTS_DIR, { recursive: true });

const files = fs.readdirSync(HEXO_POSTS_DIR).filter((f) => f.endsWith('.md'));

console.log(`Found ${files.length} posts to migrate...\n`);

for (const file of files) {
  const content = fs.readFileSync(path.join(HEXO_POSTS_DIR, file), 'utf-8');

  // Parse front matter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.warn(`  Skipping ${file}: no front matter found`);
    continue;
  }

  const fmRaw = fmMatch[1];
  const body = fmMatch[2];

  // Parse YAML fields manually (simple key: value)
  const fm = {};
  for (const line of fmRaw.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) {
      fm[m[1]] = m[2].trim();
    }
  }

  // Extract date from front matter or filename
  const dateStr = fm.date || file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || '';

  // Convert tags to array
  let tags = [];
  if (fm.tags) {
    // Remove quotes
    const tagStr = fm.tags.replace(/['"]/g, '');
    tags = tagStr.includes(',')
      ? tagStr.split(',').map((t) => t.trim())
      : [tagStr.trim()];
  }

  // Category
  const category = (fm.categories || 'uncategorized').replace(/['"]/g, '');

  // Keywords
  const keywords = (fm.keywords || '').replace(/['"]/g, '');

  // Description: extract from body before <!-- more -->
  const moreIdx = body.indexOf('<!-- more -->');
  let description = '';
  if (moreIdx > -1) {
    description = body
      .slice(0, moreIdx)
      .replace(/^#+ .*/gm, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 160);
  } else {
    description = body
      .replace(/^#+ .*/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 160);
  }

  // Fix image paths: /images/xxx -> /images/xxx (keep as public path)
  let newBody = body;
  // We'll keep images in public/images/ so paths stay the same

  // Build new front matter
  const title = (fm.title || '').replace(/"/g, '\\"');
  const newFm = [
    '---',
    `title: "${title}"`,
    `pubDate: ${dateStr}`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `author: "Peter"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    `category: "${category}"`,
    keywords ? `keywords: "${keywords.replace(/"/g, '\\"')}"` : null,
    'draft: false',
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  // Generate filename: remove date prefix for cleaner slugs
  const slug = file
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.md$/, '')
    .toLowerCase();
  const outFile = `${slug}.md`;

  const output = `${newFm}\n${newBody}`;
  fs.writeFileSync(path.join(ASTRO_POSTS_DIR, outFile), output, 'utf-8');
  console.log(`  ✓ ${file} → ${outFile}`);
}

console.log(`\nMigration complete! ${files.length} posts migrated.`);
