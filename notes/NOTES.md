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

## Day 2:

- Would a project component "init" step work to ease npm install burden?
- Why am I getting this?: "[WARNING] Unable to determine if your extension entry point is calling hubspot.extend, this may prevent it from rendering as expected"
- useEffect cancel function never being called?
  - Switching tabs, it always sets up the new interval subscription, but it never seems to invoke the cleanup callback
  - Verify that we're not terminating things without triggering cleanup, if that's even possible? In the devtools it appears that the developer script is torn down and recreated on every local dev change, so let's verify we're not leaking things
  - Repro: toggle the dependency array between undefined and empty array. Gif shows what appears to be growing number of subscriptions staying active
-
