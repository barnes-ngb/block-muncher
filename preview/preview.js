'use strict';

const simulator = 'https://trg-arcade.userpxt.io/v4.1.25/---simulator';
const simulatorOrigin = new URL(simulator).origin;
const maxBytes = 4 * 1024 * 1024;
const status = document.getElementById('status');
const game = document.getElementById('game');

function pinnedBuild(search) {
    const query = new URLSearchParams(search);
    const commit = query.get('commit');
    const digest = query.get('sha256');
    if ([...query].length !== 2 || commit?.length !== 40 || digest?.length !== 64 ||
        !/^[0-9a-f]+$/.test(commit) || !/^[0-9a-f]+$/.test(digest)) return null;
    return { commit, digest };
}

async function readBounded(response) {
    if (!response.ok || !response.body ||
        Number(response.headers.get('Content-Length')) > maxBytes) throw new Error('Unavailable build');
    const reader = response.body.getReader();
    const output = new Uint8Array(maxBytes);
    let offset = 0;
    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (offset + value.length > maxBytes) throw new Error('Build exceeds size limit');
            output.set(value, offset);
            offset += value.length;
        }
        return output.subarray(0, offset);
    } catch (error) {
        await reader.cancel().catch(() => {});
        throw error;
    } finally {
        reader.releaseLock();
    }
}

async function verifiedCode(build) {
    const url = 'https://raw.githubusercontent.com/barnes-ngb/block-muncher/' +
        build.commit + '/assets/js/binary.js';
    const response = await fetch(url, {
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(15_000),
    });
    const bytes = await readBounded(response);
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    const digest = Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
    if (digest !== build.digest) throw new Error('Preview checksum differs');
    const code = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const header = code.match(/^\/\/ meta=(.{1,2000})\r?\n/);
    if (!header) throw new Error('Missing Arcade metadata');
    const metadata = JSON.parse(header[1]);
    if (metadata.target !== 'arcade' || metadata.targetVersion !== '4.1.25') {
        throw new Error('Unsupported Arcade version');
    }
    return code;
}

function connectSimulator(code) {
    let started = false;
    const timeout = setTimeout(() => {
        if (!started) {
            status.textContent = 'The game took too long to open. Reload this preview to try again.';
            game.hidden = true;
        }
    }, 20_000);
    function start() {
        game.contentWindow.postMessage({
            type: 'run',
            code,
            version: 'arcade',
            cdnUrl: 'https://cdn.makecode.com/',
            options: { theme: 'green', player: '' },
            id: 'block-muncher-preview',
            parts: [],
            partDefinitions: {},
            storedState: {},
            frameCounter: 1,
        }, simulatorOrigin);
    }
    window.addEventListener('message', event => {
        if (event.origin !== simulatorOrigin || event.source !== game.contentWindow) return;
        if (event.data?.type === 'ready' && !started) {
            started = true;
            clearTimeout(timeout);
            status.hidden = true;
            game.hidden = false;
            start();
        } else if (started && event.data?.type === 'simulator' && event.data.command === 'restart') {
            game.contentWindow.postMessage({ type: 'stop' }, simulatorOrigin);
            start();
        }
    });
    game.src = simulator;
}

async function openPreview() {
    const build = pinnedBuild(location.search);
    if (!build) {
        status.textContent = 'Open the preview link from your Block Muncher request.';
        return;
    }
    try {
        connectSimulator(await verifiedCode(build));
    } catch {
        status.textContent = 'This build could not be checked. Reload the preview, or ask for a new link.';
    }
}

openPreview();
