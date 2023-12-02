# Observations

## Day 1:

- Incorrect types for Statistics component:
  - `number` prop too strict
  - `children` required but it shouldn't be
- Still guessing on file structure:
  - Can't have subdirectories under app/extensions? I want to group files by extension
  - Error messages are not that great at helping developer understand the rules
- Not captured: I believe I saw a setInterval not being appropriately cancelled
  - After local dev change that triggers reload, I observed what looked like two separate interval updates running
  - This looks like a jittery UI that was double-updating just slightly off from each other


