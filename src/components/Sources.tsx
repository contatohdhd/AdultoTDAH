import type { Source } from '../content/articles';
import { C, MONO } from '../ui';

export const SOURCES: Record<Source, { label: string; short: string; color: string; desc: string }> = {
  ref: {
    label: 'Referência bibliográfica', short: 'Referência', color: 'var(--tdh-mark-ref)',
    desc: 'Dados, explicações, sínteses e informações baseadas em livros, artigos ou outras fontes documentadas. A referência original será identificada.',
  },
  personal: {
    label: 'Experiência pessoal', short: 'Experiência', color: 'var(--tdh-mark-personal)',
    desc: 'Relatos, comentários, opiniões, ferramentas próprias e estratégias que experimentei. Representam minha trajetória e não devem ser interpretados como resultados universais.',
  },
  pro: {
    label: 'Participação profissional', short: 'Profissional', color: 'var(--tdh-mark-pro)',
    desc: 'Contribuições de profissionais identificados por nome e especialidade, com indicação do tipo de participação. Uma revisão técnica será informada somente quando tiver sido efetivamente realizada.',
  },
};
export const SOURCE_COLOR_NAME: Record<Source, string> = { ref: 'Amarelo', personal: 'Laranja', pro: 'Azul' };

/** Written tag that follows a highlight, so meaning never depends on colour alone. */
export function SourceTag({ src }: { src: Source }) {
  return (
    <span
      style={{
        display: 'inline-block', marginLeft: '0.3em', padding: '0 0.4em', borderRadius: 4, border: `1px solid ${C.divider}`,
        font: `500 0.62em/1.6 ${MONO}`, letterSpacing: '.04em', textTransform: 'uppercase', color: C.muted, verticalAlign: '0.15em',
        wordSpacing: 0,
      }}
    >
      <span className="sr-only">Fonte: </span>{SOURCES[src].short}
    </span>
  );
}

/** Legend of the three provenance colours. */
export function SourceLegend({ detailed = false }: { detailed?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: detailed ? 'column' : 'row', flexWrap: 'wrap', gap: detailed ? 'var(--space-6)' : '8px 20px' }}>
      {(Object.keys(SOURCES) as Source[]).map((k) => (
        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: detailed ? 640 : undefined }}>
          <span>
            <mark style={{ background: SOURCES[k].color, color: C.text, padding: '1px 6px', borderRadius: 2 }}>{SOURCE_COLOR_NAME[k]}</mark>{' '}
            <span style={{ fontWeight: detailed ? 600 : 400 }}>{SOURCES[k].label}</span>
          </span>
          {detailed && <span style={{ color: C.muted, lineHeight: 'var(--leading-body)' }}>{SOURCES[k].desc}</span>}
        </div>
      ))}
    </div>
  );
}
