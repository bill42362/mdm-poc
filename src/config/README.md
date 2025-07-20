# MDM Configuration

This directory contains configuration files for the MDM system.

## Files

### `mdm-params.js`
Server-side configuration file that defines the list of standard MDM parameters that should be excluded when collecting additional parameters for URL generation.

## Usage

### Server-side (Node.js)
```javascript
const { MDM_PARAMS } = require('../config/mdm-params');

// Use MDM_PARAMS to filter out standard MDM parameters
Object.keys(req.query).forEach(key => {
  if (!MDM_PARAMS.includes(key)) {
    additionalParams[key] = req.query[key];
  }
});
```

### Client-side (HTML/JavaScript)
The MDM parameters are dynamically injected by the server when generating the HTML for the WebClip:

```javascript
// Injected by server in generateHTMLData()
window.MDM_PARAMS = ['profileName', 'organization', 'description', 'identifier', 'webClipName', 'webClipURL', 'webClipIcon'];

// Used in HTML
const MDM_PARAMS = window.MDM_PARAMS || ['profileName', 'organization', 'description', 'identifier', 'webClipName', 'webClipURL', 'webClipIcon'];
```

## Adding New MDM Parameters

When adding new standard MDM parameters, update only:

1. `src/config/mdm-params.js` - Server-side configuration

The client-side configuration is automatically injected from the server-side config, ensuring consistency.

## Current MDM Parameters

- `profileName` - Profile display name
- `organization` - Organization name  
- `description` - Profile description
- `identifier` - Profile identifier
- `webClipName` - Web clip name on home screen
- `webClipURL` - HTML filename or full URL
- `webClipIcon` - Icon filename

## Architecture Notes

Since the HTML file is converted to base64 and embedded in the WebClip, external JavaScript files cannot be referenced. The server dynamically injects the MDM configuration into the HTML before converting it to base64, ensuring the configuration is available when the WebClip loads while maintaining a single source of truth. 