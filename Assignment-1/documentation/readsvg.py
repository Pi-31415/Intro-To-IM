from xml.dom import minidom
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
import numpy as np
import re


def parse_path(path_data):
    commands = {'M': 2, 'L': 2, 'Q': 4, 'C': 6, 'Z': 0, 'm': 2, 'l': 2, 'q': 4, 'c': 6, 'z': 0}
    path_re = re.compile("([MLQCZmlqcz])((?:-?[0-9]*\.?[0-9]+(?:e-?[0-9]+)?,?-?[0-9]*\.?[0-9]+(?:e-?[0-9]+)?(?:,?-?[0-9]*\.?[0-9]+(?:e-?[0-9]+)?)*)*)")
    
    parsed_commands = []
    last_x, last_y = 0, 0

    for cmd, values in path_re.findall(path_data):
        points = [float(n) for n in re.findall("-?[0-9]*\.?[0-9]+(?:e-?[0-9]+)?", values)]
        if cmd.islower():
            points = [points[i] + (last_x if i % 2 == 0 else last_y) for i in range(len(points))]
            cmd = cmd.upper()

        if cmd == 'M':
            for i in range(0, len(points), 2):
                parsed_commands.append({'type': 'M', 'x': points[i], 'y': points[i+1]})
                last_x, last_y = points[i], points[i+1]
        elif cmd == 'L':
            for i in range(0, len(points), 2):
                parsed_commands.append({'type': 'L', 'x': points[i], 'y': points[i+1]})
                last_x, last_y = points[i], points[i+1]
        elif cmd == 'Q':
            for i in range(0, len(points), 4):
                parsed_commands.append({'type': 'Q', 'cx': points[i], 'cy': points[i+1], 'x': points[i+2], 'y': points[i+3]})
                last_x, last_y = points[i+2], points[i+3]
        elif cmd == 'C':
            for i in range(0, len(points), 6):
                parsed_commands.append({'type': 'C', 'cx1': points[i], 'cy1': points[i+1], 'cx2': points[i+2], 'cy2': points[i+3], 'x': points[i+4], 'y': points[i+5]})
                last_x, last_y = points[i+4], points[i+5]
        elif cmd == 'Z':
            parsed_commands.append({'type': 'Z'})

    return parsed_commands

def extract_style(doc):
    """ Extract style definitions from the SVG document """
    styles = {}
    style_elements = doc.getElementsByTagName('style')
    for style in style_elements:
        # Extract CSS style content
        css_content = style.firstChild.nodeValue
        # Find class definitions
        for class_def in css_content.split('}'):
            if '{' in class_def:
                class_name, class_style = class_def.split('{')
                class_name = class_name.strip().replace('.', '')  # Remove '.' and whitespace
                styles[class_name] = {}
                # Extract style properties
                for prop in class_style.split(';'):
                    if ':' in prop:
                        key, value = prop.split(':')
                        styles[class_name][key.strip()] = value.strip()
    return styles

def parse_svg_to_p5js(svg_file_path, skip_points=0):
    # Use minidom.parse to read from a file
    doc = minidom.parse(svg_file_path)
    paths = doc.getElementsByTagName('path')
    styles = extract_style(doc)

    p5js_code = []

    for path in paths:
        style = styles.get(path.getAttribute('class'), {})
        fill_color = style.get('fill', '#000000')
        p5js_code.append(f'fill("{fill_color}");')
        p5js_code.append('beginShape();')

        path_data = path.getAttribute('d')
        commands = parse_path(path_data)

        # Counter for skipping points
        point_counter = 0

        for command in commands:
            # Only write points based on the skip_points setting
            if point_counter == 0:
                if command['type'] == 'M':
                    p5js_code.append(f'vertex({command["x"]}, {command["y"]});')
                elif command['type'] == 'L':
                    p5js_code.append(f'vertex({command["x"]}, {command["y"]});')
                elif command['type'] == 'Q':
                    p5js_code.append(f'quadraticVertex({command["cx"]}, {command["cy"]}, {command["x"]}, {command["y"]});')
                elif command['type'] == 'C':
                    p5js_code.append(f'bezierVertex({command["cx1"]}, {command["cy1"]}, {command["cx2"]}, {command["cy2"]}, {command["x"]}, {command["y"]});')
            
            # Update the point counter
            point_counter = (point_counter + 1) % (skip_points + 1)

            if command['type'] == 'Z':
                p5js_code.append('endShape(CLOSE);')
                point_counter = 0  # Reset counter for new shape

    return p5js_code

# Path to the SVG file
svg_file_path = r"/Users/pi/Desktop/PiFinal2.svg"

p5js_code = parse_svg_to_p5js(svg_file_path)

# Write to file
with open('p5.js', 'w') as file:
    file.write('\n'.join(p5js_code))

