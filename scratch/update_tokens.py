import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Backgrounds
    content = re.sub(r'bg-white dark:bg-slate-9[05]0', 'bg-[var(--surface)]', content)
    content = re.sub(r'dark:bg-slate-9[05]0 bg-white', 'bg-[var(--surface)]', content)
    content = re.sub(r'bg-white dark:bg-\[var\(--card\)\]', 'bg-[var(--surface)]', content)
    
    # Sometimes just bg-white or bg-slate-900 without pairing
    content = re.sub(r'bg-slate-50 dark:bg-slate-900/30', 'bg-[var(--surface-hover)]', content)
    content = re.sub(r'bg-slate-50 dark:bg-slate-900/40', 'bg-[var(--surface-hover)]', content)
    content = re.sub(r'bg-slate-50 dark:bg-slate-900/50', 'bg-[var(--surface-hover)]', content)
    content = re.sub(r'bg-slate-50 dark:bg-slate-900', 'bg-[var(--surface-hover)]', content)
    
    # 2. Text colors
    content = re.sub(r'text-slate-900 dark:text-white', 'text-[var(--text-primary)]', content)
    content = re.sub(r'dark:text-white text-slate-900', 'text-[var(--text-primary)]', content)
    content = re.sub(r'text-slate-800 dark:text-white', 'text-[var(--text-primary)]', content)
    content = re.sub(r'text-slate-700 dark:text-slate-300', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-slate-600 dark:text-slate-400', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-slate-600 dark:text-slate-300', 'text-[var(--text-secondary)]', content)
    content = re.sub(r'text-slate-500 dark:text-slate-400', 'text-[var(--text-muted)]', content)
    content = re.sub(r'text-slate-400 dark:text-slate-500', 'text-[var(--text-muted)]', content)
    
    # Some standalone bad text-white in light mode
    # LandingPage has text-white without dark: on some buttons, which is fine (like CTA).
    # But for normal text, we should be careful.
    
    # 3. Borders
    content = re.sub(r'border-slate-200 dark:border-slate-800', 'border-[var(--border)]', content)
    content = re.sub(r'border-slate-300 dark:border-slate-700', 'border-[var(--border)]', content)
    
    # Replace variables where we might have used var(--card) manually before
    content = re.sub(r'bg-\[var\(--card\)\]', 'bg-[var(--surface)]', content)
    content = re.sub(r'text-\[var\(--card-foreground\)\]', 'text-[var(--text-primary)]', content)
    
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
