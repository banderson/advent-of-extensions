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
- Adding card to middle pane and then switching it to sidebar... it works great, but the CRM Admin UI is a bit misleading in that it's configured to display on a TAB, not the sidebar in the UI


## Day 3:

- minified react error: learn more link goes to hubspot.com
- everything works great locally with no app.functions/package.json but upload:
  - > "[ERROR] Couldn't build serverless package because `package.json` is not found under `/app/app.functions/`. Create `package.json` and try again."
  - This isn't listed as a requirement in the official docs
- I REALLY miss an interactive component explorer for building a good UI
- LoadingSpinner
  - title required? Is this for accessibility?
  - layout default not listed in docs
- adding project component (serverless in this case) manually feels like flying blind. This is one downside of explicit-everything approach for config
- are serverless docs wrong? there's no use of sendResponse and instead it has a plain return but that doesn't work for me
- typo in [serverless docs](https://app.hubspotqa.com/docs/865673741/doc/platform/serverless-functions)?
  - > "Within your project file structure, serverless functions live in the src/app directory within a ..functions folder. "
  - `endpoint` notes: does this mean I can't include endpoint
    - > "Please note: to call an endpoint in a serverless function, your account must have a CMS Hub Enterprise subscription and a Sales Hub or Service Hub Enterprise subscription."
  - trailing comma in `endpoint` object example JSON
