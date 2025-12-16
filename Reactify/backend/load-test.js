/**
 * Load Test Script - Simulate 700 Concurrent Voters
 * 
 * This script simulates multiple participants connecting via Socket.IO
 * and voting simultaneously to test system capacity.
 * 
 * Usage: node load-test.js <sessionId> <pollId> [numParticipants]
 * 
 * Example: node load-test.js 693f38bbb64db0f5e4a97722 poll123 700
 */

import { io } from 'socket.io-client';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const DEFAULT_PARTICIPANTS = 700;

// Parse command line arguments
const sessionId = process.argv[2];
const pollId = process.argv[3];
const numParticipants = parseInt(process.argv[4]) || DEFAULT_PARTICIPANTS;

if (!sessionId || !pollId) {
    console.log(`
Usage: node load-test.js <sessionId> <pollId> [numParticipants]

Arguments:
  sessionId       - The MongoDB ID of the session
  pollId          - The MongoDB ID of the poll to vote on
  numParticipants - Number of concurrent participants (default: 700)

Example:
  node load-test.js 693f38bbb64db0f5e4a97722 poll123 500
`);
    process.exit(1);
}

// Metrics
let connected = 0;
let voted = 0;
let errors = 0;
const startTime = Date.now();
const connectionTimes = [];
const voteTimes = [];

// Create participant simulation
async function simulateParticipant(participantIndex) {
    return new Promise((resolve) => {
        const connStart = Date.now();
        const socket = io(BACKEND_URL, {
            transports: ['websocket'],
            reconnection: false
        });

        const participantId = `load-test-participant-${participantIndex}`;
        const optionIds = ['opt1', 'opt2', 'opt3', 'opt4']; // Common option IDs
        const randomOption = optionIds[Math.floor(Math.random() * optionIds.length)];

        // Connection established
        socket.on('connect', () => {
            const connTime = Date.now() - connStart;
            connectionTimes.push(connTime);
            connected++;

            // Join session
            socket.emit('join-session', { sessionId, participantId });

            // Random delay before voting (0-500ms to simulate human behavior)
            const voteDelay = Math.random() * 500;

            setTimeout(() => {
                const voteStart = Date.now();

                // Submit vote
                socket.emit('submit-answer', {
                    pollId,
                    participantId,
                    answer: randomOption,
                    sessionId
                });

                const voteTime = Date.now() - voteStart;
                voteTimes.push(voteTime);
                voted++;

                // Optional: Submit feedback too
                if (Math.random() > 0.8) { // 20% chance to submit feedback
                    socket.emit('submit-feedback', {
                        pollId,
                        sessionId,
                        participantId,
                        content: `Load test feedback from participant ${participantIndex}`,
                        isPublic: true
                    });
                }

                // Disconnect after voting
                setTimeout(() => {
                    socket.disconnect();
                    resolve({ success: true, connTime, voteTime });
                }, 100);
            }, voteDelay);
        });

        socket.on('connect_error', (err) => {
            errors++;
            console.error(`Participant ${participantIndex} connection error:`, err.message);
            resolve({ success: false, error: err.message });
        });

        // Timeout after 10 seconds
        setTimeout(() => {
            if (!socket.connected) {
                errors++;
                socket.disconnect();
                resolve({ success: false, error: 'Connection timeout' });
            }
        }, 10000);
    });
}

// Progress reporter
function reportProgress() {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write(`\r⏳ Progress: ${connected}/${numParticipants} connected, ${voted} voted, ${errors} errors (${elapsed}s)`);
}

// Run load test
async function runLoadTest() {
    console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 Reactify Load Test                       ║
║   Simulating ${numParticipants.toString().padEnd(4)} concurrent participants     ║
║   Backend: ${BACKEND_URL.padEnd(24)}         ║
║   Session: ${sessionId.substring(0, 24)}  ║
╚═══════════════════════════════════════════════╝
`);

    // Start progress reporter
    const progressInterval = setInterval(reportProgress, 200);

    // Launch all participants concurrently in batches
    const batchSize = 50; // Process in batches to avoid overwhelming
    const batches = Math.ceil(numParticipants / batchSize);

    for (let batch = 0; batch < batches; batch++) {
        const start = batch * batchSize;
        const end = Math.min(start + batchSize, numParticipants);
        const batchPromises = [];

        for (let i = start; i < end; i++) {
            batchPromises.push(simulateParticipant(i));
        }

        await Promise.all(batchPromises);

        // Small delay between batches
        if (batch < batches - 1) {
            await new Promise(r => setTimeout(r, 100));
        }
    }

    clearInterval(progressInterval);

    // Calculate statistics
    const totalTime = (Date.now() - startTime) / 1000;
    const avgConnTime = connectionTimes.length > 0
        ? (connectionTimes.reduce((a, b) => a + b, 0) / connectionTimes.length).toFixed(2)
        : 'N/A';
    const avgVoteTime = voteTimes.length > 0
        ? (voteTimes.reduce((a, b) => a + b, 0) / voteTimes.length).toFixed(2)
        : 'N/A';
    const maxConnTime = connectionTimes.length > 0 ? Math.max(...connectionTimes) : 'N/A';
    const maxVoteTime = voteTimes.length > 0 ? Math.max(...voteTimes) : 'N/A';
    const successRate = ((voted / numParticipants) * 100).toFixed(1);
    const votesPerSecond = (voted / totalTime).toFixed(1);

    console.log(`

╔═══════════════════════════════════════════════╗
║   📊 Load Test Results                        ║
╠═══════════════════════════════════════════════╣
║   Total Participants:  ${numParticipants.toString().padEnd(6)}                  ║
║   Successful Votes:    ${voted.toString().padEnd(6)}                  ║
║   Errors:              ${errors.toString().padEnd(6)}                  ║
║   Success Rate:        ${successRate.padEnd(5)}%                  ║
╠═══════════════════════════════════════════════╣
║   Total Time:          ${totalTime.toFixed(2).padEnd(6)}s                 ║
║   Votes/Second:        ${votesPerSecond.padEnd(6)}                  ║
║   Avg Connection Time: ${avgConnTime.padEnd(6)}ms                 ║
║   Max Connection Time: ${maxConnTime.toString().padEnd(6)}ms                 ║
║   Avg Vote Time:       ${avgVoteTime.padEnd(6)}ms                 ║
║   Max Vote Time:       ${maxVoteTime.toString().padEnd(6)}ms                 ║
╚═══════════════════════════════════════════════╝
`);

    if (successRate >= 95) {
        console.log('✅ PASSED: System handled concurrent votes successfully!');
    } else if (successRate >= 80) {
        console.log('⚠️ WARNING: Some votes failed. Consider optimizing for higher load.');
    } else {
        console.log('❌ FAILED: Significant vote failures. System needs optimization.');
    }

    process.exit(errors > 0 ? 1 : 0);
}

runLoadTest().catch(console.error);
