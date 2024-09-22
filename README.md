# Caido Active Scan

Active Scan is a proof of concept for doing active scans in caido by transforming HTTP requests with custom templates. You can run these templates on any request by right-clicking -> **Plugins** -> **Active Scan: Scan**.  
The plugin is based on https://github.com/bebiksior/Caido403Bypasser with some minor modifications to turn it into a more general scanner.  

## Installation
You need to clone the repository and run `pnpm build`. Then `dist/plugin_package.zip` can be installed on caidos `Plugins` page

## Features
- **Templates**: Templates are YAML files containing:
  - `ID`
  - `Description`
  - `payloadScript`
  - `detectionScript`
- **Payload Script**: The script runs JavaScript on the original request and allows you to send a modified request. You can even return an array of modified requests if you want to send multiple requests from a single template.
- **Detection Script**: The script runs JavaScript on the raw response to the modified request. It should return either `true` (found vulnerability) or `false` (no vulnerability found).
- ~**AI Generate**: You can also use the built-in AI Generate tool! Just provide your OpenAI API key in the settings, and by clicking the AI Generate button, it will create a template for you :D~ (not working in the initial version)

## Payload Script: Exposed Variables & Functions
- `input`: The raw HTTP request string.
- Helper functions to modify the request:
  - `helper.setLine(input, 0, (prev) => prev.toUpperCase())`
  - `helper.setPath(input, (prev) => prev.toUpperCase())`
  - `helper.setQuery(input, (query) => query + '&new=param')`
  - `helper.addQueryParameter(input, "new=param")`
  - `helper.setMethod(input, (prev) => prev.toUpperCase())`
  - `helper.addHeader(input, "Content-Type: application/json")`
  - `helper.removeHeader(input, "Content-Type")`
  - `helper.setBody(input, "hello")`

  Other helper functions:
  - `helper.getMethod(input)`
  - `helper.getPath(input)`
  - `helper.getQuery(input)`
  - `helper.hasHeader(input, "Content-Type")`

## Example Template

```yaml
id: basic-reflected
description: Detects if the value is reflected in the response
enabled: true
payloadScript: >-
  query = new URLSearchParams(helper.getQuery(input));
  let modifiedRequests = [];
  for (const key of query.keys()) {
    let queryClone = new URLSearchParams(helper.getQuery(input))
    queryClone.set(key, "aaabbbcccddd");
    const modifiedRequest = helper.setQuery(input, () => queryClone);
    modifiedRequests.push(modifiedRequest);
  }
  return modifiedRequests;
detectionScript: >-
  return input.includes("aaabbbcccddd")
```
