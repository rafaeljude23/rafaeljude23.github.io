#!/usr/bin/env python3
"""
sync_includes.py — sync a shared header/footer across static HTML pages.

WHY THIS APPROACH
------------------
Your pages stay 100% static HTML (great for SEO). Instead of loading the
header/footer with JavaScript in the browser, this script updates them
directly in each file whenever you edit the master header.html / footer.html.
Search engines and crawlers always see complete, final HTML — nothing missing.

ONE-TIME SETUP
--------------
1. Put ONLY the header markup in a file named header.html (in the same
   folder you'll run this script from). No <html>/<body> tags, just the
   header block itself (e.g. <header>...</header>).
2. Put ONLY the footer markup in footer.html, same idea.
3. In EVERY page that should use them, wrap the existing header/footer
   sections with these HTML comment markers (replacing the duplicated
   markup already there with just the marker-wrapped version):

     <!-- SYNC:HEADER:START -->
     ... paste current header markup here (matches header.html) ...
     <!-- SYNC:HEADER:END -->

     ... unique page content stays untouched ...

     <!-- SYNC:FOOTER:START -->
     ... paste current footer markup here (matches footer.html) ...
     <!-- SYNC:FOOTER:END -->

   (Tip: if you have 30-50 files, use find-and-replace in your editor to
   wrap the known duplicated block with the START/END comments quickly.)

ONGOING USAGE
-------------
Whenever you edit header.html or footer.html, just run:

    python3 sync_includes.py

from the folder containing your site (or pass a path):

    python3 sync_includes.py ./my-site

It will scan every .html file recursively, find the marker blocks, and
replace their contents with the current header.html / footer.html content.
Files without markers are reported so you know which still need setup.
"""
import sys
import re
import pathlib

HEADER_RE = re.compile(
    r'(<!--\s*SYNC:HEADER:START\s*-->)(.*?)(<!--\s*SYNC:HEADER:END\s*-->)',
    re.DOTALL,
)
FOOTER_RE = re.compile(
    r'(<!--\s*SYNC:FOOTER:START\s*-->)(.*?)(<!--\s*SYNC:FOOTER:END\s*-->)',
    re.DOTALL,
)


def main():
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    header_path = root / 'header.html'
    footer_path = root / 'footer.html'

    if not header_path.exists() or not footer_path.exists():
        print(f"ERROR: expected to find {header_path} and {footer_path}.")
        print("Create these two master files first (see instructions at the top of this script).")
        sys.exit(1)

    header_content = header_path.read_text(encoding='utf-8').strip()
    footer_content = footer_path.read_text(encoding='utf-8').strip()

    updated = []
    no_markers = []

    for html_file in sorted(root.rglob('*.html')):
        if html_file.name in ('header.html', 'footer.html'):
            continue

        text = html_file.read_text(encoding='utf-8')
        original = text
        has_header_marker = bool(HEADER_RE.search(text))
        has_footer_marker = bool(FOOTER_RE.search(text))

        if has_header_marker:
            text = HEADER_RE.sub(
                lambda m: f"{m.group(1)}\n{header_content}\n{m.group(3)}", text
            )
        if has_footer_marker:
            text = FOOTER_RE.sub(
                lambda m: f"{m.group(1)}\n{footer_content}\n{m.group(3)}", text
            )

        if text != original:
            html_file.write_text(text, encoding='utf-8')
            updated.append(str(html_file.relative_to(root)))

        if not has_header_marker and not has_footer_marker:
            no_markers.append(str(html_file.relative_to(root)))

    print(f"Synced {len(updated)} file(s):")
    for f in updated:
        print(f"  updated: {f}")

    if no_markers:
        print(f"\n{len(no_markers)} file(s) had no SYNC markers and were skipped:")
        for f in no_markers:
            print(f"  skipped: {f}")
        print("\nAdd the SYNC:HEADER / SYNC:FOOTER comment markers to these files (see top of script).")


if __name__ == '__main__':
    main()
