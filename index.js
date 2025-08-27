require('dotenv').config()
const restify = require('restify')
const { CloudAdapter, ConfigurationServiceClientCredentialFactory, createBotFrameworkAuthenticationFromConfiguration } = require('botbuilder')
const { GuncelBot } = require('./bot')

// --- Credentials from .env
const config = {
  MicrosoftAppId: process.env.MICROSOFT_APP_ID,
  MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD,
  MicrosoftAppType: process.env.MICROSOFT_APP_TYPE || 'MultiTenant',
  MicrosoftAppTenantId: process.env.MICROSOFT_APP_TENANT_ID || undefined,
}

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: config.MicrosoftAppId,
  MicrosoftAppPassword: config.MicrosoftAppPassword,
  MicrosoftAppType: config.MicrosoftAppType,
  MicrosoftAppTenantId: config.MicrosoftAppTenantId
})

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory)
const adapter = new CloudAdapter(botFrameworkAuthentication)

// Global error handler
adapter.onTurnError = async (context, error) => {
  console.error('[onTurnError]', error)
  try { await context.sendActivity('Bir hata oluştu, lütfen tekrar deneyin.') } catch {}
}

const bot = new GuncelBot()

// Create server
const server = restify.createServer()
server.use(restify.plugins.bodyParser())
const PORT = process.env.PORT || 3978
server.post('/api/messages', async (req, res) => {
  await adapter.process(req, res, (context) => bot.run(context))
})
server.listen(PORT, () => {
  console.log(`✅ Bot listening on port ${PORT}`)
  console.log(`→ Set your Messaging endpoint to: https://<your-ngrok-id>.ngrok.io/api/messages`)
})
