import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Replace standalone text-slate-400 and text-slate-500, avoiding those preceded by dark:
    content = re.sub(r'(?<!dark:)text-slate-500', 'text-[var(--text-muted)]', content)
    content = re.sub(r'(?<!dark:)text-slate-400', 'text-[var(--text-muted)]', content)

    # Some remaining bg-slate-50 etc
    content = re.sub(r'(?<!dark:)bg-slate-50(?!/)', 'bg-[var(--surface-elevated)]', content)
    
    # Fix the Loading overlay in RecoveryPage
    content = re.sub(r'bg-slate-900/90 backdrop-blur-md', 'bg-[var(--surface)]/90 backdrop-blur-md', content)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    src_dir = os.path.join('frontend', 'src')
    walk_dir(src_dir)
