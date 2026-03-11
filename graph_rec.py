import json
import matplotlib.pyplot as plt

def load_data():
    """Load data from maxRecursionDepth.json and sizes.json"""
    with open('maxRecursionDepth.json', 'r') as f:
        max_recursion_data = json.load(f)
    
    with open('sizes.json', 'r') as f:
        sizes_data = json.load(f)
    
    return max_recursion_data, sizes_data

def calculate_metrics(max_recursion_data, sizes_data):
    """Calculate average optimization rate and time for each depth"""
    depths = sorted([int(d) for d in max_recursion_data.keys()])
    avg_optimization_rates = []
    avg_times = []
    
    for depth in depths:
        depth_str = str(depth)
        optimization_rates = []
        times = []
        
        for name, metrics in max_recursion_data[depth_str].items():
            # Get the baseline size from sizes.json
            baseline_key = f"{name}_rollup_terser.gz"
            if baseline_key in sizes_data:
                baseline_size = sizes_data[baseline_key]
                if baseline_size > 0:
                    # Calculate optimization rate: 1 - (minifiedGz / baseline)
                    optimization_rate = 1 - (metrics['minifiedGz'] / baseline_size)
                    optimization_rates.append(optimization_rate)
            
            # Collect time
            times.append(metrics['time'])
        
        # Calculate averages
        if optimization_rates:
            avg_optimization_rates.append(sum(optimization_rates) / len(optimization_rates))
        else:
            avg_optimization_rates.append(0)
        
        if times:
            avg_times.append(sum(times) / len(times))
        else:
            avg_times.append(0)
    
    return depths, avg_optimization_rates, avg_times

def plot_graph(depths, avg_optimization_rates, avg_times):
    """Plot the optimization rate and time vs depth"""
    fig, ax1 = plt.subplots(figsize=(6, 3.5))
    
    # Plot time on the left y-axis
    color = 'tab:orange'
    ax1.set_xlabel(r'$\mathsf{MaxRecDepth}$', fontsize=12)
    ax1.set_ylabel('Average Build Time (ms)', fontsize=12, color=color)
    line1 = ax1.plot(depths, avg_times, 's-', color=color, linewidth=2, markersize=8, label='Build Time')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.set_ylim(bottom=0)
    ax1.grid(True, alpha=0.15, linewidth=0.3)
    
    # Create a second y-axis for optimization rate
    ax2 = ax1.twinx()
    color = 'tab:blue'
    ax2.set_ylabel('Average Code Size Reduction (%)', fontsize=12, color=color)
    # Convert to percentage for display
    avg_optimization_rates_pct = [rate * 100 for rate in avg_optimization_rates]
    line2 = ax2.plot(depths, avg_optimization_rates_pct, 'o-', color=color, linewidth=2, markersize=8, label='Size Reduction')
    ax2.tick_params(axis='y', labelcolor=color)
    
    # Make ax1 draw on top of ax2
    ax1.set_zorder(ax2.get_zorder() + 1)
    ax1.patch.set_visible(False)
    
    # Set x-axis to show integer depths
    ax1.set_xticks(depths)
    
    # Add legend
    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc='upper left')
    
    plt.tight_layout()
    plt.savefig('graph3_depth_analysis.png', dpi=300, bbox_inches='tight')
    print('Graph saved as graph3_depth_analysis.png')
    plt.show()

def main():
    max_recursion_data, sizes_data = load_data()
    depths, avg_optimization_rates, avg_times = calculate_metrics(max_recursion_data, sizes_data)
    
    # Print summary
    print("Depth Analysis Summary:")
    print("-" * 60)
    print(f"{'Depth':<10} {'Reduction (%)':<20} {'Avg Time (ms)':<15}")
    print("-" * 60)
    for d, opt_rate, time in zip(depths, avg_optimization_rates, avg_times):
        print(f"{d:<10} {opt_rate * 100:<20.3f} {time:<15.2f}")
    print("-" * 60)
    
    plot_graph(depths, avg_optimization_rates, avg_times)

if __name__ == '__main__':
    main()
