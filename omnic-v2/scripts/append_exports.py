
import os

footer = """
// Export Functions for Bundle
native "js" {
    if (typeof exports !== 'undefined') {
        exports.Colors_new = Colors_new;
        exports.CLI_COLORS = CLI_COLORS;
        exports.CLI_success = CLI_success;
        exports.CLI_error = CLI_error;
        exports.CLI_warning = CLI_warning;
        exports.CLI_info = CLI_info;
        exports.CLI_step = CLI_step;
        exports.CLI_header = CLI_header;
        exports.CLI_dim = CLI_dim;
        exports.CLI_bold = CLI_bold;
        exports.CLI_green = CLI_green;
        exports.CLI_red = CLI_red;
        exports.CLI_yellow = CLI_yellow;
        exports.CLI_cyan = CLI_cyan;
        exports.Spinner_new = Spinner_new;
        exports.Spinner_start = Spinner_start;
        exports.Spinner_stop = Spinner_stop;
        exports.CLI_progress_bar = CLI_progress_bar;
        exports.ParsedArgs_new = ParsedArgs_new;
        exports.CLI_table_simple = CLI_table_simple;
        exports.CLI_table_header = CLI_table_header;
        exports.CLI_banner = CLI_banner;
        exports.CLI_version = CLI_version;
    }
}
"""

with open("src/lib/cli.omni", "a", encoding="utf-8") as f:
    f.write(footer)
print("Appended exports.")
