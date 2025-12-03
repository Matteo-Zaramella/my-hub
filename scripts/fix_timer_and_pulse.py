#!/usr/bin/env python3
"""Fix timer responsive and remove pulse animation from circle 95"""

file_path = r'D:\Claude\my-hub\app\LandingPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove animate-pulse from circle 95
content = content.replace(
    "circleFill = 'bg-red-600 animate-pulse'",
    "circleFill = 'bg-red-600'"
)

# 2. Fix timer size - make it smaller and more responsive
old_timer = '''      {/* Countdown Timer - Center (4x4 circles area) - Nascosto quando countdown finito */}
      {!(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && cluesFound < 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white">'''

new_timer = '''      {/* Countdown Timer - Center (4x4 circles area) - Nascosto quando countdown finito */}
      {!(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && cluesFound < 10 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">'''

content = content.replace(old_timer, new_timer)

# Also update Hours, Minutes, Seconds with same size
old_size = 'text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl'
new_size = 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'

# Replace remaining occurrences (Hours, Minutes, Seconds)
content = content.replace(old_size, new_size)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed timer size and removed pulse animation")
