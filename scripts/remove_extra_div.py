#!/usr/bin/env python3
"""Remove extra closing div"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove one extra </div>
old_closing = '          })}\n          </div>\n          </div>\n        </div>\n      )}'
new_closing = '          })}\n          </div>\n        </div>\n      )}'

content = content.replace(old_closing, new_closing)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Removed extra closing div")
