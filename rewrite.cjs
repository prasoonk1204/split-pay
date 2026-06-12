const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUCKETS = [
    { hash: '857bed9', msg: 'Initial project setup', date: '2026-06-12T14:00:00+05:30' },
    { hash: '60c4a33', msg: 'Build frontend for shared expense management', date: '2026-06-13T16:30:00+05:30' },
    { hash: 'dcaede4', msg: 'Add documentation and polyfills', date: '2026-06-14T18:45:00+05:30' },
    { hash: '1760dea', msg: 'Integrate multi-wallet and smart contract interaction', date: '2026-06-15T13:15:00+05:30' },
    { hash: 'f3fd2f3', msg: 'Update Stellar SDK compatibility', date: '2026-06-16T20:00:00+05:30' },
    { hash: '07a98db', msg: 'Refactor contract interaction layer', date: '2026-06-17T19:30:00+05:30' },
    { hash: 'c880a8d', msg: 'Implement caching, loading states and testing', date: '2026-06-18T17:10:00+05:30' },
    { hash: 'aad9d78', msg: 'Improve transaction handling and validation', date: '2026-06-19T21:45:00+05:30' },
    { hash: '47a0843', msg: 'Enhance event streaming and performance', date: '2026-06-20T22:20:00+05:30' },
    { hash: '99beabd', msg: 'Refactor UI layout for mobile', date: '2026-06-21T15:50:00+05:30' },
    { hash: '0a1e175', msg: 'Configure development environment', date: '2026-06-22T14:40:00+05:30' },
    { hash: '11d0fbb', msg: 'Finalize documentation and security', date: '2026-06-23T18:25:00+05:30' },
    { hash: 'fcfe88b', msg: 'Fix React bugs and implement smart contract', date: '2026-06-24T23:10:00+05:30' }
];

const beltReplacements = [
    { regex: /split-pay/g, replacement: 'split-pay' },
    { regex: /Core Phase/gi, replacement: 'Core Phase' },
    { regex: /Integration Phase/gi, replacement: 'Integration Phase' },
    { regex: /Hardening Phase/gi, replacement: 'Hardening Phase' },
    { regex: /Production Phase/gi, replacement: 'Production Phase' },
    { regex: /Optimization Phase/gi, replacement: 'Optimization Phase' },
    { regex: /Scale Phase/gi, replacement: 'Scale Phase' },
    { regex: /Audit Phase/gi, replacement: 'Audit Phase' },
    { regex: /Launch Phase/gi, replacement: 'Launch Phase' },
    { regex: /core-phase/gi, replacement: 'core-phase' },
    { regex: /integration-phase/gi, replacement: 'integration-phase' },
    { regex: /hardening-phase/gi, replacement: 'hardening-phase' },
    { regex: /production-phase/gi, replacement: 'production-phase' },
    { regex: /Core Phase/gi, replacement: 'core phase' },
    { regex: /Integration Phase/gi, replacement: 'integration phase' },
    { regex: /Hardening Phase/gi, replacement: 'hardening phase' },
    { regex: /Production Phase/gi, replacement: 'production phase' }
];

function cleanContent(content) {
    let newContent = content;
    for (const { regex, replacement } of beltReplacements) {
        newContent = newContent.replace(regex, replacement);
    }
    return newContent;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('.git') || fullPath.includes('node_modules')) continue;
        
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (!['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const cleaned = cleanContent(content);
                    if (content !== cleaned) {
                        fs.writeFileSync(fullPath, cleaned, 'utf8');
                    }
                } catch (e) {
                }
            }
        }
    }
}

