import json
import matplotlib.pyplot as plt
import math

def load_data():
    """Load data from maxRecDepthTime.json, maxRecDepthSize.json and sizes.json"""
    with open('../data/maxRecDepthTime.json', 'r') as f:
        time_data = json.load(f)
    
    with open('../data/maxRecDepthSize.json', 'r') as f:
        size_data = json.load(f)
    
    with open('../data/sizes.json', 'r') as f:
        sizes_data = json.load(f)
    
    return time_data, size_data, sizes_data

def calculate_metrics(time_data, size_data, sizes_data):
    """Calculate average optimization rate and time for each depth using geometric mean for ratios"""
    depths = sorted([int(d) for d in time_data.keys()])
    avg_optimization_rates = []
    avg_times = []
    
    for depth in depths:
        depth_str = str(depth)
        ratios = []  # Store size ratios (optimized/baseline)
        times = []
        
        # Get all test case names from time_data
        for name in time_data[depth_str].keys():
            # Get the baseline size from sizes.json
            baseline_key = f"{name}_rollup_terser.gz"
            if baseline_key in sizes_data:
                baseline_size = sizes_data[baseline_key]
                # Get the size for this depth from size_data
                size_key = f"{name}_rollup_jsshaker_terser.gz"
                if size_key in size_data[depth_str] and baseline_size > 0:
                    # Store the size ratio (optimized_size / baseline_size)
                    ratio = size_data[depth_str][size_key] / baseline_size
                    ratios.append(ratio)
            
            # Collect time from time_data
            times.append(time_data[depth_str][name])
        
        # Calculate geometric mean of size ratios, then convert to optimization rate
        if ratios:
            # Geometric mean: (r1 * r2 * ... * rn)^(1/n)
            geometric_mean_ratio = math.exp(sum(math.log(r) for r in ratios) / len(ratios))
            # Convert to optimization rate: 1 - geometric_mean_ratio
            avg_optimization_rates.append(1 - geometric_mean_ratio)
        else:
            avg_optimization_rates.append(0)
        
        # Use arithmetic mean for time (additive quantity)
        if times:
            avg_times.append(sum(times) / len(times))
        else:
            avg_times.append(0)
    
    return depths, avg_optimization_rates, avg_times

def print_detailed_tables(time_data, size_data, sizes_data):
    """Print detailed tables showing time and optimization rate for each test case at each depth"""
    depths = sorted([int(d) for d in time_data.keys()])
    
    # Collect all test case names
    all_names = set()
    for depth_str in time_data.keys():
        all_names.update(time_data[depth_str].keys())
    test_cases = sorted(all_names)
    
    # Build time table data
    time_table = {}
    opt_rate_table = {}
    
    for name in test_cases:
        time_table[name] = {}
        opt_rate_table[name] = {}
        
        for depth in depths:
            depth_str = str(depth)
            if name in time_data[depth_str]:
                # Time from time_data
                time_table[name][depth] = time_data[depth_str][name]
                
                # Optimization rate
                baseline_key = f"{name}_rollup_terser.gz"
                size_key = f"{name}_rollup_jsshaker_terser.gz"
                if baseline_key in sizes_data and size_key in size_data[depth_str]:
                    baseline_size = sizes_data[baseline_key]
                    current_size = size_data[depth_str][size_key]
                    if baseline_size > 0:
                        opt_rate = (1 - current_size / baseline_size) * 100
                        opt_rate_table[name][depth] = opt_rate
                    else:
                        opt_rate_table[name][depth] = None
                else:
                    opt_rate_table[name][depth] = None
            else:
                time_table[name][depth] = None
                opt_rate_table[name][depth] = None
    
    # Print Time Table
    print("\n" + "="*80)
    print("Build Time (ms) by Test Case and Depth")
    print("="*80)
    header = f"{'Test Case':<20}"
    for depth in depths:
        header += f"Depth {depth:>2}  "
    print(header)
    print("-"*80)
    
    for name in test_cases:
        row = f"{name:<20}"
        for depth in depths:
            value = time_table[name][depth]
            if value is not None:
                row += f"{value:>9.2f}  "
            else:
                row += f"{'N/A':>9}  "
        print(row)
    
    # Calculate and print average row for time (arithmetic mean)
    print("-"*80)
    avg_row = f"{'Average':<20}"
    for depth in depths:
        times = [time_table[name][depth] for name in test_cases if time_table[name][depth] is not None]
        if times:
            avg_time = sum(times) / len(times)
            avg_row += f"{avg_time:>9.2f}  "
        else:
            avg_row += f"{'N/A':>9}  "
    print(avg_row)
    print("="*80)
    
    # Print Optimization Rate Table
    print("\n" + "="*80)
    print("Code Size Reduction (%) by Test Case and Depth")
    print("="*80)
    header = f"{'Test Case':<20}"
    for depth in depths:
        header += f"Depth {depth:>2}  "
    print(header)
    print("-"*80)
    
    for name in test_cases:
        row = f"{name:<20}"
        for depth in depths:
            value = opt_rate_table[name][depth]
            if value is not None:
                row += f"{value:>9.3f}  "
            else:
                row += f"{'N/A':>9}  "
        print(row)
    
    # Calculate and print average row for optimization rate (geometric mean)
    print("-"*80)
    avg_row = f"{'Average':<20}"
    for depth in depths:
        # Collect size ratios for geometric mean
        ratios = []
        for name in test_cases:
            if opt_rate_table[name][depth] is not None:
                # Convert percentage back to size ratio: ratio = 1 - reduction/100
                ratio = 1 - opt_rate_table[name][depth] / 100
                ratios.append(ratio)
        
        if ratios:
            # Geometric mean of size ratios
            geometric_mean_ratio = math.exp(sum(math.log(r) for r in ratios) / len(ratios))
            # Convert back to percentage: (1 - geomean) * 100
            avg_opt_rate = (1 - geometric_mean_ratio) * 100
            avg_row += f"{avg_opt_rate:>9.3f}  "
        else:
            avg_row += f"{'N/A':>9}  "
    print(avg_row)
    print("="*80 + "\n")

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
    time_data, size_data, sizes_data = load_data()
    
    # Print detailed tables first
    print_detailed_tables(time_data, size_data, sizes_data)
    
    depths, avg_optimization_rates, avg_times = calculate_metrics(time_data, size_data, sizes_data)
    
    # Print summary
    print("Depth Analysis Summary (Geometric Mean):")
    print("-" * 60)
    print(f"{'Depth':<10} {'Reduction (%)':<20} {'Avg Time (ms)':<15}")
    print("-" * 60)
    for d, opt_rate, time in zip(depths, avg_optimization_rates, avg_times):
        print(f"{d:<10} {opt_rate * 100:<20.3f} {time:<15.2f}")
    print("-" * 60)
    
    plot_graph(depths, avg_optimization_rates, avg_times)

if __name__ == '__main__':
    main()
