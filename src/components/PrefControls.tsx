import { PREF_GROUPS, type Prefs } from '../prefs';
import { OptButton, SANS } from '../ui';

/** The four preference groups (size, spacing, font, width). Used in the Aa panel and in Article C. */
export function PrefGroups({ prefs, setPrefs }: { prefs: Prefs; setPrefs: (p: Partial<Prefs>) => void }) {
  return (
    <>
      {PREF_GROUPS.map((g) => (
        <div key={g.key} role="group" aria-label={g.label} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px 6px' }}>
          <span style={{ minWidth: 120, font: `500 14px ${SANS}`, color: 'var(--color-text-muted)' }}>{g.label}</span>
          {g.labels.map((l, i) => (
            <OptButton key={l} on={prefs[g.key] === i} onClick={() => setPrefs({ [g.key]: i })} label={g.arias ? g.arias[i] : l} minWidth>
              {l}
            </OptButton>
          ))}
        </div>
      ))}
    </>
  );
}
