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

# Configuration: Set to True to use black and white with hatch patterns instead of colors
NO_COLOR = True

# Configuration: Set to a number (e.g., 60) to truncate x-axis at that value (showing as 100), or False to disable
TRUNCATE_AT = False

# Configuration: Set to True to hide DCE (Basic DCE) labels on bars
NO_DCE_LABEL = True

# Configuration: Set to True to remove spacing between bars
NO_BAR_SPACING = True

# Read ablation data
with open('ablation.json', 'r') as f:
    data = json.load(f)

# Prepare data for plotting
test_cases = []
part1_ratios = []  # DCE
part2_ratios = []  # CF
part3_ratios = []  # PM
part4_ratios = []  # BF
error_ratios = []

# Accumulators for total calculation
total_original = 0
total_cf_off_pm_off = 0
total_cf_on_pm_off = 0
total_cf_on_pm_on = 0
total_no_bf = 0

for name, results in data.items():
    # Select data based on USE_GZ flag
    suffix = '.gz' if USE_GZ else ''
    original = results[f'original{suffix}']
    all_on = results[f'bf_true_cf_enabled_pm_enabled{suffix}']
    no_bf = results[f'bf_false_cf_enabled_pm_enabled{suffix}']
    cf_off_pm_off = results[f'bf_true_cf_disabled_pm_disabled{suffix}']
    cf_on_pm_off = results[f'bf_true_cf_enabled_pm_disabled{suffix}']

    # Accumulate totals
    total_original += original
    total_cf_off_pm_off += cf_off_pm_off
    total_cf_on_pm_off += cf_on_pm_off
    total_cf_on_pm_on += all_on
    total_no_bf += no_bf

    # Total optimization amount (denominator for all percentages)
    total_optimization = original - all_on

    # Calculate each optimization step's contribution as percentage of total optimization
    # Part 1: Constant Folding - additional optimization beyond DCE
    cf_contribution = (cf_off_pm_off - cf_on_pm_off) / total_optimization * 100

    # Part 2: Property Mangling - additional optimization beyond DCE + CF
    pm_contribution = (cf_on_pm_off - all_on) / total_optimization * 100

    # Part 3: Branch Folding - independent optimization (BF on vs off, both with CF+PM)
    bf_contribution = (no_bf - all_on) / total_optimization * 100

    # Part 4: DCE (Dead Code Elimination) - remaining contribution
    dce_contribution = 100 - cf_contribution - pm_contribution - bf_contribution

    # Part 5: Error/remaining (should be close to 0 if calculations are correct)
    error_ratio = 100 - dce_contribution - cf_contribution - pm_contribution - bf_contribution

    test_cases.append(name)
    part1_ratios.append(dce_contribution)
    part2_ratios.append(cf_contribution)
    part3_ratios.append(pm_contribution)
    part4_ratios.append(bf_contribution)
    error_ratios.append(error_ratio)

# Calculate total (aggregate) percentages
if TOTAL_BY_VOLUME:
    # Calculate by volume sum
    total_optimization = total_original - total_cf_on_pm_on
    total_dce_contribution = (total_original - total_cf_off_pm_off) / total_optimization * 100
    total_cf_contribution = (total_cf_off_pm_off - total_cf_on_pm_off) / total_optimization * 100
    total_pm_contribution = (total_cf_on_pm_off - total_no_bf) / total_optimization * 100
    total_bf_contribution = (total_no_bf - total_cf_on_pm_on) / total_optimization * 100
else:
    # Calculate by percentage average
    total_dce_contribution = np.mean(part1_ratios)
    total_cf_contribution = np.mean(part2_ratios)
    total_pm_contribution = np.mean(part3_ratios)
    total_bf_contribution = np.mean(part4_ratios)

# Add total to the lists (insert at beginning so it appears at bottom of chart)
test_cases.insert(0, 'Average')
part1_ratios.insert(0, total_dce_contribution)
part2_ratios.insert(0, total_cf_contribution)
part3_ratios.insert(0, total_pm_contribution)
part4_ratios.insert(0, total_bf_contribution)
error_ratios.insert(0, 100 - total_dce_contribution - total_cf_contribution - total_pm_contribution - total_bf_contribution)

# Create horizontal stacked bar chart
# When NO_BAR_SPACING is enabled, reduce figure height proportionally to maintain bar thickness
fig_height_scale = 0.58 if NO_BAR_SPACING else 1.0
fig, ax = plt.subplots(figsize=(12, len(test_cases) * 0.36 * fig_height_scale))

y_pos = np.arange(len(test_cases))

# Determine bar height based on spacing configuration
bar_height = 1.0 if NO_BAR_SPACING else 0.58

# Remove y-axis padding when NO_BAR_SPACING is enabled
if NO_BAR_SPACING:
    ax.set_ylim(-0.5, len(test_cases) - 0.5)

# Stack the bars (order: BF, CF, PM, DCE)
if NO_COLOR:
    # Use black and white with different hatch patterns
    p1 = ax.barh(y_pos, part4_ratios, height=bar_height, color='white', edgecolor='black', 
                 hatch='xxx', linewidth=0.5, label='Branch Folding')
    p2 = ax.barh(y_pos, part2_ratios, height=bar_height, left=part4_ratios,
                 color='white', edgecolor='black', hatch='///', linewidth=0.5,
                 label='Constant Folding')
    p3 = ax.barh(y_pos, part3_ratios, height=bar_height,
                 left=np.array(part4_ratios) + np.array(part2_ratios),
                 color='white', edgecolor='black', hatch='\\\\\\', linewidth=0.5,
                 label='Property Mangling')
    p4 = ax.barh(y_pos, part1_ratios, height=bar_height,
                 left=np.array(part4_ratios) + np.array(part2_ratios) + np.array(part3_ratios),
                 color='white', edgecolor='black', linewidth=0.5,
                 label='Base DCE' if not NO_DCE_LABEL else '_nolegend_')
