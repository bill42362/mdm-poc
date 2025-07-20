// MDM Parameters Configuration
// This file contains the list of standard MDM parameters that should be excluded
// when collecting additional parameters for URL generation

const MDM_PARAMS = [
  'profileName',
  'organization', 
  'description',
  'identifier',
  'webClipName',
  'webClipURL',
  'webClipIcon'
];

module.exports = {
  MDM_PARAMS
}; 