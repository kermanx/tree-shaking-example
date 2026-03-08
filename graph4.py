import json
import matplotlib.pyplot as plt

# ─── Constants ────────────────────────────────────────────────────────────────
FIG_WIDTH  = 5.5    # inches
FIG_HEIGHT = 3.2    # inches
DPI        = 300
OUTPUT     = 'missReason.png'

MISS_KEYS = {
    'missConfigDisabled':      'Config Disabled',
    'missNonCopyableThis':     'Non-copyable this',
    'missNonCopyableArgs':     'Non-copyable Args',
    'missRestParams':          'Rest Params',
    'missNonCopyableReturn':   'Non-copyable Return',
    'missStateUntrackable':    'State Untrackable',
    'missReadDepIncompatible': 'Read Dep. Incompatible',
    'missCacheEmpty':          'Cache Empty',
}

# Colorblind-friendly palette
COLORS = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
]

# Minimum slice percentage to show label inside the pie
MIN_AUTOPCT = 4.0

# ─── Load & aggregate ─────────────────────────────────────────────────────────
with open('fnSummary.json', 'r') as f:
    summary = json.load(f)

totals = {k: 0 for k in MISS_KEYS}
for name, entry in summary.items():
    if name.startswith('__'):
        continue
    fn = entry['fnCache']
    for k in MISS_KEYS:
        totals[k] += fn.get(k, 0)

keys_used   = [k for k in MISS_KEYS if totals[k] > 0]
sizes       = [totals[k] for k in keys_used]
labels      = [MISS_KEYS[k] for k in keys_used]
colors      = [COLORS[list(MISS_KEYS).index(k) % len(COLORS)] for k in keys_used]

# ─── Plot ─────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(FIG_WIDTH, FIG_HEIGHT))

total = sum(sizes)

wedges, _, autotexts = ax.pie(
    sizes,
    colors=colors,
    autopct=lambda pct: f'{pct:.1f}%' if pct >= MIN_AUTOPCT else '',
    startangle=90,
    pctdistance=0.72,
)
for t in autotexts:
    t.set_fontsize(8)

legend_labels = [f'{lbl} ({s / total * 100:.1f}%)' for lbl, s in zip(labels, sizes)]
ax.legend(wedges, legend_labels,
          loc='center left', bbox_to_anchor=(1.0, 0.5),
          fontsize=8, frameon=False)

plt.tight_layout()
plt.savefig(OUTPUT, dpi=DPI, bbox_inches='tight')
print(f'Saved to {OUTPUT}')
