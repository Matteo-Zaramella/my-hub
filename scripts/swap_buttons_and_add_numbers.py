#!/usr/bin/env python3
"""
1. Swap wishlist (0) and registration (10) positions
2. Replace colors with numbers (1 for wishlist, 2 for registration)
3. Number visible only when button is active
"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Swap positions - Wishlist from 10 to 0, Registration from 0 to 10
content = content.replace(
    '// Top left corner (position 0) - Registration form\n            const isRegistration = index === 0\n            // Position 1 (below registration) - Public Wishlist\n            const isWishlist = index === 10',
    '// Top left corner (position 0) - Public Wishlist (numero 1)\n            const isWishlist = index === 0\n            // Position 10 (below wishlist) - Registration form (numero 2)\n            const isRegistration = index === 10'
)

# 2. Remove color fills and replace with number display logic
old_fill_logic = '''          // Determine circle fill based on clues found
          let circleFill = ''

          // Cerchio iscrizione (posizione 0) - rosso SOLO se form abilitato E utente NON registrato
          if (isRegistration && !userRegistered && registrationFormEnabled) {
            circleFill = 'bg-red-500'
          } else if (isWishlist && wishlistEnabled) {
            // Cerchio wishlist (posizione 10) - blu SOLO se abilitato
            circleFill = 'bg-blue-500'
          } else if (isMultiMinigame) {'''

new_fill_logic = '''          // Determine circle fill and number display
          let circleFill = ''
          let showNumber = false
          let buttonNumber = ''

          // Cerchio wishlist (posizione 0) - numero 1 SOLO se abilitato
          if (isWishlist && wishlistEnabled) {
            showNumber = true
            buttonNumber = '1'
          } else if (isRegistration && !userRegistered && registrationFormEnabled) {
            // Cerchio iscrizione (posizione 10) - numero 2 SOLO se form abilitato E utente NON registrato
            showNumber = true
            buttonNumber = '2'
          } else if (isMultiMinigame) {'''

content = content.replace(old_fill_logic, new_fill_logic)

# 3. Update button rendering to show numbers instead of colored fill
old_button = '''                className="flex items-center justify-center w-full aspect-square p-0.5 sm:p-1 md:p-1.5 lg:p-2" style={{height: 'auto'}}
              >
                <div className={`w-full h-full rounded-full border border-white sm:border-2 ${circleFill} transition-colors duration-500`}></div>
              </button>'''

new_button = '''                className="flex items-center justify-center w-full aspect-square p-0.5 sm:p-1 md:p-1.5 lg:p-2" style={{height: 'auto'}}
              >
                <div className={`w-full h-full rounded-full border border-white sm:border-2 ${circleFill} transition-colors duration-500 flex items-center justify-center`}>
                  {showNumber && (
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg bg-black rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center">
                      {buttonNumber}
                    </span>
                  )}
                </div>
              </button>'''

content = content.replace(old_button, new_button)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Swapped positions and added numbers")
