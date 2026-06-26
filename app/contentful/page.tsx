'use client'

import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const CONTENTFUL_APP = 'https://app.contentful.com'
/** wa.me: AR móvil CABA/GBA — 11 4075-3025 */
const WHATSAPP_DEVELOPER = 'https://wa.me/5491140753025'

const externalLinkClass = cn(
  'font-medium text-foreground underline decoration-[#B2CF53] decoration-2 underline-offset-[3px]',
  'transition-colors hover:text-muted-foreground hover:decoration-[#B2CF53]/80',
)

const expandable = cn('rounded-lg border border-border bg-muted/25')

const summaryStyles = cn(
  'cursor-pointer select-none px-4 py-3.5 text-left text-sm font-medium text-foreground',
  'list-none [&::-webkit-details-marker]:hidden',
  'flex flex-wrap items-baseline justify-between gap-2 gap-y-1',
  'rounded-t-lg outline-none hover:bg-muted/30',
  'focus-visible:ring-2 focus-visible:ring-[#B2CF53]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

const summaryHint = 'text-xs font-normal text-muted-foreground'

const expandableBody = 'border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground'

export default function ContentfulGuidePage() {
  const { t, language } = useLanguage()
  const tc = (key: string) => t(`contentfulGuide.${key}`)

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <div className="grid-container pb-16 pt-nav-2 lg:pb-24">
        <article
          className="col-span-12 grid w-full grid-cols-12 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-12"
          lang={language}
        >
          <header className="col-span-12 border-b border-border pb-8 lg:col-span-12">
            <p className="uppercase-title mb-3 text-muted-foreground">{tc('kicker')}</p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {tc('title')}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {tc('intro')}
            </p>
          </header>

          <ol className="col-span-12 list-none space-y-9 md:space-y-10 lg:col-span-8 lg:min-w-0 [&>li]:m-0">
            <li className="flex gap-4 md:gap-5">
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
                aria-hidden
              >
                1
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tc('step1Title')}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  <a href={CONTENTFUL_APP} target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                    app.contentful.com
                  </a>{' '}
                  {tc('step1AfterLink')}
                </p>
              </div>
            </li>

            <li className="flex gap-4 md:gap-5">
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
                aria-hidden
              >
                2
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tc('step2Title')}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{tc('step2Body')}</p>
              </div>
            </li>

            <li className="flex gap-4 md:gap-5">
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
                aria-hidden
              >
                3
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tc('step3Title')}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {tc('step3Before')}
                  <strong className="text-foreground">{tc('step3MenuStrong')}</strong>
                  {tc('step3After')}
                </p>
                <details className={expandable}>
                  <summary className={summaryStyles}>
                    <span>{tc('step3FaqQ')}</span>
                    <span className={summaryHint}>{tc('optional')}</span>
                  </summary>
                  <div className={expandableBody}>{tc('step3FaqBody')}</div>
                </details>
              </div>
            </li>

            <li className="flex gap-4 md:gap-5">
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
                aria-hidden
              >
                4
              </span>
              <div className="min-w-0 flex-1 space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tc('step4Title')}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{tc('step4Intro')}</p>

                <div className="rounded-lg border border-border bg-card px-4 py-3 text-[15px] leading-relaxed text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">{tc('step4ImageHeading')}</p>
                  <p>{tc('step4ImageP1')}</p>
                  <p className="border-t border-border pt-2 text-foreground">{tc('step4ImageP2')}</p>
                </div>

                <details className={expandable}>
                  <summary className={summaryStyles}>
                    <span>{tc('step4WhyQ')}</span>
                    <span className={summaryHint}>{tc('step4WhyHint')}</span>
                  </summary>
                  <div className={cn(expandableBody, 'space-y-3')}>
                    <p>
                      {tc('step4WhyLead')}
                      <strong className="text-foreground">{tc('step4WhyAsset')}</strong>
                      {tc('step4WhyMid')}
                      <strong className="text-foreground">{tc('step4WhyPublished')}</strong>
                      {tc('step4WhyTail')}
                      <a
                        href="https://www.contentful.com/developers/docs/concepts/links/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={externalLinkClass}
                      >
                        {tc('step4WhyLink')}
                      </a>
                      {tc('step4WhyAfterLink')}
                    </p>
                  </div>
                </details>

                <details className={expandable}>
                  <summary className={summaryStyles}>
                    <span>{tc('step4RefQ')}</span>
                    <span className={summaryHint}>{tc('step4RefHint')}</span>
                  </summary>
                  <div className={cn(expandableBody, 'space-y-4')}>
                    <ol className="list-decimal space-y-2 pl-5 [&>li]:pl-1">
                      <li>
                        {tc('step4RefLi1a')}
                        <strong className="text-foreground">{tc('mediaLabel')}</strong>
                        {tc('step4RefLi1b')}
                        <a
                          href="https://www.contentful.com/help/media/managing-assets/publish-an-asset"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={externalLinkClass}
                        >
                          {tc('step4RefLi1Link')}
                        </a>
                        {tc('step4RefLi1c')}
                      </li>
                      <li>{tc('step4RefLi2')}</li>
                    </ol>
                    <p>
                      {tc('step4RefPBefore')}
                      <strong className="text-foreground">{tc('referencesLabel')}</strong>
                      {tc('step4RefPAfter')}
                      <a
                        href="https://www.contentful.com/help/references/publish-references"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={externalLinkClass}
                      >
                        {tc('step4RefLink')}
                      </a>
                      {tc('step4RefClose')}
                    </p>
                  </div>
                </details>
              </div>
            </li>

            <li className="flex gap-4 md:gap-5 pb-2">
              <span
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
                aria-hidden
              >
                5
              </span>
              <div className="min-w-0 flex-1 space-y-4">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{tc('step5Title')}</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{tc('step5Body')}</p>
                <details className={expandable}>
                  <summary className={summaryStyles}>
                    <span>{tc('step5ImgQ')}</span>
                    <span className={summaryHint}>{tc('step5ImgHint')}</span>
                  </summary>
                  <div className={expandableBody}>{tc('step5ImgBody')}</div>
                </details>
              </div>
            </li>
          </ol>

          <section
            className="col-span-12 mt-8 border-t border-border pt-10 lg:col-span-4 lg:mt-0 lg:border-l lg:border-border lg:border-t-0 lg:pt-0 lg:pl-6 lg:sticky lg:top-28 lg:self-start"
            aria-labelledby="more-label"
          >
            <h2 id="more-label" className="uppercase-title mb-4 text-muted-foreground">
              {tc('moreTitle')}
            </h2>
            <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground lg:text-sm">
              {tc('moreIntro')}
            </p>
            <div className="space-y-2">
              <details className={expandable}>
                <summary className={summaryStyles}>
                  <span>{tc('moreEnvQ')}</span>
                  <span className={summaryHint}>{tc('moreEnvHint')}</span>
                </summary>
                <div className={expandableBody}>{tc('moreEnvBody')}</div>
              </details>
              <details className={expandable}>
                <summary className={summaryStyles}>
                  <span>{tc('moreAltQ')}</span>
                  <span className={summaryHint}>{tc('moreAltHint')}</span>
                </summary>
                <div className={expandableBody}>{tc('moreAltBody')}</div>
              </details>
              <details className={expandable}>
                <summary className={summaryStyles}>
                  <span>{tc('moreDelayQ')}</span>
                  <span className={summaryHint}>{tc('moreDelayHint')}</span>
                </summary>
                <div className={expandableBody}>{tc('moreDelayBody')}</div>
              </details>
            </div>
          </section>

          <footer className="col-span-12 mt-12 border-t border-border pt-8 text-[15px] leading-relaxed text-muted-foreground">
            {tc('footerBefore')}{' '}
            <a
              href={WHATSAPP_DEVELOPER}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClass}
            >
              WhatsApp
            </a>
            {tc('footerAfter')}
          </footer>
        </article>
      </div>
    </div>
  )
}
