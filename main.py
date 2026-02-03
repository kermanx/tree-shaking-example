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

def create_chart(data: dict, toolchains: dict, output_file: str = "chart.png"):
    """Create horizontal bar chart with grouped test cases."""
    # Prepare data for plotting
    testcases = sorted(data.keys())
    num_testcases = len(testcases)
    num_toolchains = len(toolchains)

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

    # Colors for different toolchains - professional color scheme for papers
    # Using a more elegant color palette suitable for academic publications
    color_palette = [
        '#2E86AB',  # Deep Blue
        '#A23B72',  # Magenta
        '#F18F01',  # Orange
        '#C73E1D',  # Red
        '#6A994E',  # Green
        '#BC4B51',  # Rose
    ]
    colors = [color_palette[i % len(color_palette)] for i in range(num_toolchains)]

    for testcase_idx, testcase in enumerate(testcases):
        testcase_y_positions = []

        for i, (toolchain, display_name) in enumerate(toolchains.items()):
            if toolchain not in data[testcase]:
                continue

            size = data[testcase][toolchain]['size']
            gz_size = data[testcase][toolchain]['gz_size']

            y_pos = current_y - i * (bar_height + bar_spacing)

            # Check if optimization failed (size <= 20)
            if size <= 20:
                # Draw a red X to indicate optimization failure
                x_position = 2000
                ax.plot(x_position, y_pos, marker='x', markersize=10, color='red',
                       markeredgewidth=2, zorder=10)
                ax.text(x_position + 3000, y_pos, 'CC Optimization Failed',
                       va='center', fontsize=8, color='red', style='italic')
            else:
                # Draw the full bar (non-gzipped size) with lighter color
                import matplotlib.colors as mcolors
                # Convert hex to RGB and add transparency
                rgb = mcolors.to_rgb(colors[i])
                light_color = (*rgb, 0.4)  # Make it semi-transparent
                ax.barh(y_pos, size, bar_height, color=light_color,
                       edgecolor=colors[i], linewidth=1.5)

                # Draw the gzipped size bar (darker color) on top
                ax.barh(y_pos, gz_size, bar_height, color=colors[i])

                # Add size labels
                label_x = size + max(size * 0.02, 1000)
                ax.text(label_x, y_pos, f'{gz_size:,} ({size:,})',
                        va='center', fontsize=8, family='monospace')

            y_positions.append(y_pos)
            testcase_y_positions.append(y_pos)

        # Add testcase label only at the middle position of the group
        if testcase_y_positions:
            # Calculate the center y position of the group
            center_y = sum(testcase_y_positions) / len(testcase_y_positions)
            # Add label at center position (closer to the edge)
            ax.text(-1500, center_y, testcase, ha='right', va='center', fontsize=9,
                   family='sans-serif', weight='normal')

        current_y -= (num_toolchains * (bar_height + bar_spacing) + group_spacing)

    # Set y-axis limits: top padding = group_spacing, bottom padding = group_spacing/3
    ax.set_ylim(current_y - group_spacing / 3, group_spacing)

    # Customize the plot
    ax.tick_params(axis='y', which='both', left=False, labelleft=False)
    ax.set_xlabel('Size (bytes)', fontsize=11)
    ax.set_title('Bundle Sizes by Test Case and Toolchain', fontsize=13, fontweight='bold')
    ax.grid(axis='x', alpha=0.3, linestyle='--')

    # Add legend
    import matplotlib.colors as mcolors
    from matplotlib.patches import Rectangle
    from matplotlib.legend_handler import HandlerBase
    from matplotlib.text import Text

    # Custom handler to draw a split rectangle with text on top
    class SplitRectHandler(HandlerBase):
        def create_artists(self, legend, orig_handle, xdescent, ydescent,
                          width, height, fontsize, trans):
            # Make the rectangle much wider and taller
            full_width = width * 12
            full_height = height * 2.5

            # Shift down to avoid exceeding the top border
            y_offset = -full_height * 0.5

            # Left half - dark (gzipped)
            left_rect = Rectangle((xdescent, ydescent + y_offset), full_width/2, full_height,
                                 facecolor=orig_handle.get_facecolor(),
                                 edgecolor='black', linewidth=0.5,
                                 transform=trans)
            # Right half - light (non-gzipped)
            rgb = mcolors.to_rgb(orig_handle.get_facecolor())
            right_rect = Rectangle((xdescent + full_width/2, ydescent + y_offset), full_width/2, full_height,
                                  facecolor=(*rgb, 0.4),
                                  edgecolor='black', linewidth=0.5,
                                  transform=trans)

            # Add text labels on top of rectangles
            left_text = Text(xdescent + full_width/4, ydescent + y_offset + full_height/2,
                           'Gzipped Size', ha='center', va='center',
                           fontsize=7, color='white', weight='bold',
                           transform=trans)
            right_text = Text(xdescent + full_width*3/4, ydescent + y_offset + full_height/2,
                            'Non-gzipped Size', ha='center', va='center',
                            fontsize=7, color='black', weight='bold',
                            transform=trans)

            return [left_rect, right_rect, left_text, right_text]

    legend_elements = []

    # Add explanation patch with split colors (empty label since text is on the patch)
    split_patch = mpatches.Patch(color=colors[0], label='')
    legend_elements.append(split_patch)

    # Add separator (empty label)
    legend_elements.append(mpatches.Patch(color='none', label=''))

    # Add toolchain colors
    for i, (toolchain, display_name) in enumerate(toolchains.items()):
        patch = mpatches.Patch(color=colors[i], label=display_name)
        legend_elements.append(patch)

    ax.legend(handles=legend_elements, loc='lower right', fontsize=8,
             handler_map={split_patch: SplitRectHandler()})

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