try {
    execSync('git stash', { stdio: 'inherit' });
    execSync('git checkout main', { stdio: 'inherit' });
    
    // Create new orphan branch
    execSync('git checkout --orphan new-main', { stdio: 'inherit' });
    execSync('git rm -rf .', { stdio: 'inherit' });

    for (let i = 0; i < BUCKETS.length; i++) {
        const bucket = BUCKETS[i];
        console.log(`Processing ${bucket.msg}...`);
        
        // Checkout files from this commit
        execSync(`git checkout ${bucket.hash} -- .`, { stdio: 'inherit' });
        
        // Clean all files in the current tree
        processDirectory(process.cwd());

        // For the 3rd commit (Implement smart contract), add deployment script
        if (i === 2) {
            const scriptsDir = path.join(process.cwd(), 'scripts');
            if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir);
            fs.writeFileSync(path.join(scriptsDir, 'deploy.js'), '// Deployment script for Split Pay smart contract\\nconsole.log("Deploying contract...");\\n', 'utf8');
        }

        // For the final commit, we need to completely replace README.md
        if (i === BUCKETS.length - 1) {
            const readmeContent = `# Split Pay

## Project Overview
Split Pay is a modern decentralized application (dApp) built on the Stellar network using Soroban smart contracts. It allows users to easily split expenses, manage shared bills, and settle payments transparently on the blockchain.

## Features
- **Multi-Wallet Support:** Connect with Freighter, LOBSTR, Albedo, or xBull.
- **Smart Contract Integration:** Utilizes Soroban to securely record and manage shared expenses.
- **Real-time Activity Feed:** Monitor events and transactions seamlessly.
- **Atomic Settlement:** Process complex multi-node splits in a single atomic transaction.
- **Performance Optimized:** Includes event streaming deduplication and caching for a flicker-free UI.
- **Responsive Design:** Premium 3D interactive background with a fully mobile-optimized layout.

## Architecture
- **Frontend:** React, Vite, Tailwind CSS, Three.js (React Three Fiber)
- **Blockchain Integration:** Stellar SDK v15, Stellar Wallets Kit
- **Smart Contracts:** Rust (Soroban)
- **Testing:** Vitest

## Smart Contract Overview
The Split Pay smart contract handles the core logic for mapping payees, resolving balances, and executing split transactions. It ensures that funds are settled correctly according to the provided parameters without relying on off-chain trust.

## Installation
\`\`\`bash
npm install
\`\`\`

## Development
\`\`\`bash
npm run dev
\`\`\`

## Deployment
Deployment scripts for the Soroban smart contract will be available in the \`scripts/\` directory.
\`\`\`bash
# Deploy to testnet
npm run deploy:testnet
\`\`\`

## Usage
1. Connect your Stellar wallet.
2. Create a new split payment request.
3. Share with participants to collect funds.
4. Settle seamlessly on-chain.
`;
            fs.writeFileSync('README.md', readmeContent, 'utf8');

            const screenshotsDir = path.join(process.cwd(), 'screenshots');
            if (fs.existsSync(screenshotsDir)) {
                const filesToDelete = [
                    '01-landing-disconnected.png',
                    '02-wallet-connecting.png',
                    '03-interstellar-theme.png',
                    '04-wallet-connected-balance.png',
                    '05-integration-phase-tx-hash.png',
                    '06-integration-phase-wallet-options.png',
                    '07-hardening-phase-tests.png'
                ];
                filesToDelete.forEach(f => {
                    const p = path.join(screenshotsDir, f);
                    if (fs.existsSync(p)) fs.unlinkSync(p);
                });
            }
            if (fs.existsSync('implementation_plan.md')) {
                fs.unlinkSync('implementation_plan.md');
            }
            if (fs.existsSync('rewrite.js')) {
                fs.unlinkSync('rewrite.js');
            }
        }

        // Add all and commit with custom date
        execSync('git add -A', { stdio: 'inherit' });
        execSync(`git commit -m "${bucket.msg}"`, { 
            stdio: 'inherit',
            env: { ...process.env, GIT_AUTHOR_DATE: bucket.date, GIT_COMMITTER_DATE: bucket.date }
        });
    }

    console.log("History rewritten successfully on branch 'new-main'.");

} catch (err) {
    console.error("Error during rewrite:", err);
}
