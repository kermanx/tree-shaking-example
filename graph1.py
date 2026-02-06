import json
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

# Configuration: which toolchains to display (ordered mapping from field name to display name)
TOOLCHAINS = {
    "rollup_terser": "Rollup + Terser",
    "rollup_jsshaker_terser": "Rollup + JsShaker + Terser",
    "rollup_gcc_terser": "Rollup + CC + Terser",
    "rollup_jsshaker_gcc_terser": "Rollup + JsShaker + CC + Terser",
}

def load_sizes(filename: str = "sizes.json") -> dict:
    """Load sizes data from JSON file."""
    with open(filename, 'r') as f:
        return json.load(f)

def parse_data(sizes: dict, toolchains: dict) -> dict:
    """Parse sizes data into structured format grouped by test case."""
    data = {}

    for key, value in sizes.items():
        # Skip .gz entries, we'll handle them separately
        if key.endswith('.gz'):
            continue

        # Parse the key: {testcase}_{toolchain}
        # Find where the toolchain starts by checking against known toolchains
        for toolchain in toolchains.keys():
            if key.endswith('_' + toolchain):
                testcase = key[:-len(toolchain)-1]

                if testcase not in data:
                    data[testcase] = {}

                gz_key = f"{key}.gz"
                data[testcase][toolchain] = {
                    'size': value,
                    'gz_size': sizes.get(gz_key, 0)
                }
                break

    return data

def create_chart(data: dict, toolchains: dict, output_file: str = "graph1.png"):
    """Create horizontal bar chart with grouped test cases."""
    # Prepare data for plotting
    testcases = sorted(data.keys())
    num_testcases = len(testcases)
    num_toolchains = len(toolchains)

    # Get the first toolchain (baseline for percentage calculation)
    baseline_toolchain = list(toolchains.keys())[0]

    # Calculate positions
    bar_height = 0.3
    group_spacing = 0.3
    bar_spacing = 0.1

    fig, ax = plt.subplots(figsize=(10, num_testcases * num_toolchains * 0.3 + 0.5))

    # Set font to a clean sans-serif font
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']

    y_positions = []
    y_labels = []

    # Start with larger spacing at top (2x group_spacing)
    current_y = -group_spacing

    # Professional color palette for academic papers (OOPSLA)
    # Using ColorBrewer-inspired colors that work well in print and are colorblind-friendly
    color_palette = [
        '#1f77b4',  # Blue
        '#ff7f0e',  # Orange
        '#2ca02c',  # Green
        '#d62728',  # Red
        '#9467bd',  # Purple
        '#8c564b',  # Brown
    ]
    colors = [color_palette[i % len(color_palette)] for i in range(num_toolchains)]

    for testcase_idx, testcase in enumerate(testcases):
        testcase_y_positions = []

        # Get baseline gz size for this testcase
        baseline_gz_size = data[testcase].get(baseline_toolchain, {}).get('gz_size', 0)

        for i, (toolchain, display_name) in enumerate(toolchains.items()):
            # Skip the baseline toolchain (first one)
            if i == 0:
                continue

            if toolchain not in data[testcase]:
                continue

            size = data[testcase][toolchain]['size']
            gz_size = data[testcase][toolchain]['gz_size']

            # Adjust y position since we're skipping the first toolchain
            y_pos = current_y - (i - 1) * (bar_height + bar_spacing)

            # Check if optimization failed (size <= 20)
            if size <= 20:
                # Draw a red X to indicate optimization failure
                x_position = 20
                ax.plot(x_position, y_pos, marker='x', markersize=10, color='red',
                       markeredgewidth=2, zorder=10)
                ax.text(x_position + 5, y_pos, 'CC Optimization Failed',
                       va='center', fontsize=8, color='red', style='italic')
            else:
                # Calculate percentage relative to baseline
                if baseline_gz_size > 0:
                    percentage = (gz_size / baseline_gz_size) * 100
                else:
                    percentage = 0

                # Draw the bar showing percentage
                ax.barh(y_pos, percentage, bar_height, color=colors[i])

                # Add percentage label (without size in parentheses)
                label_x = percentage + 2
                ax.text(label_x, y_pos, f'{percentage:.1f}%',
                        va='center', fontsize=8, family='monospace')

            y_positions.append(y_pos)
            testcase_y_positions.append(y_pos)

        # Add testcase label only at the middle position of the group
        if testcase_y_positions:
            # Calculate the center y position of the group
            center_y = sum(testcase_y_positions) / len(testcase_y_positions)
            # Add label at center position (closer to the edge)
            ax.text(-5, center_y, testcase, ha='right', va='center', fontsize=9,
                   family='sans-serif', weight='normal')

        current_y -= ((num_toolchains - 1) * (bar_height + bar_spacing) + group_spacing)

    # Set y-axis limits: top padding = group_spacing, bottom padding = group_spacing/3
    ax.set_ylim(current_y - group_spacing / 3, group_spacing)

    # Customize the plot
    ax.tick_params(axis='y', which='both', left=False, labelleft=False)
    ax.set_xlabel('Percentage of Baseline (Gzipped Size)', fontsize=11)
    ax.set_title('Bundle Sizes by Test Case and Toolchain (% of Baseline)', fontsize=13, fontweight='bold')
    ax.grid(axis='x', alpha=0.3, linestyle='--')

    # Add legend - simplified since we only show gz sizes
    legend_elements = []

    # Add toolchain colors (skip the baseline)
    for i, (toolchain, display_name) in enumerate(toolchains.items()):
        if i == 0:  # Skip baseline
            continue
        patch = mpatches.Patch(color=colors[i], label=display_name)
        legend_elements.append(patch)

    ax.legend(handles=legend_elements, loc='lower right', fontsize=8)

    # Adjust layout - minimal padding
    plt.tight_layout(pad=0.1)

    # Minimize margins around the plot, increase right margin for labels
    plt.subplots_adjust(top=0.99, bottom=0.01, left=0.08, right=0.85)

    # Save the figure
    plt.savefig(output_file, dpi=150, bbox_inches='tight')
    print(f"Chart saved to {output_file}")

    # Show the plot
    plt.show()

def main():
    """Main function to generate the chart."""
    # Load data
    sizes = load_sizes()

    # Parse data
    data = parse_data(sizes, TOOLCHAINS)

    # Create chart
    create_chart(data, TOOLCHAINS)

if __name__ == "__main__":
    main()
