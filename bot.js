const { TeamsActivityHandler, TurnContext } = require('botbuilder')

function cleanText(activity) {
  let text = TurnContext.removeRecipientMention(activity) || activity.text || ''
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim()
  // Teams sometimes wraps with <at> tags; strip them
  text = text.replace(/<at>.*?<\/at>/gi, '').trim()
  return text
}

function isValidUrl(u) {
  try {
    const x = new URL(u)
    return x.protocol === 'http:' || x.protocol === 'https:'
  } catch {
    return false
  }
}

class GuncelBot extends TeamsActivityHandler {
  constructor() {
    super()
    // In-memory store (reset on restart). Replace with Azure Table/SharePoint later.
    this.domains = new Set([
      'https://www.betgaranti9914.com',
      'https://www.betgaranti1041.com',
    ])

    this.onMessage(async (context, next) => {
      const raw = cleanText(context.activity)
      const text = raw.toLowerCase()

      try {
        if (text === '/guncel' || text === '/güncel') {
          await this.handleGuncel(context)
        } else if (text.startsWith('/ekle ')) {
          const url = raw.split(' ').slice(1).join(' ').trim()
          await this.handleEkle(context, url)
        } else if (text.startsWith('/sil ') || text.startsWith('/pasif ')) {
          const url = raw.split(' ').slice(1).join(' ').trim()
          await this.handleSil(context, url)
        } else if (text === '/yardim' || text === '/help') {
          await this.handleYardim(context)
        } else {
          // Optional: ignore or show help
          // await this.handleYardim(context)
        }
      } catch (e) {
        console.error('handler error', e)
        await context.sendActivity('Bir hata oluştu.')
      }

      await next()
    })
  }

  async handleGuncel(ctx) {
    if (!this.domains.size) {
      await ctx.sendActivity('Şu an aktif domain kayıtlı değil.')
      return
    }
    const list = Array.from(this.domains)
    const text = '🔁 *Güncel domainler:*\n' + list.map((d, i) => `${i + 1}. ${d}`).join('\n')
    await ctx.sendActivity({ text })
  }

  async handleEkle(ctx, url) {
    if (!url || !isValidUrl(url)) {
      await ctx.sendActivity('Kullanım: `/ekle https://alan.adı`')
      return
    }
    this.domains.add(url)
    await ctx.sendActivity('✅ Eklendi ve aktif.')
  }

  async handleSil(ctx, url) {
    if (!url || !isValidUrl(url)) {
      await ctx.sendActivity('Kullanım: `/sil https://alan.adı`')
      return
    }
    this.domains.delete(url)
    await ctx.sendActivity('🟡 Pasife alındı.')
  }

  async handleYardim(ctx) {
    await ctx.sendActivity(
      'Komutlar:\n' +
      '`/guncel` – Aktif domainleri listele\n' +
      '`/ekle <url>` – Yeni domain ekle (aktif)\n' +
      '`/sil <url>` – Domaini pasif yap\n' +
      '`/yardim` – Komutları göster\n'
    )
  }
}

module.exports = { GuncelBot }
