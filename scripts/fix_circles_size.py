#!/usr/bin/env python3
"""Fix circles size to fit screen"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the grid container
old_line = '        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0 p-1 sm:p-2 md:p-4 lg:p-6 xl:p-8" style={{aspectRatio: \'1/1\'}}>'

new_lines = '''        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full max-w-[100vh] max-h-screen grid grid-cols-10 grid-rows-10 gap-0 p-1 sm:p-2 md:p-3 lg:p-4 aspect-square">'''

content = content.replace(old_line, new_lines)

# Also need to close the extra div - find the closing tag
# Find the position after all circles are rendered
old_closing = '        </div>\n      )}'
new_closing = '          </div>\n        </div>\n      )}'

content = content.replace(old_closing, new_closing, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed circles size to fit screen")
