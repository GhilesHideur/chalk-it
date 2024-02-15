import json
import os
from pathlib import Path
from taipy.gui.custom import Page
from source.connectors.taipy.resource_handler import PureHTMLResourceHandler
import plotly.express as px

base_path = (Path(__file__).parent / "projects").resolve()
file_name = base_path / "config.xprjson"
json_data = ""
has_file_saved = False
file_list = {}

def load_file(state):
    state.json_data = Path(state.file_name).read_text()


def save_file(state, name, payload):
    if "data" not in payload:
        return
    with open(state.file_name, "w") as f:
        f.write(payload["data"])
    state.has_file_saved = True


# file should only be within base path
def select_file(state, name, payload):
    if "file_name" not in payload:
        return
    potential_file_path = base_path / payload['file_name']
    if os.path.exists(potential_file_path):
        state.file_name = potential_file_path
        
def get_file_list(state):
    # Use glob to find .xprjson files directly within the base directory.
    file_names = [file.name for file in base_path.glob('*.xprjson')]
    file_list_obj = {
        'file_names': file_names,
        'base_path': str(base_path)
    }
    state.file_list = json.dumps(file_list_obj)

a = 8
b = 10
c = a + b * 2


def on_change(state, var, val):
    state.c = state.a + state.b * 2

# Create a Page instance with the resource handler
page = Page(PureHTMLResourceHandler())
