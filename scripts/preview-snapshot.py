#!/usr/bin/env python3
"""Snapshot the worktree into a preview tree, leaving out content files that do
not parse yet.

While dozens of agents are writing books and games into src/, any one file
caught mid-write breaks Vite for every screen (books are collected with an
eager import.meta.glob). This copies src/ into a preview directory, links
public/ and node_modules, drops any book or game module esbuild cannot parse,
and leaves Vite to serve that.

    python3 scripts/preview-snapshot.py
"""
from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

SRC = Path.cwd()
DST = Path.home() / 'my_stuff/kids-stuff/.redesign/preview'
CONTENT = ('src/books/data', 'src/maths/games', 'src/science/games')


def parses(path: Path) -> bool:
    r = subprocess.run(['npx', 'esbuild', str(path), '--log-level=error', '--format=esm', '--outfile=/dev/null'],
                       capture_output=True, text=True)
    return r.returncode == 0


def main() -> int:
    DST.mkdir(parents=True, exist_ok=True)
    for name in ('index.html', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'package.json'):
        if (SRC / name).exists():
            shutil.copyfile(SRC / name, DST / name)
    for name in ('node_modules', 'public'):
        link = DST / name
        if not link.is_symlink():
            if link.exists():
                shutil.rmtree(link)
            os.symlink(SRC / name, link)
    target = DST / 'src'
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(SRC / 'src', target, ignore=shutil.ignore_patterns('_*.ts', 'tmp-*.test.tsx'))
    dropped = []
    for d in CONTENT:
        for f in (DST / d).glob('*.ts*'):
            if not parses(f):
                f.unlink()
                dropped.append(f.name)
    print('snapshot ->', DST, '| dropped (not parsing yet):', ', '.join(dropped) or 'none')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