else:
    # Use colors
    p1 = ax.barh(y_pos, part4_ratios, height=bar_height, color='#D4A373', label='Branch Folding')
    p2 = ax.barh(y_pos, part2_ratios, height=bar_height, left=part4_ratios,
                 color='#7CB342', label='Constant Folding')
    p3 = ax.barh(y_pos, part3_ratios, height=bar_height,
                 left=np.array(part4_ratios) + np.array(part2_ratios),
                 color='#5B9BD5', label='Property Mangling')
    p4 = ax.barh(y_pos, part1_ratios, height=bar_height,
                 left=np.array(part4_ratios) + np.array(part2_ratios) + np.array(part3_ratios),
                 color='#E8956F', label='Base DCE' if not NO_DCE_LABEL else '_nolegend_')

# Customize the plot
ax.set_yticks(y_pos)
ax.set_yticklabels(test_cases)
# Make 'Average' label bold
for i, label in enumerate(ax.get_yticklabels()):
    if label.get_text() == 'Average':
        label.set_weight('bold')
# ax.set_xlabel('Additional Size Reduction over Basic Tree-Shaking Baseline (%)')
ax.legend(loc='upper right')

if TRUNCATE_AT:
    ax.set_xlim(0, TRUNCATE_AT)
    ax.tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
    
    # Custom x-axis ticks to show TRUNCATE_AT as 100
    # xticks = [0, 10, 20, 30, 40, 50, TRUNCATE_AT]
    # xticklabels = ['0', '10', '20', '30', '40', '50', '100']
    # ax.set_xticks(xticks)
    # ax.set_xticklabels(xticklabels)
    
    # Draw axis break symbol using official matplotlib method (rotated 90° for horizontal axis)
    d = .5  # Proportion of diagonal to marker size
    
    # Position on bottom axis where break should appear (in axes coordinates 0-1)
    break_positions = [0.915, 0.922]  # Two break symbols near the right end, closer together
    
    # First draw white line to mask the axis line between the break marks
    ax.plot(break_positions, [0, 0], transform=ax.transAxes,
            color='white', linewidth=3, solid_capstyle='butt', clip_on=False, zorder=10)
    
    # Then draw break marks on top of the white line
    kwargs = dict(
        marker=[(-d, -1), (d, 1)],  # Rotated 90° from vertical example
        markersize=8,
        linestyle="none", 
        color='k', 
        mec='k', 
        mew=1, 
        clip_on=False,
        zorder=11
    )
    ax.plot(break_positions, [0, 0], transform=ax.transAxes, **kwargs)
else:
    ax.set_xlim(0, 100)
    ax.tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)

# Add grid for better readability
ax.grid(axis='x', alpha=0.3, linestyle='--')

# Add percentage labels on bars (order: BF, CF, PM, DCE)
for i, (bf, cf, pm, dce) in enumerate(zip(part4_ratios, part2_ratios, part3_ratios, part1_ratios)):
    # Only show labels if segment is large enough
    if NO_COLOR:
        # For black and white mode, add white background box for text clarity
        bbox_props = dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='none', alpha=0.9)
        text_color = 'black'
    else:
        bbox_props = None
        text_color = 'white'
    
    if bf > 2:
        ax.text(bf/2, i, f'{bf:.1f}%', ha='center', va='center', fontsize=8, 
                color=text_color, weight='bold', bbox=bbox_props)
    if cf > 2:
        ax.text(bf + cf/2, i, f'{cf:.1f}%', ha='center', va='center', fontsize=8, 
                color=text_color, weight='bold', bbox=bbox_props)
    if pm > 2:
        ax.text(bf + cf + pm/2, i, f'{pm:.1f}%', ha='center', va='center', fontsize=8, 
                color=text_color, weight='bold', bbox=bbox_props)
    if dce > 2 and not NO_DCE_LABEL:
        dce_start = bf + cf + pm
        
        if TRUNCATE_AT:
            # For DCE, calculate visible portion when truncation is enabled
            dce_end = dce_start + dce
            
            # If DCE bar extends beyond visible range
            if dce_end > TRUNCATE_AT:
                # Calculate the visible portion of DCE bar
                visible_dce_start = dce_start
                visible_dce_end = TRUNCATE_AT
                visible_dce_width = visible_dce_end - visible_dce_start
                
                # Place text in the middle of visible portion, or near the end if too narrow
                if visible_dce_width > 6:
                    text_x = visible_dce_start + visible_dce_width / 2
                else:
                    text_x = visible_dce_end - 3
            else:
                # DCE fully visible, use center
                text_x = dce_start + dce / 2
        else:
            # No truncation, always use center
            text_x = dce_start + dce / 2
        
        ax.text(text_x, i, f'{dce:.1f}%', ha='center', va='center', fontsize=8, 
                color=text_color, weight='bold', bbox=bbox_props)

plt.tight_layout()
plt.savefig('ablation_analysis.png', dpi=300, bbox_inches='tight')
print('Graph saved to ablation_analysis.png')

# Print summary statistics
print('\n=== Summary Statistics ===')
print(f'{"Test Case":<15} {"CF":<10} {"PM":<10} {"BF":<10} {"DCE":<10}')
print('-' * 65)
for name, cf, pm, bf, dce in zip(test_cases, part2_ratios, part3_ratios, part4_ratios, part1_ratios):
    print(f'{name:<15} {cf:>8.1f}% {pm:>9.1f}% {bf:>9.1f}% {dce:>9.1f}%')
