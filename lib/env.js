const development = {
  "API_DOMAIN": "http://127.0.0.1:5001/xlfc-e8f8f/us-central1/{{endpoint}}/",
  "APP_NAME": "XLFC Dev",
  "BUNDLE_ID": "com.stuka.xlfc.dev"
}

const production = {
  "API_DOMAIN": "https://{{endpoint}}-hhjsyj7q4q-uc.a.run.app/",
  "APP_NAME": "XLFC",
  "BUNDLE_ID": "com.stuka.xlfc"
}

const env = process.env.NODE_ENV == 'production' ? production : development
// const env = production

env.API_DOMAIN_WITH_ENDPOINT = (endpoint) => 
  env.API_DOMAIN.replace('{{endpoint}}', endpoint)

export default env