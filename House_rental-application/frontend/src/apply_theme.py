import os
import re

COLORS = {
    "'#fff'": "'var(--bg-secondary)'",
    "'#ffffff'": "'var(--bg-secondary)'",
    '"#fff"': '"var(--bg-secondary)"',
    "'#f8f7f4'": "'var(--bg-primary)'",
    '"#f8f7f4"': '"var(--bg-primary)"',
    "'#1a1a2e'": "'var(--text-main)'",
    '"#1a1a2e"': '"var(--text-main)"',
    "'#4a4a5a'": "'var(--text-muted)'",
    '"#4a4a5a"': '"var(--text-muted)"',
    "'#7a7a9a'": "'var(--text-light)'",
    '"#7a7a9a"': '"var(--text-light)"',
    "'#eaeaea'": "'var(--border-color)'",
    '"#eaeaea"': '"var(--border-color)"',
    "'#c9a84c'": "'var(--accent-color)'",
    '"#c9a84c"': '"var(--accent-color)"',
    "'#e8e4dc'": "'var(--border-color)'", # For Login/Register input borders
    "'#f0ede8'": "'var(--bg-primary)'" # Icon wrapper
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in COLORS.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('/home/gedi/Desktop/_PROJECTS/personnel/mahi-project/house-rental-system/House_rental-application/frontend/src'):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            process_file(os.path.join(root, file))
