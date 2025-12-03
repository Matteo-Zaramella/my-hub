#!/usr/bin/env python3
"""Fix registration position to index 1 (second circle, first row)"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Change registration from position 10 to position 1
content = content.replace(
    '// Top left corner (position 0) - Public Wishlist (numero 1)\n            const isWishlist = index === 0\n            // Position 10 (below wishlist) - Registration form (numero 2)\n            const isRegistration = index === 10',
    '// Position 0 (first circle, first row) - Public Wishlist (numero 1)\n            const isWishlist = index === 0\n            // Position 1 (second circle, first row) - Registration form (numero 2)\n            const isRegistration = index === 1'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed registration position to index 1")
