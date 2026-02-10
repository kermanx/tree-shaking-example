#!/usr/bin/env python3
"""
Visualize ablation study results showing the contribution of different optimizations.

For each test case, shows a horizontal bar divided into three regions:
1. Property mangling only (pm_only) contribution
2. Additional contribution from constant folding + property mangling (cf+pm enabled)
3. Remaining size (not optimized)
"""

import json
import matplotlib.pyplot as plt
import numpy as np

# Configuration: Set to True to use gzip data, False for regular data
USE_GZ = False

# Configuration: Set to True to calculate total by volume sum, False for percentage average
TOTAL_BY_VOLUME = False

# Read ablation data
with open('ablation.json', 'r') as f:
    data = json.load(f)

# Prepare data for plotting
test_cases = []
part1_ratios = []
part2_ratios = []
part3_ratios = []
error_ratios = []

# Accumulators for total calculation
total_original = 0
total_cf_off_pm_off = 0
total_cf_on_pm_off = 0
total_cf_on_pm_on = 0

for name, results in data.items():
    # Select data based on USE_GZ flag
    suffix = '.gz' if USE_GZ else ''
    original = results[f'original{suffix}']
    cf_off_pm_off = results[f'cf_disabled_pm_disabled{suffix}']
    cf_on_pm_off = results[f'cf_enabled_pm_disabled{suffix}']
    cf_on_pm_on = results[f'cf_enabled_pm_enabled{suffix}']

    # Accumulate totals
    total_original += original
    total_cf_off_pm_off += cf_off_pm_off
    total_cf_on_pm_off += cf_on_pm_off
    total_cf_on_pm_on += cf_on_pm_on

    # Total optimization amount (denominator for all percentages)
    total_optimization = original - cf_on_pm_on

    # Calculate each optimization step's contribution as percentage of total optimization
    # Part 1: DCE (Dead Code Elimination) - baseline optimization
    dce_contribution = (original - cf_off_pm_off) / total_optimization * 100

    # Part 2: Constant Folding - additional optimization beyond DCE
    cf_contribution = (cf_off_pm_off - cf_on_pm_off) / total_optimization * 100

    # Part 3: Property Mangling - additional optimization beyond DCE + CF
    pm_contribution = (cf_on_pm_off - cf_on_pm_on) / total_optimization * 100

    # Part 4: Error/remaining (should be close to 0 if calculations are correct)
    error_ratio = 100 - dce_contribution - cf_contribution - pm_contribution

    test_cases.append(name)
    part1_ratios.append(dce_contribution)
    part2_ratios.append(cf_contribution)
    part3_ratios.append(pm_contribution)
    error_ratios.append(error_ratio)

# Calculate total (aggregate) percentages
if TOTAL_BY_VOLUME:
    # Calculate by volume sum
    total_optimization = total_original - total_cf_on_pm_on
    total_dce_contribution = (total_original - total_cf_off_pm_off) / total_optimization * 100
    total_cf_contribution = (total_cf_off_pm_off - total_cf_on_pm_off) / total_optimization * 100
    total_pm_contribution = (total_cf_on_pm_off - total_cf_on_pm_on) / total_optimization * 100
else:
    # Calculate by percentage average
    total_dce_contribution = np.mean(part1_ratios)
    total_cf_contribution = np.mean(part2_ratios)
    total_pm_contribution = np.mean(part3_ratios)

# Add total to the lists
test_cases.append('TOTAL')
part1_ratios.append(total_dce_contribution)
part2_ratios.append(total_cf_contribution)
part3_ratios.append(total_pm_contribution)
error_ratios.append(100 - total_dce_contribution - total_cf_contribution - total_pm_contribution)

# Create horizontal stacked bar chart
fig, ax = plt.subplots(figsize=(12, len(test_cases) * 0.6))

y_pos = np.arange(len(test_cases))

# Stack the bars (order: CF, PM, DCE)
p1 = ax.barh(y_pos, part2_ratios, color='#2ca02c', label='Constant Folding')
p2 = ax.barh(y_pos, part3_ratios, left=part2_ratios,
             color='#1f77b4', label='Property Mangling')
p3 = ax.barh(y_pos, part1_ratios,
             left=np.array(part2_ratios) + np.array(part3_ratios),
             color='#ff7f0e', label='DCE (Dead Code Elimination)')

# Customize the plot
ax.set_yticks(y_pos)
ax.set_yticklabels(test_cases)
ax.set_xlabel('Percentage of Total Optimization (%)')
ax.set_title('Optimization Contribution Analysis\n(Percentages relative to total optimization achieved)')
ax.legend(loc='upper right')
ax.set_xlim(0, 100)

# Add grid for better readability
ax.grid(axis='x', alpha=0.3, linestyle='--')

# Add percentage labels on bars (order: CF, PM, DCE)
for i, (cf, pm, dce) in enumerate(zip(part2_ratios, part3_ratios, part1_ratios)):
    # Only show labels if segment is large enough
    if cf > 3:
        ax.text(cf/2, i, f'{cf:.1f}%', ha='center', va='center', fontsize=8, color='white', weight='bold')
    if pm > 3:
        ax.text(cf + pm/2, i, f'{pm:.1f}%', ha='center', va='center', fontsize=8, color='white', weight='bold')
    if dce > 3:
        ax.text(cf + pm + dce/2, i, f'{dce:.1f}%', ha='center', va='center', fontsize=8, color='white', weight='bold')

plt.tight_layout()
plt.savefig('ablation_analysis.png', dpi=300, bbox_inches='tight')
print('Graph saved to ablation_analysis.png')

# Print summary statistics
print('\n=== Summary Statistics ===')
print(f'{"Test Case":<15} {"CF":<10} {"PM":<10} {"DCE":<10}')
print('-' * 50)
for name, cf, pm, dce in zip(test_cases, part2_ratios, part3_ratios, part1_ratios):
    print(f'{name:<15} {cf:>8.1f}% {pm:>9.1f}% {dce:>9.1f}%')
