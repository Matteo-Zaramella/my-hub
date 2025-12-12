-- Add landing page toggle controls to game_settings table
-- These settings control which buttons are visible on the landing page

INSERT INTO game_settings (setting_key, setting_value, description)
VALUES
  ('registration_button_enabled', true, 'Controls if registration button (numero 2, position 1) is visible on landing page'),
  ('wishlist_button_enabled', true, 'Controls if wishlist button (numero 1, position 0) is visible on landing page'),
  ('password_input_enabled', false, 'Controls if password input for game access (position 99) is enabled')
ON CONFLICT (setting_key)
DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;
